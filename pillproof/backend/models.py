from pydantic import BaseModel

class MedicineBatch(BaseModel):
    batch_id: str
    medicine_name: str
    quantity: int
    manufacture_date: str
    expiry_date: str
    manufacturer_address: str

class ProcurementOrder(BaseModel):
    order_id: str
    supplier_address: str
    medicine_batch_id: str
    payment_amount: int

class SupplyChainTransfer(BaseModel):
    batch_id: str
    from_address: str
    to_address: str
    stage: str

class CounterfeitReport(BaseModel):
    batch_id: str
    alert_level: str
    reported_location: str
    reporter_address: str

class QRVerification(BaseModel):
    batch_id: str