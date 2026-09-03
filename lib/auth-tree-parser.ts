import {
  xdr,
  TransactionBuilder,
  FeeBumpTransaction,
  Transaction,
  Address,
  scValToNative,
} from '@stellar/stellar-sdk';
import { AuthNode } from './types';

export function extractAuthTrees(base64Xdr: string, passphrase: string): AuthNode[] {
  try {
    const tx = TransactionBuilder.fromXDR(base64Xdr.trim(), passphrase);
    const targetTx = tx instanceof FeeBumpTransaction ? tx.innerTransaction : (tx as Transaction);

    const nodes: AuthNode[] = [];

    for (const op of targetTx.operations) {
      if (op.type === 'invokeHostFunction') {
        const authEntries = (op as any).auth || [];
        for (let i = 0; i < authEntries.length; i++) {
          const rawAuth = authEntries[i];
          let authEntry: xdr.SorobanAuthorizationEntry;

          if (typeof rawAuth === 'string') {
            authEntry = xdr.SorobanAuthorizationEntry.fromXDR(rawAuth, 'base64');
          } else if (rawAuth instanceof xdr.SorobanAuthorizationEntry) {
            authEntry = rawAuth;
          } else {
            continue;
          }

          const parsedNode = parseSorobanAuthEntry(authEntry, `auth-${i}`);
          if (parsedNode) {
            nodes.push(parsedNode);
          }
        }
      }
    }

    return nodes;
  } catch (e) {
    return [];
  }
}

function parseSorobanAuthEntry(entry: xdr.SorobanAuthorizationEntry, id: string): AuthNode | null {
  try {
    const credentials = entry.credentials();
    const rootInvocation = entry.rootInvocation();

    let credType: 'address' | 'root' = 'root';
    let addressStr: string | undefined;
    let nonceStr: string | undefined;
    let expirationLedger: number | undefined;

    const credSwitch = credentials.switch().name;

    if (credSwitch === 'sorobanCredentialsAddress') {
      credType = 'address';
      const addrCred = credentials.address();
      addressStr = Address.fromScAddress(addrCred.address()).toString();
      nonceStr = addrCred.nonce().toString();
      expirationLedger = addrCred.signatureExpirationLedger();
    }

    return parseAuthorizedInvocation(rootInvocation, id, credType, addressStr, nonceStr, expirationLedger);
  } catch (e) {
    return null;
  }
}

function parseAuthorizedInvocation(
  invocation: xdr.SorobanAuthorizedInvocation,
  id: string,
  credType: 'address' | 'root',
  addressStr?: string,
  nonceStr?: string,
  expirationLedger?: number
): AuthNode {
  const functionCalled = invocation.function();
  const fnSwitch = functionCalled.switch().name;

  let contractId = 'Unknown Contract';
  let functionName = 'Unknown Method';
  let args: string[] = [];

  if (fnSwitch === 'sorobanAuthorizedFunctionTypeContractFn') {
    const contractFn = functionCalled.contractFn();
    contractId = Address.fromScAddress(contractFn.contractAddress()).toString();
    functionName = contractFn.functionName().toString();
    args = contractFn.args().map((scVal) => {
      try {
        const native = scValToNative(scVal);
        return typeof native === 'object' ? JSON.stringify(native) : String(native);
      } catch {
        return scVal.switch().name;
      }
    });
  } else if (fnSwitch === 'sorobanAuthorizedFunctionTypeCreateContractHostFn') {
    functionName = 'create_contract';
  }

  const subInvocations: AuthNode[] = invocation.subInvocations().map((sub, index) => {
    return parseAuthorizedInvocation(sub, `${id}-sub-${index}`, credType, addressStr, nonceStr, expirationLedger);
  });

  return {
    id,
    contractId,
    functionName,
    args,
    credentials: {
      type: credType,
      address: addressStr,
      nonce: nonceStr,
      signatureExpirationLedger: expirationLedger,
    },
    subInvocations,
  };
}
