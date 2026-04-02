from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class MedicineBatch(Base):
    __tablename__ = "medicine_batches"
    batch_id = Column(String, primary_key=True)
    medicine_name = Column(String, index=True)
    quantity = Column(Integer)
    manufacture_date = Column(String)
    expiry_date = Column(String)
    manufacturer_address = Column(String)
    is_genuine = Column(Boolean, default=True)
    current_stage = Column(String, default="MANUFACTURED")
    registered_on = Column(String, default="Algorand Testnet")
    created_at = Column(DateTime, default=datetime.utcnow)
    supply_chain_records = relationship("SupplyChainTransfer", back_populates="batch")
    counterfeit_alerts = relationship("CounterfeitReport", back_populates="batch")

class ProcurementOrder(Base):
    __tablename__ = "procurement_orders"
    order_id = Column(String, primary_key=True)
    supplier_address = Column(String)
    medicine_batch_id = Column(String, ForeignKey("medicine_batches.batch_id"))
    payment_amount = Column(Integer)
    status = Column(String, default="PENDING")
    is_paid = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class SupplyChainTransfer(Base):
    __tablename__ = "supply_chain_transfers"
    id = Column(Integer, primary_key=True, autoincrement=True)
    batch_id = Column(String, ForeignKey("medicine_batches.batch_id"))
    from_address = Column(String)
    to_address = Column(String)
    stage = Column(String)
    blockchain = Column(String, default="Algorand Testnet")
    created_at = Column(DateTime, default=datetime.utcnow)
    batch = relationship("MedicineBatch", back_populates="supply_chain_records")

class CounterfeitReport(Base):
    __tablename__ = "counterfeit_reports"
    id = Column(Integer, primary_key=True, autoincrement=True)
    batch_id = Column(String, ForeignKey("medicine_batches.batch_id"))
    alert_level = Column(String)
    reported_location = Column(String)
    reporter_address = Column(String)
    status = Column(String, default="ACTIVE")
    cdsco_notified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    batch = relationship("MedicineBatch", back_populates="counterfeit_alerts")
