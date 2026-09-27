# XDR-Lens: Soroban Pre-Execution Diagnostic Studio

[![CI](https://github.com/AstroForgeLabs/xdr-lens/actions/workflows/ci.yml/badge.svg)](https://github.com/AstroForgeLabs/xdr-lens/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-v14-black.svg)](https://nextjs.org/)
[![Stellar Protocol 20+](https://img.shields.io/badge/Stellar-Protocol%2020%2B-purple.svg)](https://stellar.org)
[![Drips Wave](https://img.shields.io/badge/Drips-Stellar%20Wave-blue.svg)](https://drips.network)

**XDR-Lens** is an interactive **Soroban Pre-Execution Diagnostic Studio** built for Stellar smart contract developers, QA engineers, and security auditors. Unlike generic XDR tools, XDR-Lens specializes in analyzing **Soroban CPU & RAM footprints**, decoding nested **`SorobanAuthorizationEntry` call trees**, and dry-running execution against Stellar RPC endpoints before signing or broadcasting transactions to the ledger.

---

## Why XDR-Lens Exists

Stellar transactions and smart contract invocations are serialized in binary Base64 XDR (External Data Representation).

While standard laboratory tools decode raw XDR fields into flat JSON structures, developers face significant friction when debugging complex Soroban transactions:
- **Obscure Resource Limits:** No simple visual feedback on whether a contract call will exceed CPU instructions or RAM read byte limits.
- **Nested Auth Tree Complexity:** Multi-contract invocations require tracing authorized signers, nonces, and signature expiration ledgers across nested sub-calls.
- **Pre-Broadcast Risk:** Developers need instant, dry-run simulation feedback with decoded return values and emitted diagnostic events without broadcasting real transactions.

---

## Key Features

- 🔬 **Soroban Footprint & Gas Analyzer:** Visualizes CPU instruction gas meters, memory read footprints (KB), and minimum resource fees in stroops.
- 🛡️ **Auth Entry Tree Visualizer:** Recursively decodes `SorobanAuthorizationEntry` trees, highlighting contract call targets, function arguments, nonces, and signature requirement scopes.
- ⚡ **Pre-Execution RPC Simulator:** Dry-runs transaction execution live against Stellar Testnet, Mainnet, and Futurenet Soroban RPC endpoints without risking real funds.
- 📦 **Envelope & Operations Tree Decoder:** Full support for `ENVELOPE_TYPE_TX`, `ENVELOPE_TYPE_TX_FEE_BUMP`, fee-bump wrappers, sequence numbers, and operation summaries.
- 🎯 **Pre-Loaded Sample Payloads:** Includes instant test vectors for Soroban contract calls, classic XLM payments, and fee bump transactions.

---

## Architecture Overview

```
                      +-------------------+
                      |   User / Web UI   |
                      +---------+---------+
                                | (Base64 XDR Payload)
                                v
                      +-------------------+
                      |     XDR-Lens      |
                      | (Diagnostic Engine)|
                      +----+----+----+----+
                           |    |    |
        +------------------+    |    +------------------+
        |                       v                       |
        v               +---------------+               v
+---------------+       |  Auth Tree    |       +---------------+
| Envelope      |       |  Decoder      |       | Live Soroban  |
| Parser        |       +---------------+       | RPC Simulator |
+---------------+                               +---------------+
```

---

## Quickstart & Local Development

### 1. Clone & Install
```bash
git clone https://github.com/AstroForgeLabs/xdr-lens.git
cd xdr-lens
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Typecheck & Build
```bash
npm run typecheck
npm run build
```

---

## Supported XDR Types

- `TransactionEnvelope` (`ENVELOPE_TYPE_TX_V0`, `ENVELOPE_TYPE_TX`, `ENVELOPE_TYPE_TX_FEE_BUMP`)
- `SorobanTransactionData` & `LedgerKey` Footprints (`contractData`, `contractCode`, `ttl`, `account`, `trustline`)
- `SorobanAuthorizationEntry` & `SorobanAuthorizedInvocation` Trees
- `TransactionResult`

---

## Maintainers & Contact

| Maintainer | Role | Contact |
|---|---|---|
| **Abdulmalik Ojo** (`@tecmalik`) | Maintainer | [abdulmalikojo2@gmail.com](mailto:abdulmalikojo2@gmail.com) |
| **Hikmah Oladele** (`@Hikmaholadele`) | Maintainer | [hikmaholadele@gmail.com](mailto:hikmaholadele@gmail.com) |

---

## Security & Contributions

- Please see [`SECURITY.md`](./SECURITY.md) for vulnerability reporting and security audit status disclaimers.
- Please see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for contribution guidelines and conventional commit rules.

---

## License

MIT — see [`LICENSE`](./LICENSE).
