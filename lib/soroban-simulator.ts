import { rpc, TransactionBuilder, scValToNative } from '@stellar/stellar-sdk';
import { NETWORKS, SimulationResult, StellarNetwork } from './types';

export async function simulateSorobanTransaction(
  base64Xdr: string,
  network: StellarNetwork,
  customRpcUrl?: string
): Promise<SimulationResult> {
  const config = NETWORKS[network];
  const rpcUrl = customRpcUrl || config.rpcUrl;
  const server = new rpc.Server(rpcUrl, { allowHttp: false });

  try {
    const tx = TransactionBuilder.fromXDR(base64Xdr.trim(), config.networkPassphrase);
    const simResponse = await server.simulateTransaction(tx);

    if (rpc.Api.isSimulationSuccess(simResponse)) {
      const simSuccess = simResponse as any;
      const rawResults = simSuccess.result ? [simSuccess.result] : simSuccess.results || [];

      const resultsFormatted = rawResults.map((res: any) => {
        let nativeVal: any = null;
        if (res.retval) {
          try {
            nativeVal = scValToNative(res.retval);
          } catch {
            nativeVal = typeof res.retval.toXDR === 'function' ? res.retval.toXDR('base64') : String(res.retval);
          }
        }
        return {
          auth: res.auth ? res.auth.map((a: any) => (typeof a === 'string' ? a : (typeof a.toXDR === 'function' ? a.toXDR('base64') : String(a)))) : [],
          xdr: res.retval && typeof res.retval.toXDR === 'function' ? res.retval.toXDR('base64') : undefined,
          returnValue: nativeVal,
        };
      });

      const rawEvents = simSuccess.events || [];
      const eventsFormatted = rawEvents.map((evItem: any) => {
        let topicStrList: string[] = [];
        let valStr = '';
        let eventType = 'diagnostic';
        let contractIdStr: string | undefined = undefined;

        try {
          const ev = evItem.event || evItem;
          eventType = typeof ev.type === 'function' ? ev.type().name : (ev.type || 'contract');
          if (typeof ev.contractId === 'function' && ev.contractId()) {
            contractIdStr = ev.contractId().toString('hex');
          }

          if (typeof ev.body === 'function') {
            const bodyV0 = ev.body().v0();
            topicStrList = (bodyV0.topics() || []).map((t: any) => {
              try { return String(scValToNative(t)); } catch { return String(t); }
            });
            valStr = String(scValToNative(bodyV0.data()));
          }
        } catch {
          valStr = 'Raw Event Data';
        }

        return {
          type: eventType,
          contractId: contractIdStr,
          topics: topicStrList,
          value: valStr,
        };
      });

      return {
        success: true,
        status: 'SUCCESS',
        minResourceFee: simSuccess.minResourceFee ? String(simSuccess.minResourceFee) : '0',
        cpuInstructions: Number(simSuccess.cost?.cpuInsns || 0),
        memoryBytes: Number(simSuccess.cost?.memBytes || 0),
        results: resultsFormatted,
        events: eventsFormatted,
      };
    } else if (rpc.Api.isSimulationError(simResponse)) {
      return {
        success: false,
        status: 'ERROR',
        error: (simResponse as any).error || 'Transaction simulation failed on Soroban RPC.',
      };
    } else {
      return {
        success: false,
        status: 'FAILED',
        error: 'Simulation did not complete successfully.',
      };
    }
  } catch (err) {
    return {
      success: false,
      status: 'RPC_FETCH_ERROR',
      error: `RPC Connection / Parse Error: ${(err as Error).message}`,
    };
  }
}
