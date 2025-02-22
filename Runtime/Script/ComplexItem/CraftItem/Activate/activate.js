
const NodeManager = (($) => {
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
    const Update = ($, deltaTime) => {
        // インターバルをすぎたら、_textIndexSpeedの先頭要素を取得して
        {
            let time = $.state._time ?? 0;
            time += deltaTime;
            const INTERVAL = 1;
            if (time > INTERVAL) {
                time = 0;
                if (_textIndexSpeed.length > 0) {
                    const { index } = _textIndexSpeed.shift();
                    let enabled = subNodes[index].getEnabled();
                    subNodes[index].setEnabled(!enabled);
                } else {
                    textNode.setText("");
                }
            }
            $.state._time = time;
        }

    }

    PushSpeedInfo = ($, number) => {
        index = number % subNodes.length;
        // $.log("index: " + index);
        _textIndexSpeed.push({ index });

        if (_textIndexSpeed.length > 0) {
            // テキストを更新
            let text = "";
            let count = 0;
            for (const { index } of _textIndexSpeed) {
                text += `Tile${index}\n`;
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

    for (const comment of comments) {
        const matchIndex = comment.body.match(indexRegex);
        if (matchIndex) {
            let number = parseInt(matchIndex[1]);
            NodeManager.PushSpeedInfo($, number);
        }
    }
})