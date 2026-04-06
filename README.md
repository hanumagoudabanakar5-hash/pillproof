# PillProof: Autonomous Medicine Procurement
**Blockchain Powered Anti-Counterfeit System**

## 📌 Problem Statement
MSIH25065 — Autonomous Procurement Agent for India's public healthcare system.

## 🚀 The Solution
PillProof automates the procurement of medicines. It uses Algorand smart contracts to:
1. **Mint ARC-3 ASAs** for every medicine batch (Provenance).
2. **Lock payments in Escrow** (Financial Security).
3. **Verify QR-hashes** on-chain (Counterfeit Detection).
4. **Auto-release payments** upon genuine verification (Automation).

## 🛠️ Tech Stack
- **Blockchain:** Algorand Testnet (Smart Contracts)
- **Backend:** FastAPI (Python)
- **Frontend:** Next.js (React + Tailwind CSS)
- **Database:** Supabase
- **Storage:** IPFS (via Pinata)

## 📂 Project Structure
- `/contracts`: Smart contracts for Registry, Escrow, and Alerts.
- `/backend`: FastAPI server for blockchain interaction.
- `/frontend`: Next.js dashboard for users and regulators.
- `/docs`: Technical architecture and demo flow.
