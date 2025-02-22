const NodeManager = (($) => {
    const node_size = 1;
    const node_height = 0.025;
    const width = 5 - node_size * 0.5;
    const depth = node_size * 0.5;
    const subNodes = [
        $.subNode("Node0"),
        $.subNode("Node1"),
        $.subNode("Node2"),
        $.subNode("Node3"),
        $.subNode("Node4"),
        $.subNode("Node5"),
        $.subNode("Node6"),
        $.subNode("Node7"),
        $.subNode("Node8"),
        $.subNode("Node9"),
    ]

    const textNode = $.subNode("Text");
    let _textIndexSpeed = [];
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
        const AddSpeed = (shift) => {
            let current_speed = _speed + shift;
            _speed = Math.min(Math.max(current_speed, 1), 5);
        }
        return { UpdateTime, GetPhase, AddSpeed };
    };
    const phaseManagers = subNodes.map(() => createPhaseManager());
    const GetNodePosition = (i, phase) => {
        let center = Math.floor((1 - subNodes.length) * 0.5 + 0.5);
        return new Vector3(
            (i + center) * node_size - depth,
            node_height,
            phase * width);
    }

    const Update = ($, deltaTime) => {
        for (let i = 0; i < subNodes.length; i++) {
            phaseManagers[i].UpdateTime($, deltaTime);
            const pos = GetNodePosition(i, phaseManagers[i].GetPhase($))
            subNodes[i].setPosition(pos);
        }
        // インターバルをすぎたら、_textIndexSpeedの先頭要素を取得してphaseManagersの
        {
            let time = $.state._time ?? 0;
            time += deltaTime;
            const INTERVAL = 1;
            if (time > INTERVAL) {
                time = 0;
                if (_textIndexSpeed.length > 0) {
                    const { index, speed } = _textIndexSpeed.shift();
                    phaseManagers[index].AddSpeed(speed);
                } else {
                    textNode.setText("");
                }
            }
            $.state._time = time;
        }

    }

    PushSpeedInfo = ($, number, speed) => {
        index = number % subNodes.length;
        // $.log("index " + index);
        // $.log("speed" + speed);
        _textIndexSpeed.push({ index, speed });

        if (_textIndexSpeed.length > 0) {
            // テキストを更新
            let text = "";
            let count = 0;
            for (const { index, speed } of _textIndexSpeed) {
                text += `Box${index}:${speed > 0 ? "UP" : "DOWN"}\n`;
                count++;
                if (count >= 3) {
                    break;
                }
            }
            textNode.setText(text);
        }
    }
    return { Update, PushSpeedInfo };
})($);

$.onUpdate(deltaTime => {
    NodeManager.Update($, deltaTime);
});

$.onCommentReceived((comments) => {
    // $.log("comments " + comments.map(c => c.body));
    const indexRegex = /([0-9]+)/;
    const speedRegex = /(u|d|U|D|↑|↓|上|下|速|遅)/;

    for (const comment of comments) {
        const matchIndex = comment.body.match(indexRegex);
        const matchSpeed = comment.body.match(speedRegex);
        if (matchIndex && matchSpeed) {
            let number = parseInt(matchIndex[1]);
            const direction = matchSpeed[1];
            let speed = 0;
            if (["u", "U", "↑", "上", "速"].includes(direction)) {
                 speed += 1;
            } else if (["d", "D", "↓", "下", "遅"].includes(direction)) {
                speed += -1;
            }
            NodeManager.PushSpeedInfo($, number, speed);
        }
    }
})