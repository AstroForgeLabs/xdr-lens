export interface XdrSample {
  id: string;
  label: string;
  description: string;
  category: 'soroban' | 'classic' | 'feebump';
  xdr: string;
  network: 'testnet' | 'mainnet';
}

export const SAMPLES: XdrSample[] = [
  {
    id: 'soroban-invoke',
    label: 'Soroban Token Increment Call',
    description: 'Soroban smart contract host function invocation with footprint and auth entries.',
    category: 'soroban',
    network: 'testnet',
    xdr: 'AAAAAgAAAAA2k/bS4t4s8p/J1d0l5T0K7x8k1g7k1l/2m3n5k7l8AAAAZAAAAAYAAAABAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAkAAAAAAAAAAAAAAAIAAAABAAAAAQAAAABNQUlOAAAAAAAAAAA=',
  },
  {
    id: 'classic-payment',
    label: 'Classic XLM Payment',
    description: 'Standard Stellar payment operation transferring native XLM token between accounts.',
    category: 'classic',
    network: 'testnet',
    xdr: 'AAAAAgAAAACu1+jI72M8+UqJ3uWk+P9g3r2V3t5+4V0/9l5m/2k1AAAAZAAAAAEAAAABAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAAatfQ1d0p5T0K7x8k1g7k1l/2m3n5k7l8AAAAAAAAB9ABAAA=',
  },
  {
    id: 'fee-bump',
    label: 'Fee-Bump Transaction Wrapper',
    description: 'Fee bump transaction wrapping an inner payment envelope.',
    category: 'feebump',
    network: 'testnet',
    xdr: 'AAAAAgAAAAD2k/bS4t4s8p/J1d0l5T0K7x8k1g7k1l/2m3n5k7l8AAAAZAAAAAYAAAABAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAkAAAAAAAAAAAAAAAIAAAABAAAAAQAAAABNQUlOAAAAAAAAAAA=',
  },
];
