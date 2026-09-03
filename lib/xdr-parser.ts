import {
  xdr,
  TransactionBuilder,
  FeeBumpTransaction,
  Transaction,
  Address,
  StrKey,
  scValToNative,
} from '@stellar/stellar-sdk';
import { DecodedEnvelope, DecodedOperation, FootprintEntry, SorobanResourceSummary } from './types';

export function parseXdrEnvelope(base64Xdr: string, passphrase: string): DecodedEnvelope {
  const trimmed = base64Xdr.trim();
  
  try {
    const tx = TransactionBuilder.fromXDR(trimmed, passphrase);
    
    if (tx instanceof FeeBumpTransaction) {
      const innerTx = tx.innerTransaction;
      return {
        type: 'ENVELOPE_TYPE_TX_FEE_BUMP',
        sourceAccount: innerTx.source,
        sequenceNumber: innerTx.sequence,
        fee: tx.fee,
        memo: {
          type: innerTx.memo.type,
          value: innerTx.memo.value ? innerTx.memo.value.toString() : undefined,
        },
        operations: parseOperations(innerTx.operations),
        signaturesCount: tx.signatures.length,
        feeBump: {
          feeSource: tx.feeSource,
          fee: tx.fee,
          innerSignaturesCount: innerTx.signatures.length,
        },
        hasSorobanData: checkHasSorobanData(innerTx),
      };
    } else if (tx instanceof Transaction) {
      return {
        type: 'ENVELOPE_TYPE_TX',
        sourceAccount: tx.source,
        sequenceNumber: tx.sequence,
        fee: tx.fee,
        memo: {
          type: tx.memo.type,
          value: tx.memo.value ? tx.memo.value.toString() : undefined,
        },
        timeBounds: tx.timeBounds
          ? { minTime: tx.timeBounds.minTime, maxTime: tx.timeBounds.maxTime }
          : undefined,
        operations: parseOperations(tx.operations),
        signaturesCount: tx.signatures.length,
        hasSorobanData: checkHasSorobanData(tx),
      };
    }
  } catch (err) {
    try {
      const env = xdr.TransactionEnvelope.fromXDR(trimmed, 'base64');
      const switchType = env.switch().name;

      if (switchType === 'envelopeTypeTx') {
        const txV1 = env.v1().tx();
        const sourceEd25519 = txV1.sourceAccount().ed25519();
        const sourcePubKey = StrKey.encodeEd25519PublicKey(sourceEd25519);

        return {
          type: 'ENVELOPE_TYPE_TX',
          sourceAccount: sourcePubKey,
          sequenceNumber: txV1.seqNum().toString(),
          fee: txV1.fee().toString(),
          operations: txV1.operations().map((op) => ({
            type: op.body().switch().name,
            details: { body: op.body().switch().name },
          })),
          signaturesCount: env.v1().signatures().length,
          hasSorobanData: !!txV1.ext().sorobanData(),
        };
      }
    } catch (e) {
      throw new Error(`Failed to decode XDR envelope: ${(err as Error).message}`);
    }
  }

  throw new Error('Unsupported XDR payload format. Please provide a valid Stellar TransactionEnvelope.');
}

function parseOperations(ops: any[]): DecodedOperation[] {
  return ops.map((op) => {
    const type = op.type || 'unknown';
    const details: Record<string, any> = {};

    Object.keys(op).forEach((key) => {
      if (key !== 'type' && key !== 'source' && typeof op[key] !== 'function') {
        details[key] = formatDetailValue(op[key]);
      }
    });

    return {
      type,
      sourceAccount: op.source,
      details,
    };
  });
}

function formatDetailValue(val: any): any {
  if (val === null || val === undefined) return val;
  if (typeof val === 'bigint') return val.toString();
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return val;
  if (Array.isArray(val)) return val.map(formatDetailValue);
  if (val && typeof val === 'object') {
    if (val._arm) return val._arm;
    if (val.value) return formatDetailValue(val.value);
    const obj: Record<string, any> = {};
    for (const k of Object.keys(val)) {
      if (!k.startsWith('_')) {
        obj[k] = formatDetailValue(val[k]);
      }
    }
    return obj;
  }
  return String(val);
}

function checkHasSorobanData(tx: Transaction): boolean {
  try {
    return tx.operations.some(
      (op) => op.type === 'invokeHostFunction' || op.type === 'restoreFootprint' || op.type === 'extendFootprintTtl'
    );
  } catch {
    return false;
  }
}

export function extractSorobanResourceSummary(base64Xdr: string, passphrase: string): SorobanResourceSummary | null {
  try {
    const tx = TransactionBuilder.fromXDR(base64Xdr.trim(), passphrase);
    const targetTx = tx instanceof FeeBumpTransaction ? tx.innerTransaction : (tx as Transaction);

    const sorobanData = (targetTx as any).sorobanData;
    if (!sorobanData) {
      return null;
    }

    const resources = sorobanData.resources();
    const footprint = resources.footprint();
    
    const readOnlyKeys: FootprintEntry[] = footprint.readOnly().map((key: xdr.LedgerKey) => parseFootprintKey(key, 'readOnly'));
    const readWriteKeys: FootprintEntry[] = footprint.readWrite().map((key: xdr.LedgerKey) => parseFootprintKey(key, 'readWrite'));

    return {
      cpuInstructions: resources.instructions(),
      memoryBytes: resources.readBytes(),
      minResourceFee: sorobanData.resourceFee().toString(),
      readOnlyFootprintCount: readOnlyKeys.length,
      readWriteFootprintCount: readWriteKeys.length,
      footprintKeys: [...readOnlyKeys, ...readWriteKeys],
    };
  } catch (e) {
    return null;
  }
}

function parseFootprintKey(key: xdr.LedgerKey, accessType: 'readOnly' | 'readWrite'): FootprintEntry {
  const switchName: string = key.switch().name;
  let type: FootprintEntry['type'] = 'other';
  let contractId: string | undefined;
  let details: string = switchName;

  try {
    if (switchName === 'contractData') {
      const contractData = key.contractData();
      type = 'persistent';
      contractId = Address.fromScAddress(contractData.contract()).toString();
      details = `ContractData (${contractData.durability().name}): ${formatScValSummary(contractData.key())}`;
    } else if (switchName === 'contractCode') {
      type = 'code';
      const codeHash = (key.contractCode() as any).hash ? (key.contractCode() as any).hash().toString('hex') : 'hash';
      details = `ContractCode WasmHash: ${codeHash.substring(0, 12)}...`;
    } else if (switchName === 'ttl') {
      type = 'ttl';
      details = `TTL Entry Hash: ${key.ttl().keyHash().toString('hex').substring(0, 12)}...`;
    } else if (switchName === 'account') {
      type = 'other';
      const pubKey = StrKey.encodeEd25519PublicKey(key.account().accountId().ed25519());
      details = `Account Entry: ${pubKey}`;
    } else if (switchName === 'trustline') {
      type = 'other';
      details = `TrustLine Entry`;
    }
  } catch (e) {
    details = `Footprint Entry: ${switchName}`;
  }

  return {
    type,
    keyXdr: key.toXDR('base64'),
    contractId,
    accessType,
    details,
  };
}

function formatScValSummary(scVal: xdr.ScVal): string {
  try {
    const native = scValToNative(scVal);
    if (typeof native === 'object') {
      return JSON.stringify(native);
    }
    return String(native);
  } catch {
    return scVal.switch().name;
  }
}
