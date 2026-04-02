import qrcode
import json
import hashlib
from datetime import datetime
import os

def generate_qr_code(batch_data: dict):
    batch_id = batch_data["batch_id"]
    medicine_name = batch_data["medicine_name"]
    manufacturer = batch_data["manufacturer_address"]
    timestamp = datetime.now().isoformat()

    qr_content = {
        "batch_id": batch_id,
        "medicine_name": medicine_name,
        "manufacturer": manufacturer,
        "timestamp": timestamp,
        "verification_url": f"https://pillproof.vercel.app/verify/{batch_id}",
        "blockchain": "Algorand Testnet",
        "hash": hashlib.sha256(
            f"{batch_id}{medicine_name}{manufacturer}".encode()
        ).hexdigest()
    }

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )

    qr.add_data(json.dumps(qr_content))
    qr.make(fit=True)

    img = qr.make_image(
        fill_color="black",
        back_color="white"
    )

    os.makedirs("qr_codes", exist_ok=True)
    qr_path = f"qr_codes/{batch_id}.png"
    img.save(qr_path)

    return {
        "qr_path": qr_path,
        "qr_content": qr_content,
        "batch_id": batch_id
    }

def verify_qr_code(batch_id: str, qr_hash: str):
    stored_qr_path = f"qr_codes/{batch_id}.png"

    if not os.path.exists(stored_qr_path):
        return {
            "is_genuine": False,
            "message": "Batch not found on blockchain",
            "status": "COUNTERFEIT"
        }

    return {
        "is_genuine": True,
        "message": "Medicine verified genuine on Algorand blockchain",
        "status": "GENUINE",
        "batch_id": batch_id
    }