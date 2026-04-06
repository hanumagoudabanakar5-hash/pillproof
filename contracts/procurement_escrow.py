from beaker import *
from pyteal import *

class ProcurementEscrowState:
    order_id = GlobalStateValue(stack_type=TealType.bytes, descr="Order ID")
    buyer = GlobalStateValue(stack_type=TealType.bytes, descr="Buyer address")
    supplier = GlobalStateValue(stack_type=TealType.bytes, descr="Supplier address")
    medicine_batch_id = GlobalStateValue(stack_type=TealType.bytes, descr="Batch ID")
    payment_amount = GlobalStateValue(stack_type=TealType.uint64, descr="Payment in microALGO")
    is_delivered = GlobalStateValue(stack_type=TealType.uint64, descr="1 delivered 0 pending")
    is_verified = GlobalStateValue(stack_type=TealType.uint64, descr="1 verified 0 not")
    is_paid = GlobalStateValue(stack_type=TealType.uint64, descr="1 paid 0 locked")
    order_status = GlobalStateValue(stack_type=TealType.bytes, descr="Order status")

app = Application("ProcurementEscrow", state=ProcurementEscrowState())

@app.create
def create():
    return app.initialize_global_state()

@app.external
def create_order(order_id: abi.String, supplier: abi.Address, medicine_batch_id: abi.String, payment: abi.Uint64):
    return Seq([
        app.state.order_id.set(order_id.get()),
        app.state.buyer.set(Txn.sender()),
        app.state.supplier.set(supplier.get()),
        app.state.medicine_batch_id.set(medicine_batch_id.get()),
        app.state.payment_amount.set(payment.get()),
        app.state.is_delivered.set(Int(0)),
        app.state.is_verified.set(Int(0)),
        app.state.is_paid.set(Int(0)),
        app.state.order_status.set(Bytes("PENDING")),
    ])

@app.external
def verify_and_release(order_id: abi.String, is_genuine: abi.Uint64):
    return Seq([
        Assert(app.state.order_id.get() == order_id.get()),
        If(is_genuine.get() == Int(1))
        .Then(Seq([
            app.state.is_verified.set(Int(1)),
            app.state.is_paid.set(Int(1)),
            app.state.order_status.set(Bytes("PAYMENT_RELEASED")),
        ]))
        .Else(Seq([
            app.state.is_verified.set(Int(0)),
            app.state.order_status.set(Bytes("COUNTERFEIT_DETECTED")),
        ]))
    ])
