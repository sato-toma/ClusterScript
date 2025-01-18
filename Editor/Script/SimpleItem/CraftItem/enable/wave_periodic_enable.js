const subNodes = [
    $.subNode("Node0"),
    $.subNode("Node1"),
    $.subNode("Node2"),
    $.subNode("Node3"),
]
const subNodesSize = subNodes.length;

const PhaseManager = (((phase_step) => {
    const PERIOD = 10;
    const QUARTER_PERIOD = 1 / phase_step;
    let _time = 0;
    const GetCurrentPhase = ($, deltaTime) => {
        let time = _time;
        time += deltaTime;
        _time = time;
        let t = time % PERIOD / PERIOD;
        return t;
    };
    const isWithinQuarterPeriod = ($, phase, shift_index) => {
        let shiftedPhase = (phase + shift_index * QUARTER_PERIOD) % 1;
        return shiftedPhase < QUARTER_PERIOD;
    };

    return { GetCurrentPhase, isWithinQuarterPeriod };
})(subNodesSize));


$.onUpdate(deltaTime => {
    let phase = PhaseManager.GetCurrentPhase($, deltaTime);
    for (let i = 0; i < subNodesSize; i++) {
        let enable = PhaseManager.isWithinQuarterPeriod($, phase, i);
        subNodes[i].setEnabled(enable);
    }
});

