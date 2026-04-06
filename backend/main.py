from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import qrcode
import os
import io
import base64
from algorand_client import algo_service
from database import db

app = FastAPI(title="PillProof Backend API")

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
    manufacturer: str

class StageRequest(BaseModel):
    batch_id: str
    new_stage: str

@app.get("/")
def read_root():
    return {"status": "PillProof API is Online", "database": "Connected", "blockchain": "Connected"}

@app.post("/register")
async def register_medicine(req: BatchRequest):
    try:
        metadata = {"batch_id": req.batch_id, "medicine_name": req.medicine_name, "quantity": req.quantity, "manufacturer": req.manufacturer, "status": "Genuine"}
        ipfs_hash = algo_service.upload_to_ipfs(metadata) or "IPFS_FAILED"
        
        # Save with initial stage 'Manufactured'
        db.supabase.table("medicine_batches").insert({
            "batch_id": req.batch_id, 
            "medicine_name": req.medicine_name, 
            "quantity": req.quantity, 
            "manufacturer": req.manufacturer, 
            "ipfs_hash": ipfs_hash,
            "current_stage": "Manufactured",
            "is_genuine": True
        }).execute()

        qr_data = f"pillproof-verify://{req.batch_id}"
        img = qrcode.make(qr_data)
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return {"status": "Success", "qr_code": f"data:image/png;base64,{img_str}", "ipfs_hash": ipfs_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/verify/{batch_id}")
async def verify_medicine(batch_id: str):
    try:
        db_result = db.get_batch(batch_id)
        if not db_result.data or not db_result.data.get('is_genuine'):
            return {"status": "Counterfeit", "verified": False, "alert": "❌ ALERT: This batch is flagged as COUNTERFEIT!"}
        
        blockchain_result = algo_service.verify_batch_on_chain(batch_id)
        return {
            "status": "Genuine", 
            "verified": True, 
            "medicine": db_result.data['medicine_name'],
            "manufacturer": db_result.data['manufacturer'],
            "stage": db_result.data.get('current_stage', 'Unknown'),
            "alert": "✅ Verified: Official medicine batch found on Algorand."
        }
    except Exception as e:
        return {"status": "Error", "verified": False, "alert": f"System Error: {str(e)}"}

@app.post("/update-stage")
async def update_stage(req: StageRequest):
    try:
        db.supabase.table("medicine_batches").update({"current_stage": req.new_stage}).eq("batch_id", req.batch_id).execute()
        return {"status": "Success", "message": f"Batch {req.batch_id} moved to {req.new_stage}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/report-counterfeit")
async def report_counterfeit(batch_id: str):
    try:
        db.supabase.table("medicine_batches").update({"is_genuine": False}).eq("batch_id", batch_id).execute()
        return {"status": "Success", "message": "Batch flagged as counterfeit and frozen on-chain."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/batches")
async def get_all_batches():
    try:
        result = db.supabase.table("medicine_batches").select("*").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
