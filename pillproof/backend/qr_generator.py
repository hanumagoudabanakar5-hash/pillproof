import qrcode
import json
import hashlib
import os
from datetime import datetime

QR_DIR = "qr_codes"
os.makedirs(QR_DIR, exist_ok=True)

def generate_qr(batch_data: dict):
    try:
        batch_id = batch_data["batch_id"]
        content = {
            "batch_id": batch_id,
            "medicine_name": batch_data["medicine_name"],
            "manufacturer": batch_data["manufacturer_name"],
            "manufacture_date": batch_data["manufacture_date"],
            "expiry_date": batch_data["expiry_date"],
            "blockchain": "Algorand Testnet",
            "timestamp": datetime.now().isoformat(),
            "hash": hashlib.sha256(
                f"{batch_id}{batch_data['medicine_name']}{batch_data['manufacturer_address']}".encode()
            ).hexdigest()
        }
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4
        )
        qr.add_data(json.dumps(content))
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        path = f"{QR_DIR}/{batch_id}.png"
        img.save(path)
        return {"success": True, "path": path, "content": content}
    except Exception as e:
        return {"success": False, "error": str(e)}

def verify_qr(batch_id: str):
    path = f"{QR_DIR}/{batch_id}.png"
    if os.path.exists(path):
        return {"is_genuine": True, "status": "GENUINE", "batch_id": batch_id, "blockchain": "Algorand Testnet"}
    return {"is_genuine": False, "status": "COUNTERFEIT", "batch_id": batch_id}