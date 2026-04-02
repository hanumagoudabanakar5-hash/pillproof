from beaker import *
from pyteal import *

class CounterfeitAlertState:
    batch_id = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Flagged medicine batch ID"
    )
    reporter = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Who reported the counterfeit"
    )
    alert_level = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="LOW MEDIUM or HIGH alert level"
    )
    alert_status = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="ACTIVE INVESTIGATING or RESOLVED"
    )
    reported_timestamp = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="When counterfeit was reported"
    )
    resolved_timestamp = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="When alert was resolved"
    )
    total_alerts = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Total counterfeit alerts raised"
    )
    is_batch_frozen = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="1 if batch is frozen 0 if active"
    )
    reported_location = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Location where counterfeit detected"
    )
    cdsco_notified = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="1 if CDSCO has been notified"
    )

app = Application(
    "CounterfeitAlert",
    state=CounterfeitAlertState()
)

@app.create
def create():
    return app.initialize_global_state()

@app.external
def raise_alert(
    batch_id: abi.String,
    alert_level: abi.String,
    reported_location: abi.String,
):
    return Seq([
        app.state.batch_id.set(batch_id.get()),
        app.state.reporter.set(Txn.sender()),
        app.state.alert_level.set(alert_level.get()),
        app.state.alert_status.set(Bytes("ACTIVE")),
        app.state.reported_timestamp.set(Global.latest_timestamp()),
        app.state.total_alerts.set(
            app.state.total_alerts.get() + Int(1)
        ),
        app.state.is_batch_frozen.set(Int(1)),
        app.state.reported_location.set(reported_location.get()),
        app.state.cdsco_notified.set(Int(0)),
    ])

@app.external
def notify_cdsco(
    batch_id: abi.String,
):
    return Seq([
        Assert(app.state.batch_id.get() == batch_id.get()),
        Assert(app.state.alert_status.get() == Bytes("ACTIVE")),
        app.state.cdsco_notified.set(Int(1)),
        app.state.alert_status.set(Bytes("INVESTIGATING")),
    ])

@app.external
def resolve_alert(
    batch_id: abi.String,
):
    return Seq([
        Assert(app.state.batch_id.get() == batch_id.get()),
        Assert(app.state.alert_status.get() == Bytes("INVESTIGATING")),
        app.state.alert_status.set(Bytes("RESOLVED")),
        app.state.resolved_timestamp.set(Global.latest_timestamp()),
        app.state.is_batch_frozen.set(Int(0)),
    ])

@app.external
def get_alert_status(
    batch_id: abi.String,
    *,
    output: abi.String
):
    return Seq([
        Assert(app.state.batch_id.get() == batch_id.get()),
        output.set(app.state.alert_status.get())
    ])

@app.external
def get_total_alerts(
    *,
    output: abi.Uint64
):
    return output.set(app.state.total_alerts.get())

@app.external
def is_batch_frozen(
    batch_id: abi.String,
    *,
    output: abi.Uint64
):
    return Seq([
        Assert(app.state.batch_id.get() == batch_id.get()),
        output.set(app.state.is_batch_frozen.get())
    ])
