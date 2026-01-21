
### **5. `app/onchain/CONTRIBUTING.md`** (Contributor guidelines)
```markdown
# Contributing to On-Chain Contracts

Welcome! This document outlines how to contribute to Soter's on-chain contracts.

## 📋 Code Standards

### Rust Style Guide
- Follow the [Rust Style Guide](https://doc.rust-lang.org/nightly/style-guide/)
- Use `cargo fmt` before committing
- No warnings allowed (`cargo clippy -- -D warnings`)

### Contract-Specific Standards
- **Naming**:
  - Structs: `PascalCase` (e.g., `AidEscrow`)
  - Functions: `snake_case` (e.g., `create_package`)
  - Constants: `SCREAMING_SNAKE_CASE` (e.g., `MAX_PACKAGE_AMOUNT`)
- **Storage**: Use descriptive keys, avoid collisions
- **Errors**: Use custom error types, not string literals

### Documentation
```rust
/// Creates a new aid package
///
/// # Arguments
/// * `env` - The Soroban environment
/// * `recipient` - Address of the recipient
/// * `amount` - Amount to escrow
/// * `token` - Token contract address
///
/// # Returns
/// * `u64` - Package ID
///
/// # Errors
/// Returns `Error::InvalidAmount` if amount is zero
/// Returns `Error::InvalidToken` if token address is invalid
pub fn create_package(env: Env, recipient: Address, amount: i128, token: Address) -> Result<u64, Error> {
    // implementation
}