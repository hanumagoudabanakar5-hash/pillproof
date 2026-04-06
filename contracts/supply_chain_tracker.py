from beaker import *
from pyteal import *

class SupplyChainState:
    batch_id = GlobalStateValue(stack_type=TealType.bytes, descr="Batch ID")
    current_stage = GlobalStateValue(stack_type=TealType.bytes, descr="Current stage")
    is_flagged = GlobalStateValue(stack_type=TealType.uint64, descr="1 flagged 0 clean")

app = Application("SupplyChainTracker", state=SupplyChainState())

@app.create
def create():
    return app.initialize_global_state()

@app.external
def initialize_batch(batch_id: abi.String):
    return Seq([
        app.state.batch_id.set(batch_id.get()),
        app.state.current_stage.set(Bytes("MANUFACTURED")),
        app.state.is_flagged.set(Int(0)),
    ])
