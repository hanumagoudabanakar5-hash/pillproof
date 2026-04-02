from beaker import *
from pyteal import *

class ProcurementEscrowState:
    order_id = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Unique procurement order ID"
    )
    buyer = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Buyer wallet address"
    )
    supplier = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Supplier wallet address"
    )
    medicine_batch_id = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Medicine batch ID being procured"
    )
    payment_amount = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Payment amount in microALGO"
    )
    is_delivered = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="1 if delivered 0 if pending"
    )
    is_verified = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="1 if verified genuine 0 if not"
    )
    is_paid = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="1 if payment released 0 if locked"
    )
    order_status = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Current status of order"
    )

app = Application(
    "ProcurementEscrow",
    state=ProcurementEscrowState()
)

@app.create
def create():
    return app.initialize_global_state()

@app.external
def create_order(
    order_id: abi.String,
    supplier: abi.Address,
    medicine_batch_id: abi.String,
    payment: abi.Uint64,
):
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
def confirm_delivery(
    order_id: abi.String,
):
    return Seq([
        Assert(app.state.order_id.get() == order_id.get()),
        Assert(app.state.is_delivered.get() == Int(0)),
        app.state.is_delivered.set(Int(1)),
        app.state.order_status.set(Bytes("DELIVERED")),
    ])

@app.external
def verify_and_release_payment(
    order_id: abi.String,
    is_genuine: abi.Uint64,
):
    return Seq([
        Assert(app.state.order_id.get() == order_id.get()),
        Assert(app.state.is_delivered.get() == Int(1)),
        Assert(app.state.is_paid.get() == Int(0)),
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

@app.external
def get_order_status(
    order_id: abi.String,
    *,
    output: abi.String
):
    return Seq([
        Assert(app.state.order_id.get() == order_id.get()),
        output.set(app.state.order_status.get())
    ])
