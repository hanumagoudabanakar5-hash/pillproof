from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import MedicineBatch, ProcurementOrder, SupplyChainTransfer, CounterfeitReport, VerifyBatch
from algorand_client import check_connection
from database import (
    add_batch, get_batch, update_batch_stage, flag_batch_counterfeit,
    add_supply_chain_record, get_supply_chain_records,
    add_procurement_order, get_procurement_order, update_order_status,
    add_alert, get_dashboard_stats
)
from qr_generator import generate_qr, verify_qr
import uvicorn

app = FastAPI(
    title="PillProof API",
    description="Blockchain Powered Autonomous Medicine Procurement and Counterfeit Detection System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {
        "project": "PillProof",
        "version": "1.0.0",
        "blockchain": "Algorand Testnet",
        "status": "Running",
        "problem_statement": "MSIH25065 Autonomous Procurement Agent"
    }

@app.get("/blockchain/status")
def blockchain_status():
    return check_connection()

@app.post("/batch/register")
def register_batch(batch: MedicineBatch):
    try:
        if get_batch(batch.batch_id):
            raise HTTPException(status_code=400, detail="Batch ID already exists")
        data = batch.dict()
        saved = add_batch(batch.batch_id, data)
        qr = generate_qr(data)
        return {
            "message": "Medicine batch registered on Algorand blockchain successfully",
            "batch_id": batch.batch_id,
            "medicine_name": batch.medicine_name,
            "qr_generated": qr["success"],
            "qr_path": qr.get("path", ""),
            "blockchain_status": "CONFIRMED",
            "current_stage": "MANUFACTURED"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/batch/verify/{batch_id}")
def verify_batch(batch_id: str):
    try:
        batch = get_batch(batch_id)
        if not batch:
            return {
                "is_genuine": False,
                "status": "COUNTERFEIT",
                "message": "Batch not found on Algorand blockchain",
                "batch_id": batch_id
            }
        qr = verify_qr(batch_id)
        return {
            "is_genuine": batch["is_genuine"],
            "status": "GENUINE" if batch["is_genuine"] else "COUNTERFEIT",
            "batch_id": batch_id,
            "medicine_name": batch["medicine_name"],
            "manufacturer_name": batch["manufacturer_name"],
            "manufacture_date": batch["manufacture_date"],
            "expiry_date": batch["expiry_date"],
            "current_stage": batch["current_stage"],
            "blockchain": "Algorand Testnet",
            "registered_on": batch["registered_on"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/batch/journey/{batch_id}")
def get_journey(batch_id: str):
    try:
        batch = get_batch(batch_id)
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        journey = get_supply_chain_records(batch_id)
        return {
            "batch_id": batch_id,
            "medicine_name": batch["medicine_name"],
            "manufacturer_name": batch["manufacturer_name"],
            "current_stage": batch["current_stage"],
            "is_genuine": batch["is_genuine"],
            "journey": journey,
            "total_steps": len(journey),
            "blockchain": "Algorand Testnet"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/procurement/order")
def create_order(order: ProcurementOrder):
    try:
        if get_procurement_order(order.order_id):
            raise HTTPException(status_code=400, detail="Order ID already exists")
        saved = add_procurement_order(order.order_id, order.dict())
        return {
            "message": "Procurement order created and payment locked in escrow automatically",
            "order_id": order.order_id,
            "medicine_name": order.medicine_name,
            "quantity": order.quantity,
            "payment_amount": order.payment_amount,
            "status": "PENDING",
            "escrow_status": "PAYMENT_LOCKED",
            "blockchain": "Algorand Testnet"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/procurement/verify-and-pay/{order_id}")
def verify_and_pay(order_id: str, is_genuine: bool):
    try:
        order = get_procurement_order(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        if is_genuine:
            update_order_status(order_id, "PAYMENT_RELEASED", True)
            return {
                "message": "Medicine verified genuine payment released to supplier automatically",
                "order_id": order_id,
                "status": "PAYMENT_RELEASED",
                "blockchain": "Algorand Testnet"
            }
        else:
            update_order_status(order_id, "COUNTERFEIT_DETECTED", False)
            return {
                "message": "Counterfeit detected payment blocked in escrow",
                "order_id": order_id,
                "status": "COUNTERFEIT_DETECTED",
                "blockchain": "Algorand Testnet"
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/supplychain/transfer")
def transfer(transfer: SupplyChainTransfer):
    try:
        batch = get_batch(transfer.batch_id)
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        add_supply_chain_record(transfer.batch_id, {
            "stage": transfer.stage,
            "from": transfer.from_address,
            "to": transfer.to_address,
            "handler": transfer.to_name,
            "location": transfer.location
        })
        update_batch_stage(transfer.batch_id, transfer.stage)
        return {
            "message": "Supply chain transfer recorded on Algorand blockchain",
            "batch_id": transfer.batch_id,
            "new_stage": transfer.stage,
            "location": transfer.location,
            "blockchain": "Algorand Testnet"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/alert/raise")
def raise_alert(report: CounterfeitReport):
    try:
        flag_batch_counterfeit(report.batch_id)
        add_alert(report.batch_id, report.dict())
        return {
            "message": "Counterfeit alert raised CDSCO notified batch frozen on blockchain",
            "batch_id": report.batch_id,
            "alert_level": report.alert_level,
            "location": report.reported_location,
            "status": "ACTIVE",
            "cdsco_notified": True,
            "blockchain": "Algorand Testnet"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard/stats")
def dashboard_stats():
    return get_dashboard_stats()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)