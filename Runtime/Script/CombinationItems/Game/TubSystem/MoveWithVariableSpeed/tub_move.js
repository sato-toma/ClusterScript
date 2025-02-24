const subNodeText = $.subNode("Text");
$.onReceive((messageType, arg, sender) => {
    // $.log(`<tub move> onReceive: ${arg}`);
    switch (messageType) {
        case "<tub manager> initialize":
            sender.send("<tub marker> receive initialize", {});
            break;
        case "<tub manager> Set Position":
            // $.log(`<manager> Set Position: ${arg}`);
            // $.log(`arg.position: ${arg.position}`);
            // $.log(`arg.displayName: ${arg.displayName}`);
            $.setPosition(arg.position);
            subNodeText.setText(arg.displayName);
            break;
    }
}, { item: true, player: false });