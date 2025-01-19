$.onStart(() => {
    $.state.rankingManagerItemHandle = null;
});

$.onInteract(() => {
    $.log(`onInteract`);
    $.state.rankingManagerItemHandle.send("<initializer> initialize", {});
});

$.onReceive((messageType, arg, sender) => {
    // $.log(`<manager> onReceive: ${arg}`);
    switch (messageType) {
        case "<manager> initialize ranking manager":
            $.state.rankingManagerItemHandle = sender;
            sender.send("<marker> initialize ranking manager", {});
            break;
    }
}, { item: true, player: true });

