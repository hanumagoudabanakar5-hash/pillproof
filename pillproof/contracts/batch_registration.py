from beaker import *
from pyteal import *

class MedicineBatchState:
    batch_id = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Unique ID of medicine batch"
    )
    manufacturer = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Manufacturer wallet address"
    )
    medicine_name = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Name of medicine"
    )
    quantity = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Quantity of medicine batch"
    )
    manufacture_date = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Date of manufacture"
    )
    expiry_date = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Expiry date of medicine"
    )
    is_genuine = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="1 if genuine 0 if counterfeit"
    )
    current_owner = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Current owner of batch"
    )

app = Application(
    "MedicineBatchRegistration",
    state=MedicineBatchState()
)

@app.create
def create():
    return app.initialize_global_state()

@app.external
def register_batch(
    batch_id: abi.String,
    medicine_name: abi.String,
    quantity: abi.Uint64,
    manufacture_date: abi.String,
    expiry_date: abi.String,
):
    return Seq([
        app.state.batch_id.set(batch_id.get()),
        app.state.manufacturer.set(Txn.sender()),
        app.state.medicine_name.set(medicine_name.get()),
        app.state.quantity.set(quantity.get()),
        app.state.manufacture_date.set(manufacture_date.get()),
        app.state.expiry_date.set(expiry_date.get()),
        app.state.is_genuine.set(Int(1)),
        app.state.current_owner.set(Txn.sender()),
    ])

@app.external
def verify_batch(
    batch_id: abi.String,
    *,
    output: abi.Uint64
):
    return Seq([
        Assert(app.state.batch_id.get() == batch_id.get()),
        output.set(app.state.is_genuine.get())
    ])

@app.external
def flag_counterfeit(
    batch_id: abi.String,
):
    return Seq([
        Assert(app.state.batch_id.get() == batch_id.get()),
        app.state.is_genuine.set(Int(0)),
    ])