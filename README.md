readme_content = """# 💊 PillProof — Autonomous Medicine Procurement
### Blockchain Powered Anti-Counterfeit System

> **Hackathon Problem Statement:** MSIH25065 — Autonomous Procurement Agent for India's public healthcare system.

---

## 📌 Problem Statement

India's public healthcare procurement system is plagued by counterfeit medicines, delayed payments, and lack of transparency. PillProof solves this end-to-end using blockchain automation.

---

## 🚀 The Solution

PillProof automates the procurement of medicines using Algorand smart contracts to:

1. **Mint ARC-3 ASAs** for every medicine batch (Provenance)
2. **Lock payments in Escrow** (Financial Security)
3. **Verify QR-hashes on-chain** (Counterfeit Detection)
4. **Auto-release payments** upon genuine verification (Automation)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Algorand Testnet (Smart Contracts) |
| Backend | FastAPI (Python) |
| Frontend | Next.js (React + Tailwind CSS) |
| Database | Supabase |
| Storage | IPFS via Pinata |

---

## 📂 Project Structure

```
pillproof/
├── contracts/       # Smart contracts: Registry, Escrow, Alerts
├── backend/         # FastAPI server for blockchain interaction
├── frontend/        # Next.js dashboard for users and regulators
└── docs/            # Technical architecture and demo flow
```

---

## ✅ Prerequisites

Make sure you have these installed before running:

| Tool | Version | Link |
|------|---------|------|
| Node.js | v18+ | https://nodejs.org |
| Python | 3.10+ | https://python.org |
| Git | Latest | https://git-scm.com |

---

## 🏃 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pillproof.git
cd pillproof
```

---

### 2. Set Up Environment Variables

**`/backend/.env`**
```env
ALGORAND_NODE_URL=https://testnet-api.algonode.cloud
ALGORAND_INDEXER_URL=https://testnet-idx.algonode.cloud
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
DEPLOYER_MNEMONIC=your 25 word algorand mnemonic here
REGISTRY_APP_ID=your_registry_app_id
ESCROW_APP_ID=your_escrow_app_id
ALERTS_APP_ID=your_alerts_app_id
```

**`/frontend/.env.local`**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### 3. Deploy Smart Contracts (Algorand Testnet)

```bash
cd contracts
pip install -r requirements.txt
python deploy_registry.py
python deploy_escrow.py
python deploy_alerts.py
```

> 💰 Fund your Algorand testnet wallet at: https://bank.testnet.algorand.network
>
> 📝 Copy the deployed App IDs into your `/backend/.env`

---

### 4. Run the Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

- API live at: **http://localhost:8000**
- Swagger docs at: **http://localhost:8000/docs**

---

### 5. Run the Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

- Dashboard live at: **http://localhost:3000**

---

### 6. Full Flow to Test

```
1. Register a medicine batch  →  mints ARC-3 ASA on Algorand
2. Scan a QR code             →  verifies hash on-chain
3. Place procurement order    →  funds locked in Escrow
4. Verification passes        →  payment auto-released
5. Counterfeit detected       →  alert raised, payment blocked
```

---

## 🧪 Run Tests

```bash
# Backend tests
cd backend && pytest

# Smart Contract tests
cd contracts && python -m pytest tests/
```

---

## 🌐 External Services Required

| Service | Purpose | Link |
|---------|---------|------|
| Supabase | Database | https://supabase.com |
| Pinata | IPFS Storage | https://pinata.cloud |
| Algorand Testnet | Blockchain | https://algonode.cloud |
| Pera Wallet | Sign transactions | https://perawallet.app |

---

## 📄 License

MIT License — feel free to fork and build on top of PillProof.
"""

import os

readme_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "README.md")

with open(readme_path, "w", encoding="utf-8") as f:
    f.write(readme_content)

print("✅ README.md has been successfully updated!")
print(f"📄 Location: {readme_path}")
