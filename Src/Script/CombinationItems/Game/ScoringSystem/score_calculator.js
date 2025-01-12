const initializeHandles = () => {
    const key = "<manager> initialize ranking manager";
    return ($) => {
        let itemHandles = $.getItemsNear(new Vector3(), Infinity);
        for (let itemHandle of itemHandles) {
            const arg = {};
            arg.itemHandle = $.itemHandle;
            itemHandle.send(key, {});
        }
    }
};
const handleInitializeHandles = initializeHandles();
$.onStart(() => {
    handleInitializeHandles($);
});

const playerScores = () => {
    const _scoresMap = new Map();
    return ($, { PlayerHandle: playerHandle, Point: point }) => {
        if (playerHandle == null || !playerHandle?.exists()) return _scoresMap;
        const playerId = playerHandle.id;
        $.log(`playerScores: ${playerId}, ${_scoresMap.get(playerId)}`);
        if (_scoresMap.has(playerId)) {
            _scoresMap.set(playerId, _scoresMap.get(playerId) + point);
        } else {
            _scoresMap.set(playerId, point);
        }

        return _scoresMap;
    }
};
const handlePlayerScores = playerScores();

$.onReceive((messageType, arg, sender) => {
    // $.log(`<manager> onReceive: ${arg}`);
    switch (messageType) {
        case "<> initialize":
            break;
        case "<marker> initialize ranking manager":
            // $.log(`initialize ranking marker: ${sender}`);
            break;
        case "<marker> player gets point":
            // $.log(`player gets PlayerHandle: ${arg?.PlayerHandle}`);
            // $.log(`player gets point: ${arg?.Point}`);
            let map = handlePlayerScores($, arg);
            $.log(`Scores map: ${JSON.stringify(Object.fromEntries(map))}`);
            break;
    }
}, { item: true, player: true });

