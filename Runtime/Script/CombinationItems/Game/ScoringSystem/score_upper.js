$.onStart(() => {
    $.state.rankingManagerItemHandle = null;
});

$.onInteract(() => {
    // $.log(`onInteract`);
    // $.log(`$.state.rankingManagerItemHandle: ${$.state.rankingManagerItemHandle}`);
    $.state.rankingManagerItemHandle.send("<upper> switch list item", {});
});

$.onReceive((messageType, arg, sender) => {
    switch (messageType) {
        case "<manager> initialize ranking manager":
            $.state.rankingManagerItemHandle = sender;
            sender.send("<marker> initialize ranking manager", {});
            break;
    }
}, { item: true, player: true });

