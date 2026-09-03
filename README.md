# XDR-Lens

[![CI](https://github.com/SmartCraftGroup/xdr-lens/actions/workflows/ci.yml/badge.svg)](https://github.com/SmartCraftGroup/xdr-lens/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-v14-black.svg)](https://nextjs.org/)
[![Drips Wave](https://img.shields.io/badge/Drips-Stellar%20Wave-blue.svg)](https://drips.network)

**XDR-Lens** is an interactive Stellar XDR transaction visualizer, decoder, and pre-broadcast simulator. It allows developers, QA engineers, and security auditors to decode raw Stellar base64 XDR payloads, inspect transaction envelope operations, simulate execution outcomes against Testnet/Mainnet RPCs, and view clear before-and-after balance change diagnostics.

---

## Why XDR-Lens Exists

Stellar transactions and ledger entries are serialized in base64 XDR (External Data Representation). 

While standard Laboratory tools decode basic XDR fields, developers lack an interactive tool that **simulates execution outcomes before broadcasting** — showing expected fee-bump wrappers, account balance changes, operation call trees, and exact failure diagnostics without risking real funds.

---

## Key Features

- **Interactive XDR Decoder:** Paste any Stellar XDR (`TransactionEnvelope`, `TransactionResult`, `LedgerEntry`) for instant tree-view decomposition.
- **Pre-Broadcast Simulation:** Simulates transaction execution against live Horizon RPCs (`simulateTransaction`), detailing CPU/RAM gas costs and return codes.
- **Visual Balance Diff:** Displays a human-readable diff of account XLM and asset token balances resulting from transaction execution.
- **Operation Call Tree:** Renders multi-operation transactions (Payment, ChangeTrust, SetOptions, ManageBuyOffer) into clean visual flow diagrams.
- **Chrome Extension Compatible:** Inspect XDR payloads directly from dApp web pages or explorer URLs.

---

## Architecture Overview

```
                      +-------------------+
                      |   User / Web UI   |
                      +---------+---------+
                                | (Base64 XDR Payload)
                                v
                      +-------------------+
                      |     xdr-lens      |
                      |  (Decoder Engine) |
                      +---------+---------+
                                |
       +------------------------+------------------------+
       |                                                 |
       v                                                 v
+-------------------------------+               +-------------------------------+
| @stellar/stellar-sdk Decoder  |               | Horizon Simulation API        |
| (Envelope / Operations Tree)  |               | (Pre-Broadcast Diff Engine)   |
+-------------------------------+               +-------------------------------+
```

---

## Quickstart & Local Development

### 1. Clone & Install
```bash
git clone https://github.com/SmartCraftGroup/xdr-lens.git
cd xdr-lens
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supported XDR Types

- `TransactionEnvelope` (`ENVELOPE_TYPE_TX_V0`, `ENVELOPE_TYPE_TX`, `ENVELOPE_TYPE_TX_FEE_BUMP`)
- `TransactionResult`
- `LedgerEntry`
- `AccountEntry`
- `TrustLineEntry`

---

## Maintainers & Contact

| Maintainer | Role | Contact |
|---|---|---|
| **Abdulmalik Ojo** (`@tecmalik`) | Maintainer | [abdulmalikojo2@gmail.com](mailto:abdulmalikojo2@gmail.com) |
| **Hikmah Oladele** (`@Hikmaholadele`) | Maintainer | [edit@gmail.com](mailto:edit@gmail.com) |

---

## License

MIT — see [`LICENSE`](./LICENSE).
