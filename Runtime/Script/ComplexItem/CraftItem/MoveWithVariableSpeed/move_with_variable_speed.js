

const NodeManager = (($) => {
    const node_size = 1;
    const height = node_size * 0.5;
    const width = 5;
    const subNodes = [
        $.subNode("Node1"),
        $.subNode("Node2"),
        $.subNode("Node3"),
        $.subNode("Node4"),
        $.subNode("Node5"),
    ]

    const createPhaseManager = () => {
        let _time = 0;
        let _speed = 1;
        const period = 10;
        const trapezoidalWave = (t) => {
            if (t < 0.25) {
                return t * 8 - 1;
            } else if (t < 0.5) {
                return 1;
            } else if (t < 0.75) {
                return 5 - t * 8;
            } else {
                return -1;
            }
        };
        const UpdateTime = ($, deltaTime) => {
            _time += deltaTime * _speed;
            if (_time > period) {
                _time = 0;
            }
        }
        const GetPhase = ($) => {
            let t = _time % period / period;
               return trapezoidalWave(t);
        }
        return { UpdateTime, GetPhase };
    };
    const phaseManagers = subNodes.map(() => createPhaseManager());
    const GetNodePosition = (i, phase) => {
        return new Vector3(
            (i + (1 - subNodes.length) * 0.5) * node_size,
            height,
            phase * width);
    }

    const Update = ($, deltaTime) => {
        for (let i = 0; i < subNodes.length; i++) {
            phaseManagers[i].UpdateTime($, deltaTime);
            const pos = GetNodePosition(i, phaseManagers[i].GetPhase($))
            subNodes[i].setPosition(pos);
        }
    }
    return { Update };
})($);

$.onUpdate(deltaTime => {
    NodeManager.Update($, deltaTime);
});
