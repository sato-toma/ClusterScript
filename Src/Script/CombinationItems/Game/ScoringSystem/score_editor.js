const initializeHandles = () => {
    const key = "<initializer> initialize ranking manager";
    return ($) => {
        let itemHandles = $.getItemsNear(new Vector3(), Infinity);
        for (let itemHandle of itemHandles) {
            const arg = {};
            arg.itemHandle = $.itemHandle;
            itemHandle.send(key, { });
        }
    }
};
const handleInitializeHandles = initializeHandles();
$.onStart(() => {
    handleInitializeHandles($);
});

const MarkerManager = (() => {
    const _rankingMarkers = [];
    const addRankingMarker = ($, marker) => {
        $.log(`addRankingMarker`);
        if (marker) {
            _rankingMarkers.push(marker);
        }
    };
    const initializeMarkers = ($) => {
        const key = "<> initialize";
        $.log(`initializeMarkers`);
        for (const marker of _rankingMarkers) {
            $.log(`try send`);
            marker.send(key, {});
        }
    };
    return {
        addRankingMarker,
        initializeMarkers
    };
})();

$.onInteract(() => {
    $.log(`onInteract`);
    MarkerManager.initializeMarkers($);
});


$.onReceive((messageType, arg, sender) => {
    // $.log(`<manager> onReceive: ${arg}`);
    switch (messageType) {
        case "<> initialize":
            break;
        case "<marker> initialize ranking manager":
            $.log(`initialize ranking marker: ${sender}`);
            MarkerManager.addRankingMarker($, sender);
            break;
    }
}, { item: true, player: true });

