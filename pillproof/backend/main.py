from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import uvicorn
import json

from database import init_db, get_db, Base, engine
from db_models import MedicineBatch as DBMedicineBatch
from db_models import ProcurementOrder as DBProcurementOrder
from db_models import SupplyChainTransfer as DBSupplyChainTransfer
from db_models import CounterfeitReport as DBCounterfeitReport
from models import MedicineBatch as MedicineBatchModel
from models import ProcurementOrder as ProcurementOrderModel
from models import SupplyChainTransfer as SupplyChainTransferModel
from models import CounterfeitReport as CounterfeitReportModel
from qr_generator import generate_qr_code
from algorand_client import verify_blockchain_connection

app = FastAPI(title="PillProof API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    print("✅ Database initialized successfully!")

@app.get("/")
def home():
    return {"project": "PillProof", "version": "1.0.0", "database": "SQLite"}

@app.post("/batch/register")
def register_batch(batch: MedicineBatchModel, db: Session = Depends(get_db)):
    """Register a new medicine batch and generate QR code"""
    print(f"\n🔵 [POST /batch/register] Called with batch_id: {batch.batch_id}")
    
    try:
        existing = db.query(DBMedicineBatch).filter(DBMedicineBatch.batch_id == batch.batch_id).first()
        if existing:
            print(f"❌ Batch {batch.batch_id} already exists")
            raise HTTPException(status_code=400, detail="Batch ID already exists")
        
        # Create batch in database
        print(f"📝 Creating batch in database...")
        db_batch = DBMedicineBatch(
            batch_id=batch.batch_id,
            medicine_name=batch.medicine_name,
            quantity=batch.quantity,
            manufacture_date=batch.manufacture_date,
            expiry_date=batch.expiry_date,
            manufacturer_address=batch.manufacturer_address,
        )
        db.add(db_batch)
        db.commit()
        db.refresh(db_batch)
        print(f"✅ Batch created in database")
        
        # Generate QR code
        qr_path = f"qr_codes/{batch.batch_id}.png"
        qr_generated = False
        qr_content = None
        
        try:
            print(f"🎯 Generating QR code...")
            batch_data = {
                "batch_id": batch.batch_id,
                "medicine_name": batch.medicine_name,
                "quantity": batch.quantity,
                "manufacture_date": batch.manufacture_date,
                "expiry_date": batch.expiry_date,
                "manufacturer_address": batch.manufacturer_address,
            }
            qr_result = generate_qr_code(batch_data)
            qr_path = qr_result.get("qr_path", qr_path)
            qr_content = qr_result.get("qr_content", {})
            qr_generated = True
            print(f"✅ QR Code generated successfully: {qr_path}")
        except Exception as qr_error:
            print(f"⚠️ QR Generation error: {str(qr_error)}")
            print(f"⚠️ Continuing without QR code...")
            qr_generated = False
        
        response = {
            "message": "✅ Batch registered successfully",
            "batch_id": batch.batch_id,
            "medicine_name": batch.medicine_name,
            "quantity": batch.quantity,
            "manufacture_date": batch.manufacture_date,
            "expiry_date": batch.expiry_date,
            "manufacturer_address": batch.manufacturer_address,
            "qr_code_path": qr_path,
            "qr_code_generated": qr_generated,
            "qr_content": qr_content if qr_generated else None,
            "blockchain": "Algorand Testnet",
            "database": "SQLite"
        }
        
        print(f"✅ Response: {json.dumps(response, indent=2)}")
        return response
        
    except HTTPException as http_err:
        print(f"❌ HTTP Error: {http_err.detail}")
        raise
    except Exception as e:
        db.rollback()
        print(f"❌ Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/batch/verify/{batch_id}")
def verify_batch(batch_id: str, db: Session = Depends(get_db)):
    """Verify a batch and check if genuine"""
    print(f"\n🔵 [GET /batch/verify] Called with batch_id: {batch_id}")
    
    try:
        batch = db.query(DBMedicineBatch).filter(DBMedicineBatch.batch_id == batch_id).first()
        
        if not batch:
            print(f"❌ Batch {batch_id} not found")
            return {
                "is_genuine": False,
                "status": "COUNTERFEIT",
                "message": "Batch not found in database",
                "batch_id": batch_id
            }
        
        print(f"✅ Batch {batch_id} found - is_genuine: {batch.is_genuine}")
        return {
            "is_genuine": batch.is_genuine,
            "status": "GENUINE" if batch.is_genuine else "COUNTERFEIT",
            "batch_id": batch.batch_id,
            "medicine_name": batch.medicine_name,
            "manufacturer": batch.manufacturer_address,
            "manufacture_date": batch.manufacture_date,
            "expiry_date": batch.expiry_date,
            "current_stage": batch.current_stage,
            "database": "SQLite"
        }
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/batch/journey/{batch_id}")
def get_medicine_journey(batch_id: str, db: Session = Depends(get_db)):
    """Get the complete supply chain journey of a batch"""
    print(f"\n🔵 [GET /batch/journey] Called with batch_id: {batch_id}")
    
    try:
        batch = db.query(DBMedicineBatch).filter(DBMedicineBatch.batch_id == batch_id).first()
        
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        
        journey = db.query(DBSupplyChainTransfer).filter(
            DBSupplyChainTransfer.batch_id == batch_id
        ).all()
        
        journey_list = [
            {
                "from": record.from_address,
                "to": record.to_address,
                "stage": record.stage,
                "blockchain": record.blockchain,
                "timestamp": record.created_at.isoformat()
            }
            for record in journey
        ]
        
        print(f"✅ Journey found with {len(journey_list)} transfers")
        return {
            "batch_id": batch.batch_id,
            "medicine_name": batch.medicine_name,
            "current_stage": batch.current_stage,
            "journey": journey_list,
            "total_transfers": len(journey_list)
        }
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/procurement/order")
def create_procurement_order(order: ProcurementOrderModel, db: Session = Depends(get_db)):
    """Create a new procurement order"""
    print(f"\n🔵 [POST /procurement/order] Called with order_id: {order.order_id}")
    
    try:
        db_order = DBProcurementOrder(
            order_id=order.order_id,
            supplier_address=order.supplier_address,
            medicine_batch_id=order.medicine_batch_id,
            payment_amount=order.payment_amount,
            status="PENDING",
            is_paid=False
        )
        
        db.add(db_order)
        db.commit()
        
        print(f"✅ Procurement order {order.order_id} created")
        return {
            "message": "✅ Procurement order created",
            "order_id": order.order_id,
            "status": "PENDING",
            "escrow_status": "PAYMENT_LOCKED"
        }
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/procurement/verify-and-pay/{order_id}")
def verify_and_release_payment(order_id: str, is_genuine: bool, db: Session = Depends(get_db)):
    """Verify batch and release payment"""
    print(f"\n🔵 [POST /procurement/verify-and-pay] Called with order_id: {order_id}, is_genuine: {is_genuine}")
    
    try:
        order = db.query(DBProcurementOrder).filter(
            DBProcurementOrder.order_id == order_id
        ).first()
        
        if not order:
            print(f"❌ Order {order_id} not found")
            raise HTTPException(status_code=404, detail="Order not found")
        
        if is_genuine:
            order.status = "PAYMENT_RELEASED"
            order.is_paid = True
            db.commit()
            print(f"✅ Payment released for order {order_id}")
            return {
                "message": "✅ Payment released to supplier",
                "order_id": order_id,
                "status": "PAYMENT_RELEASED"
            }
        else:
            order.status = "COUNTERFEIT_DETECTED"
            db.commit()
            print(f"⚠️ Counterfeit detected for order {order_id}")
            return {
                "message": "❌ Counterfeit detected - payment blocked",
                "order_id": order_id,
                "status": "COUNTERFEIT_DETECTED"
            }
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/supply-chain/transfer")
def transfer_batch(transfer: SupplyChainTransferModel, db: Session = Depends(get_db)):
    """Record a supply chain transfer"""
    print(f"\n🔵 [POST /supply-chain/transfer] Called with batch_id: {transfer.batch_id}")
    
    try:
        batch = db.query(DBMedicineBatch).filter(
            DBMedicineBatch.batch_id == transfer.batch_id
        ).first()
        
        if not batch:
            print(f"❌ Batch {transfer.batch_id} not found")
            raise HTTPException(status_code=404, detail="Batch not found")
        
        db_transfer = DBSupplyChainTransfer(
            batch_id=transfer.batch_id,
            from_address=transfer.from_address,
            to_address=transfer.to_address,
            stage=transfer.stage,
            blockchain="Algorand Testnet"
        )
        
        batch.current_stage = transfer.stage
        db.add(db_transfer)
        db.commit()
        
        print(f"✅ Transfer recorded for batch {transfer.batch_id} to stage {transfer.stage}")
        return {
            "message": "✅ Transfer recorded",
            "batch_id": transfer.batch_id,
            "new_stage": transfer.stage
        }
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/alert/raise")
def raise_counterfeit_alert(report: CounterfeitReportModel, db: Session = Depends(get_db)):
    """Raise a counterfeit alert"""
    print(f"\n🔵 [POST /alert/raise] Called with batch_id: {report.batch_id}")
    
    try:
        db_report = DBCounterfeitReport(
            batch_id=report.batch_id,
            alert_level=report.alert_level,
            reported_location=report.reported_location,
            reporter_address=report.reporter_address,
            status="ACTIVE",
            cdsco_notified=False
        )
        
        db.add(db_report)
        
        batch = db.query(DBMedicineBatch).filter(
            DBMedicineBatch.batch_id == report.batch_id
        ).first()
        
        if batch:
            batch.is_genuine = False
            batch.current_stage = "FLAGGED"
        
        db.commit()
        
        print(f"🚨 Counterfeit alert raised for batch {report.batch_id}")
        return {
            "message": "🚨 Counterfeit alert raised",
            "batch_id": report.batch_id,
            "alert_level": report.alert_level,
            "status": "ACTIVE"
        }
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    print(f"\n🔵 [GET /dashboard/stats] Called")
    
    try:
        total_batches = db.query(DBMedicineBatch).count()
        genuine_batches = db.query(DBMedicineBatch).filter(
            DBMedicineBatch.is_genuine == True
        ).count()
        counterfeit_batches = total_batches - genuine_batches
        total_orders = db.query(DBProcurementOrder).count()
        total_alerts = db.query(DBCounterfeitReport).count()
        
        print(f"✅ Stats: {total_batches} batches, {genuine_batches} genuine, {counterfeit_batches} counterfeit")
        return {
            "total_batches": total_batches,
            "genuine_batches": genuine_batches,
            "counterfeit_batches": counterfeit_batches,
            "total_orders": total_orders,
            "total_alerts": total_alerts,
            "blockchain": "Algorand Testnet",
            "database": "SQLite"
        }
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/blockchain/status")
def check_blockchain_status():
    """Check blockchain connection status"""
    print(f"\n🔵 [GET /blockchain/status] Called")
    return verify_blockchain_connection()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
