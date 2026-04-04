from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

medicine_batches = {}
procurement_orders = {}
supply_chain_records = {}
counterfeit_alerts = {}

def add_batch(batch_id: str, data: dict):
    medicine_batches[batch_id] = {
        **data,
        "is_genuine": True,
        "current_stage": "MANUFACTURED",
        "registered_on": "Algorand Testnet",
        "created_at": datetime.now().isoformat()
    }
    supply_chain_records[batch_id] = [
        {
            "stage": "MANUFACTURED",
            "location": "Manufacturing Plant",
            "timestamp": datetime.now().isoformat(),
            "handler": data.get("manufacturer_name", "Unknown")
        }
    ]
    return medicine_batches[batch_id]

def get_batch(batch_id: str):
    return medicine_batches.get(batch_id, None)

def get_all_batches():
    return list(medicine_batches.values())

def update_batch_stage(batch_id: str, stage: str):
    if batch_id in medicine_batches:
        medicine_batches[batch_id]["current_stage"] = stage
        return True
    return False

def flag_batch_counterfeit(batch_id: str):
    if batch_id in medicine_batches:
        medicine_batches[batch_id]["is_genuine"] = False
        medicine_batches[batch_id]["current_stage"] = "FLAGGED"
        return True
    return False

def add_supply_chain_record(batch_id: str, record: dict):
    if batch_id not in supply_chain_records:
        supply_chain_records[batch_id] = []
    supply_chain_records[batch_id].append({
        **record,
        "timestamp": datetime.now().isoformat()
    })

def get_supply_chain_records(batch_id: str):
    return supply_chain_records.get(batch_id, [])

def add_procurement_order(order_id: str, data: dict):
    procurement_orders[order_id] = {
        **data,
        "status": "PENDING",
        "is_paid": False,
        "created_at": datetime.now().isoformat()
    }
    return procurement_orders[order_id]

def get_procurement_order(order_id: str):
    return procurement_orders.get(order_id, None)

def get_all_orders():
    return list(procurement_orders.values())

def update_order_status(order_id: str, status: str, is_paid: bool = False):
    if order_id in procurement_orders:
        procurement_orders[order_id]["status"] = status
        procurement_orders[order_id]["is_paid"] = is_paid
        return True
    return False

def add_alert(batch_id: str, data: dict):
    counterfeit_alerts[batch_id] = {
        **data,
        "status": "ACTIVE",
        "cdsco_notified": True,
        "created_at": datetime.now().isoformat()
    }
    return counterfeit_alerts[batch_id]

def get_all_alerts():
    return list(counterfeit_alerts.values())

def get_dashboard_stats():
    total = len(medicine_batches)
    genuine = sum(1 for b in medicine_batches.values() if b["is_genuine"])
    return {
        "total_batches": total,
        "genuine_batches": genuine,
        "counterfeit_batches": total - genuine,
        "total_orders": len(procurement_orders),
        "total_alerts": len(counterfeit_alerts),
        "paid_orders": sum(1 for o in procurement_orders.values() if o["is_paid"]),
        "blockchain": "Algorand Testnet"
    }