# Contributing to XDR-Lens

Thank you for considering contributing to **XDR-Lens**! We welcome bug reports, feature suggestions, and pull requests from the community.

## Code of Conduct & Standards

- **Language:** Written in TypeScript, React, and Next.js 14.
- **Git Commit Format:** We strictly follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat(scope): description`
  - `fix(scope): description`
  - `docs(scope): description`
  - `test(scope): description`
  - `refactor(scope): description`
- **Single Responsibility Commits:** One logical change per commit. Avoid batching unrelated modifications.

## Development Workflow

1. Fork the repository and create a feature branch:
   ```bash
   git checkout -b feat/soroban-footprint-enhancement
   ```
2. Install dependencies and run dev server:
   ```bash
   npm install
   npm run dev
   ```
3. Verify your changes pass typechecking and build clean:
   ```bash
   npm run typecheck
   npm run build
   ```
4. Push your branch and open a Pull Request.

## Reporting Issues

Use GitHub Issues to report bugs or request features. Please include:
- A descriptive title.
- Clear steps to reproduce the issue.
- Sample XDR payload (if applicable).
- Expected vs actual behavior.
