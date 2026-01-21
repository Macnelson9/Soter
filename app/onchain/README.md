# On-Chain Module (Soroban Contracts)

This module contains Soroban smart contracts for Soter's on-chain escrow and claimable packages functionality.

## 🚀 Quick Start

### Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WebAssembly target
rustup target add wasm32-unknown-unknown

# Install Soroban CLI
cargo install --locked soroban-cli