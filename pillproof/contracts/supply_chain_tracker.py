from beaker import *
from pyteal import *

class SupplyChainState:
    batch_id = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Medicine batch ID being tracked"
    )
    manufacturer = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Manufacturer wallet address"
    )
    distributor = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Distributor wallet address"
    )
    pharmacy = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Pharmacy wallet address"
    )
    current_stage = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Current stage in supply chain"
    )
    manufacturer_timestamp = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Timestamp when manufacturer registered"
    )
    distributor_timestamp = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Timestamp when distributor received"
    )
    pharmacy_timestamp = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Timestamp when pharmacy received"
    )
    is_flagged = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="1 if batch is flagged suspicious"
    )
    total_handoffs = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Total number of handoffs completed"
    )

app = Application(
    "SupplyChainTracker",
    state=SupplyChainState()
)

@app.create
def create():
    return app.initialize_global_state()

@app.external
def initialize_batch(
    batch_id: abi.String,
):
    return Seq([
        app.state.batch_id.set(batch_id.get()),
        app.state.manufacturer.set(Txn.sender()),
        app.state.current_stage.set(Bytes("MANUFACTURED")),
        app.state.manufacturer_timestamp.set(Global.latest_timestamp()),
        app.state.is_flagged.set(Int(0)),
        app.state.total_handoffs.set(Int(0)),
    ])

@app.external
def transfer_to_distributor(
    batch_id: abi.String,
    distributor: abi.Address,
):
    return Seq([
        Assert(app.state.batch_id.get() == batch_id.get()),
        Assert(app.state.current_stage.get() == Bytes("MANUFACTURED")),
        Assert(app.state.is_flagged.get() == Int(0)),
        app.state.distributor.set(distributor.get()),
        app.state.current_stage.set(Bytes("WITH_DISTRIBUTOR")),
        app.state.distributor_timestamp.set(Global.latest_timestamp()),
        app.state.total_handoffs.set(
            app.state.total_handoffs.get() + Int(1)
        ),
    ])

@app.external
def transfer_to_pharmacy(
    batch_id: abi.String,
    pharmacy: abi.Address,
):
    return Seq([
        Assert(app.state.batch_id.get() == batch_id.get()),
        Assert(app.state.current_stage.get() == Bytes("WITH_DISTRIBUTOR")),
        Assert(app.state.is_flagged.get() == Int(0)),
        app.state.pharmacy.set(pharmacy.get()),
        app.state.current_stage.set(Bytes("WITH_PHARMACY")),
        app.state.pharmacy_timestamp.set(Global.latest_timestamp()),
        app.state.total_handoffs.set(
            app.state.total_handoffs.get() + Int(1)
        ),
    ])

@app.external
def flag_suspicious_batch(
    batch_id: abi.String,
):
    return Seq([
        Assert(app.state.batch_id.get() == batch_id.get()),
        app.state.is_flagged.set(Int(1)),
        app.state.current_stage.set(Bytes("FLAGGED_SUSPICIOUS")),
    ])

@app.external
def get_current_stage(
    batch_id: abi.String,
    *,
    output: abi.String
):
    return Seq([
        Assert(app.state.batch_id.get() == batch_id.get()),
        output.set(app.state.current_stage.get())
    ])

@app.external
def get_total_handoffs(
    batch_id: abi.String,
    *,
    output: abi.Uint64
):
    return Seq([
        Assert(app.state.batch_id.get() == batch_id.get()),
        output.set(app.state.total_handoffs.get())
    ])