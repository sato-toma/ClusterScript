const populationText = $.subNode("Text");
$.onStart(() => {
    $.state.rankingManagerItemHandle = null;
});

$.onReceive((messageType, arg, sender) => {
    switch (messageType) {
        case "<manager> initialize ranking manager":
            // $.state.rankingManagerItemHandle = arg?.RankingManager;
            // $.log(`<manager> initialize ranking manager: ${arg}`);
            $.state.rankingManagerItemHandle = sender;
            sender.send("<marker> initialize ranking manager", {});
            break;
        case "<manager> show list":
            // $.log(`<manager> show list: ${arg}`);
            text = "";
            for (let message of arg) {
                text += `${message?.Name}: ${message?.Point}: ${message?.State}\n`;
            }
            // let text = `${arg?.PlayerHandle.userDisplayName}: ${arg?.Point}: ${arg?.State}`;
            populationText.setText(text);
            break;
    }
}, { item: true, player: true });

