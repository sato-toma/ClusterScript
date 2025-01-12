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

const PlayerScoresManager = ((() => {
    const _playerRecords = [];
    const playerScores = ($, { PlayerHandle: playerHandle, Point: point, State:state }) => {
        if (playerHandle == null || !playerHandle?.exists()) return _playerRecords;
        const playerId = playerHandle.id;
        let playerRecord = _playerRecords.find(record => record.PlayerHandle.id === playerId);
        // const playerRecord = _playerRecords.get(playerId) || { ID: playerId, PlayerHandle: playerHandle, Point: 0, State: 'Alive' };
        // playerRecord.Point += point;
        // playerRecord.State = state;
        // _playerRecords.set(playerId, playerRecord);
        if (playerRecord) {
            playerRecord.Point += point || 0;
            playerRecord.State = state || "Alive";
        } else {
            playerRecord = { PlayerHandle: playerHandle, Point: point || 0, State: state || "Alive" };
            _playerRecords.push(playerRecord);
        }
        return _playerRecords;
    };

    const getPlayerRecords = () => {
        return _playerRecords;
    };

    const getNextRecord = ($, currentIndex) => {
        let nextIndex = (currentIndex >= _playerRecords.length - 1) ? 0 : currentIndex + 1;
        $.log(`nextIndex: ${nextIndex}`);
        if (nextIndex >= 0 && nextIndex < _playerRecords.length) {
            let playerRecord = _playerRecords[nextIndex];
            $.log(`playerRecord: ${JSON.stringify(playerRecord)}`);
            return playerRecord;
        }
        return null;
        // $.log(`currentIndex: ${currentIndex}`);
        // $.log(`nextIndex: ${nextIndex}`);
    };
    return { playerScores, getPlayerRecords, getNextRecord };
})());

const ScoreManager = ((playerScoresManager) => {
    const _playerScoresManager = playerScoresManager;
    const _rankingScores = [];
    let _activeRecordIndex = 0;
    const addRankingMarker = ($, marker) => {
        $.log(`addRankingMarker`);
        if (marker) {
            _rankingScores.push(marker);
        }
    };
    const initializeMarkers = ($) => {
        const key = "<initializer> initialize";
        $.log(`initializeMarkers`);
        for (const marker of _rankingScores) {
            // $.log(`try send`);
            marker.send(key, {});
        }
    };
    const showListItem = ($, message) => {
        const key = "<manager> show list item";
        for (const marker of _rankingScores) {
            // $.log(`try send`);
            marker.send(key, message);
        }
    };
    const showList = ($, message) => {
        const key = "<manager> show list";
        for (const marker of _rankingScores) {
            // $.log(`try send`);
            marker.send(key, message);
        }
    };
    const getActiveScore = ($) => {
        $.log(`_activeRecordIndex: ${_activeRecordIndex}`);
        let activeScore = _playerScoresManager.getNextRecord($, _activeRecordIndex);
        if (activeScore) {
            _activeRecordIndex += 1;
        } else {
            activeRecordIndex = 0
        }
        $.log(`activeScore: ${JSON.stringify(activeScore)}`);
        return activeScore;
    }
    return {
        addRankingMarker,
        showListItem,
        showList,
        initializeMarkers,
        getActiveScore,
    };
})(PlayerScoresManager);

$.onReceive((messageType, arg, sender) => {
    // $.log(`<manager> onReceive: ${arg}`);
    switch (messageType) {
        case "<initializer> initialize":
            ScoreManager.initializeMarkers($);
            break;
        case "<marker> initialize ranking manager":
            // $.log(`initialize ranking marker: ${sender}`);
            ScoreManager.addRankingMarker($, sender);
            break;
        case "<marker> player gets point":
            {
                $.log(`player gets PlayerHandle: ${arg?.PlayerHandle}`);
                $.log(`player gets point: ${arg?.Point}`);
                let map = PlayerScoresManager.playerScores($, arg);

                $.log(`Scores map: ${JSON.stringify(Object.fromEntries(map))}`);
                let message = []
                for (let [key, value] of map.entries()) {
                    message.push({ Name: value?.PlayerHandle.userDisplayName, Point: value?.Point, State: value?.State });
                }
                $.log(`switch list: ${JSON.stringify(message)}`);
                ScoreManager.showList($, message);
                break;
            }
        case "<switcher> switch list item":
            {
                let record = ScoreManager.getActiveScore($);
                let message = { Name: record?.PlayerHandle.userDisplayName, Point: record?.Point };
                $.log(`switch list item: ${JSON.stringify(message)}`);
                ScoreManager.showListItem($, message);
                break;
            }
    }
}, { item: true, player: true });

