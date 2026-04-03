from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import json
import os
from pathlib import Path

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data storage file
DATA_FILE = "batches.json"

# Models
class BatchRegisterRequest(BaseModel):
    medicineName: str
    manufacturer: str
    quantity: int
    expiryDate: str

class BatchResponse(BaseModel):
    success: bool
    message: str
    batch: dict = None
    error: str = None

# Helper functions
def load_batches():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def save_batches(batches):
    with open(DATA_FILE, 'w') as f:
        json.dump(batches, f, indent=2)

def generate_batch_id():
    batches = load_batches()
    batch_num = len(batches) + 1
    return f"REG-2024-{batch_num:03d}"

# API Endpoints
@app.get("/api/health")
async def health():
    return {
        "success": True,
        "message": "✅ Backend is running!",
        "status": "healthy"
    }

@app.post("/api/batches/register")
async def register_batch(request: BatchRegisterRequest):
    try:
        batches = load_batches()
        
        batch_id = generate_batch_id()
        
        new_batch = {
            "batchId": batch_id,
            "medicineName": request.medicineName,
            "manufacturer": request.manufacturer,
            "quantity": request.quantity,
            "expiryDate": request.expiryDate,
            "status": "Pending",
            "blockchainHash": f"HASH-{batch_id}",
            "contractId": 660860,
            "createdAt": datetime.now().isoformat(),
            "isAuthentic": True,
            "riskScore": 0
        }
        
        batches.append(new_batch)
        save_batches(batches)
        
        return {
            "success": True,
            "message": "✅ Batch registered successfully!",
            "batch": new_batch
        }
    except Exception as e:
        return {
            "success": False,
            "message": "❌ Error registering batch",
            "error": str(e)
        }

@app.get("/api/batches/verify/{batch_id}")
async def verify_batch(batch_id: str):
    try:
        batches = load_batches()
        batch = next((b for b in batches if b["batchId"] == batch_id), None)
        
        if not batch:
            return {
                "success": False,
                "message": "❌ Batch not found",
                "error": "Batch ID not found in database"
            }
        
        # Update status to verified
        batch["status"] = "Verified"
        save_batches(batches)
        
        return {
            "success": True,
            "message": "✅ Batch verified successfully!",
            "batch": batch
        }
    except Exception as e:
        return {
            "success": False,
            "message": "❌ Error verifying batch",
            "error": str(e)
        }

@app.get("/api/batches")
async def get_all_batches():
    try:
        batches = load_batches()
        return {
            "success": True,
            "batches": batches
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.post("/api/batches/detect")
async def detect_counterfeit(request: BatchRegisterRequest):
    try:
        # Simple analysis
        risk_score = 0
        risk_factors = []
        
        # Check expiry date
        try:
            expiry = datetime.strptime(request.expiryDate, "%Y-%m-%d")
            if expiry < datetime.now():
                risk_score += 50
                risk_factors.append("Expired date")
        except:
            pass
        
        # Check quantity
        if request.quantity <= 0:
            risk_score += 30
            risk_factors.append("Invalid quantity")
        
        is_authentic = risk_score == 0
        
        return {
            "success": True,
            "isAuthentic": is_authentic,
            "riskScore": risk_score,
            "confidence": 100 - risk_score,
            "riskFactors": risk_factors
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/api/batches/track/{batch_id}")
async def track_batch(batch_id: str):
    try:
        batches = load_batches()
        batch = next((b for b in batches if b["batchId"] == batch_id), None)
        
        if not batch:
            return {
                "success": False,
                "message": "Batch not found"
            }
        
        # Return supply chain timeline
        timeline = [
            {
                "stage": "Manufacturing",
                "location": "India",
                "handler": "Pharma Corp Ltd",
                "date": "2026-03-04",
                "status": "✅"
            },
            {
                "stage": "Quality Check",
                "location": "Quality Lab",
                "handler": "QA Department",
                "date": "2026-03-09",
                "status": "✅"
            },
            {
                "stage": "Warehouse",
                "location": "Central Warehouse",
                "handler": "Logistics Co.",
                "date": "2026-03-14",
                "status": "✅"
            },
            {
                "stage": "Distributor",
                "location": "Regional Distributor",
                "handler": "MediCare Distribution",
                "date": "2026-03-24",
                "status": "✅"
            },
            {
                "stage": "Pharmacy",
                "location": "Local Pharmacy",
                "handler": "HealthPlus Pharmacy",
                "date": "2026-04-03",
                "status": "✅"
            }
        ]
        
        return {
            "success": True,
            "batch": batch,
            "timeline": timeline
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
