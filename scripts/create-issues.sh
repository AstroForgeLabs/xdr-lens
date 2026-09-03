#!/usr/bin/env bash
# Script to generate GitHub issues at scale for XDR-Lens (Drips Wave compliance)
# Run `chmod +x scripts/create-issues.sh && ./scripts/create-issues.sh` after authenticating gh CLI (`gh auth login`)

echo "Creating GitHub issues for XDR-Lens..."

gh issue create --title "feat(simulation): add visual state diffing for Soroban ledger footprint key changes" \
  --label "enhancement,good first issue" \
  --body "## Summary
Enhance the Footprint & Simulation panel to show before-and-after storage key state diffs when a Soroban contract call modifies persistent storage entries.

## Acceptance Criteria
- [ ] Parse simulated ledger footprint write entries from RPC response.
- [ ] Display visual diff badge (Created, Modified, Deleted) next to each storage key.
- [ ] Highlight storage key durability type (Persistent vs Temporary).

## Tech Stack
TypeScript, Next.js, @stellar/stellar-sdk, React"

gh issue create --title "feat(decoder): add support for custom WASM contract spec event decoding" \
  --label "enhancement,soroban" \
  --body "## Summary
Decode raw contract event topics and data using imported custom Soroban contract WASM specs or interface definitions.

## Acceptance Criteria
- [ ] Allow uploading contract spec WASM or JSON interface.
- [ ] Map ScVal event topics to named function event parameters.
- [ ] Render formatted event logs in SimulationPanel.

## Tech Stack
TypeScript, @stellar/stellar-sdk, WebAssembly"

gh issue create --title "feat(extension): scaffold Manifest V3 Chrome Extension popup wrapper" \
  --label "feature,extension" \
  --body "## Summary
Build a Chrome Extension wrapper that allows developers to inspect base64 XDR payloads directly from dApp web pages or explorer tabs.

## Acceptance Criteria
- [ ] Create Manifest V3 chrome extension scaffold in packages/extension.
- [ ] Detect base64 XDR strings on active web pages via context menu.
- [ ] Open selected XDR payload directly in XDR-Lens web studio.

## Tech Stack
Chrome Extension Manifest V3, JavaScript/TypeScript"

gh issue create --title "feat(export): add export diagnostic report to JSON/Markdown" \
  --label "good first issue,documentation" \
  --body "## Summary
Allow developers and security auditors to export the complete diagnostic report (envelope, footprint, auth trees, RPC simulation) as a downloadable JSON or Markdown summary.

## Acceptance Criteria
- [ ] Add 'Export Report' button in header toolbar.
- [ ] Generate formatted Markdown document with CPU/RAM metrics and auth trees.
- [ ] Trigger client-side file download (.json / .md).

## Tech Stack
TypeScript, React, Blob API"

gh issue create --title "test(e2e): add Playwright end-to-end test suite for XDR simulation flows" \
  --label "testing,ci" \
  --body "## Summary
Implement Playwright E2E tests to verify XDR parsing, sample pre-fill loading, tab switching, and live RPC simulation response handling in CI.

## Acceptance Criteria
- [ ] Install @playwright/test.
- [ ] Add E2E test cases for classic XLM payment sample and Soroban token call sample.
- [ ] Integrate E2E test run in GitHub Actions workflow.

## Tech Stack
Playwright, TypeScript, GitHub Actions"

echo "All GitHub issues created successfully!"
