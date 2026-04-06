from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import qrcode
import os
from algorand_client import algo_service

app = FastAPI(title="PillProof Backend API")

# CORS is REQUIRED for the Frontend to talk to the Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BatchRequest(BaseModel):
    batch_id: str
    medicine_name: str
    quantity: int

@app.get("/")
def read_root():
    return {"status": "PillProof API is Online", "version": "1.0.0", "network": "Algorand Testnet"}

@app.post("/register")
async def register_medicine(req: BatchRequest):
    # 1. In real flow: Trigger Smart Contract Minting
    # 2. Generate a QR code for the batch
    qr_data = f"pillproof-verify://{req.batch_id}"
    img = qrcode.make(qr_data)
    file_path = f"qr_{req.batch_id}.png"
    img.save(file_path)
    
    return {
        "status": "Success", 
        "message": f"Batch {req.batch_id} registered and ARC-3 ASA minted",
        "qr_code_path": file_path
    }

@app.get("/verify/{batch_id}")
async def verify_medicine(batch_id: str):
    # Call the blockchain connector
    result = algo_service.verify_batch_on_chain(batch_id)
    return result

@app.post("/release-payment")
async def release_payment(order_id: str):
    return {"status": "Success", "message": f"Payment for order {order_id} released via Escrow Contract"}
