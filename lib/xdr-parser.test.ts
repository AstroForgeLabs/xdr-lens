/**
 * Unit tests for XDR-Lens core parsing library.
 *
 * Tests run via: npm test (Node.js built-in test runner)
 * These cover the pure parsing/transformation logic in lib/ without requiring
 * a browser environment or live RPC connections.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ─── Test: types.ts ──────────────────────────────────────────────────────────

describe('NETWORKS config', async () => {
  const { NETWORKS } = await import('../lib/types.js');

  it('exposes testnet, mainnet, and futurenet configs', () => {
    assert.ok(NETWORKS.testnet, 'testnet config should exist');
    assert.ok(NETWORKS.mainnet, 'mainnet config should exist');
    assert.ok(NETWORKS.futurenet, 'futurenet config should exist');
  });

  it('testnet has correct network passphrase', () => {
    assert.strictEqual(
      NETWORKS.testnet.networkPassphrase,
      'Test SDF Network ; September 2015'
    );
  });

  it('mainnet has correct network passphrase', () => {
    assert.strictEqual(
      NETWORKS.mainnet.networkPassphrase,
      'Public Global Stellar Network ; September 2015'
    );
  });

  it('all networks have RPC URLs', () => {
    for (const [name, config] of Object.entries(NETWORKS)) {
      assert.ok(config.rpcUrl.startsWith('https://'), `${name} rpcUrl should be HTTPS`);
      assert.ok(config.horizonUrl.startsWith('https://'), `${name} horizonUrl should be HTTPS`);
    }
  });
});

// ─── Test: samples.ts ────────────────────────────────────────────────────────

describe('SAMPLES pre-loaded XDR payloads', async () => {
  const { SAMPLES } = await import('../lib/samples.js');

  it('exports at least 3 sample payloads', () => {
    assert.ok(Array.isArray(SAMPLES), 'SAMPLES should be an array');
    assert.ok(SAMPLES.length >= 3, `Expected at least 3 samples, got ${SAMPLES.length}`);
  });

  it('each sample has required fields', () => {
    for (const sample of SAMPLES) {
      assert.ok(sample.id, `Sample missing id`);
      assert.ok(sample.label, `Sample "${sample.id}" missing label`);
      assert.ok(sample.xdr, `Sample "${sample.id}" missing xdr`);
      assert.ok(['soroban', 'classic', 'feebump'].includes(sample.category),
        `Sample "${sample.id}" has invalid category: ${sample.category}`);
      assert.ok(['testnet', 'mainnet'].includes(sample.network),
        `Sample "${sample.id}" has invalid network: ${sample.network}`);
    }
  });

  it('sample XDR strings are non-empty base64', () => {
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    for (const sample of SAMPLES) {
      assert.match(sample.xdr, base64Regex, `Sample "${sample.id}" XDR is not valid base64`);
    }
  });
});

// ─── Test: xdr-parser.ts — error handling ────────────────────────────────────

describe('parseXdrEnvelope — error handling', async () => {
  const { parseXdrEnvelope } = await import('../lib/xdr-parser.js');
  const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015';

  it('throws on empty string input', () => {
    assert.throws(
      () => parseXdrEnvelope('', TESTNET_PASSPHRASE),
      /Failed to decode|Unsupported/,
      'Should throw a descriptive error for empty input'
    );
  });

  it('throws on invalid base64 garbage', () => {
    assert.throws(
      () => parseXdrEnvelope('not-valid-xdr-at-all!!!', TESTNET_PASSPHRASE),
      Error,
      'Should throw for non-XDR input'
    );
  });

  it('throws on plain text string', () => {
    assert.throws(
      () => parseXdrEnvelope('hello world', TESTNET_PASSPHRASE),
      Error,
      'Should throw for plaintext input'
    );
  });
});

// ─── Test: soroban-simulator.ts — offline error path ─────────────────────────

describe('simulateSorobanTransaction — offline error handling', async () => {
  const { simulateSorobanTransaction } = await import('../lib/soroban-simulator.js');

  it('returns a structured error result for invalid XDR without crashing', async () => {
    const result = await simulateSorobanTransaction('invalid_xdr', 'testnet');
    assert.strictEqual(result.success, false, 'Should not succeed for invalid XDR');
    assert.ok(result.error, 'Should include an error message');
    assert.ok(typeof result.status === 'string', 'Should have a status string');
  });
});
