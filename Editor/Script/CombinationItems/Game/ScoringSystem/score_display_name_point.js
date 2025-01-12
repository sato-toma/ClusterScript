const populationText = $.subNode("Text");
$.onStart(() => {
    $.state.rankingManagerItemHandle = null;
});

$.onReceive((messageType, arg, sender) => {
    switch (messageType) {
        case "<manager> initialize ranking manager":
            // $.state.rankingManagerItemHandle = arg?.RankingManager;
            $.log(`<manager> initialize ranking manager: ${arg}`);
            $.state.rankingManagerItemHandle = sender;
            sender.send("<marker> initialize ranking manager", {});
            break;
        case "<manager> show list item":
            $.log(`<manager> show list item: ${arg}`);
            let text = `${arg?.Name}: ${arg?.Point}`;
            populationText.setText(text);
            break;
    }
}, { item: true, player: true });

