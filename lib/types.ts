export type StellarNetwork = 'testnet' | 'mainnet' | 'futurenet';

export interface NetworkConfig {
  name: string;
  networkPassphrase: string;
  rpcUrl: string;
  horizonUrl: string;
}

export const NETWORKS: Record<StellarNetwork, NetworkConfig> = {
  testnet: {
    name: 'Testnet',
    networkPassphrase: 'Test SDF Network ; September 2015',
    rpcUrl: 'https://soroban-testnet.stellar.org',
    horizonUrl: 'https://horizon-testnet.stellar.org',
  },
  mainnet: {
    name: 'Mainnet',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    rpcUrl: 'https://mainnet.sorobanrpc.com',
    horizonUrl: 'https://horizon.stellar.org',
  },
  futurenet: {
    name: 'Futurenet',
    networkPassphrase: 'Test SDF Future Network ; October 2022',
    rpcUrl: 'https://rpc-futurenet.stellar.org',
    horizonUrl: 'https://horizon-futurenet.stellar.org',
  },
};

export interface DecodedOperation {
  type: string;
  sourceAccount?: string;
  details: Record<string, any>;
}

export interface DecodedEnvelope {
  type: 'ENVELOPE_TYPE_TX' | 'ENVELOPE_TYPE_TX_V0' | 'ENVELOPE_TYPE_TX_FEE_BUMP' | 'UNKNOWN';
  sourceAccount: string;
  sequenceNumber: string;
  fee: string;
  memo?: {
    type: string;
    value?: string;
  };
  timeBounds?: {
    minTime: string;
    maxTime: string;
  };
  operations: DecodedOperation[];
  signaturesCount: number;
  feeBump?: {
    feeSource: string;
    fee: string;
    innerSignaturesCount: number;
  };
  hasSorobanData: boolean;
}

export interface FootprintEntry {
  type: 'persistent' | 'temporary' | 'instance' | 'code' | 'config' | 'ttl' | 'other';
  keyXdr: string;
  contractId?: string;
  accessType: 'readOnly' | 'readWrite';
  details: string;
}

export interface SorobanResourceSummary {
  cpuInstructions: number;
  memoryBytes: number;
  minResourceFee: string;
  readOnlyFootprintCount: number;
  readWriteFootprintCount: number;
  footprintKeys: FootprintEntry[];
}

export interface AuthNode {
  id: string;
  contractId: string;
  functionName: string;
  args: string[];
  credentials: {
    type: 'address' | 'root';
    address?: string;
    nonce?: string;
    signatureExpirationLedger?: number;
  };
  subInvocations: AuthNode[];
}

export interface SimulationResult {
  success: boolean;
  status: string;
  minResourceFee?: string;
  cpuInstructions?: number;
  memoryBytes?: number;
  results?: Array<{
    auth?: string[];
    xdr?: string;
    returnValue?: any;
  }>;
  events?: Array<{
    type: string;
    contractId?: string;
    topics: string[];
    value: string;
  }>;
  error?: string;
  diagnosticEvents?: string[];
}
