from beaker import *
from pyteal import *

class MedicineBatchState:
    batch_id = GlobalStateValue(stack_type=TealType.bytes, descr="Unique batch ID")
    manufacturer = GlobalStateValue(stack_type=TealType.bytes, descr="Manufacturer address")
    medicine_name = GlobalStateValue(stack_type=TealType.bytes, descr="Medicine name")
    quantity = GlobalStateValue(stack_type=TealType.uint64, descr="Quantity")
    manufacture_date = GlobalStateValue(stack_type=TealType.bytes, descr="Manufacture date")
    expiry_date = GlobalStateValue(stack_type=TealType.bytes, descr="Expiry date")
    is_genuine = GlobalStateValue(stack_type=TealType.uint64, descr="1 genuine 0 counterfeit")
    current_owner = GlobalStateValue(stack_type=TealType.bytes, descr="Current owner")

app = Application("MedicineBatchRegistration", state=MedicineBatchState())

@app.create
def create():
    return app.initialize_global_state()

@app.external
def register_batch(batch_id: abi.String, medicine_name: abi.String, quantity: abi.Uint64, manufacture_date: abi.String, expiry_date: abi.String):
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
def verify_batch(batch_id: abi.String, *, output: abi.Uint64):
    return Seq([
        Assert(app.state.batch_id.get() == batch_id.get()),
        output.set(app.state.is_genuine.get())
    ])
