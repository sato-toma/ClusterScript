$.onStart(() => {
    $.state.rankingManagerItemHandle = null;
    $.state.scoreCounterActive = true;
});

$.onReceive((messageType, arg, sender) => {
    switch (messageType) {
        case "<> initialize":
            $.log("call initialize:");
            $.state.scoreCounterActive = true;
            break;
        case "<initializer> initialize ranking manager":
            sender.send("<marker> initialize ranking manager", {});
            break;
        case "<manager> initialize ranking manager":
            // $.state.rankingManagerItemHandle = arg?.RankingManager;
            $.state.rankingManagerItemHandle = sender;
            sender.send("<marker> initialize ranking manager", {});
            break;
    }
}, { item: true, player: true });

const onCollide = () => {
    const point = 1;
    let _overlapPlayers = [];
    return ($) => {
        var scoreCounterActive = $.state.scoreCounterActive;
        if (!scoreCounterActive) return;

        rankingManagerItemHandle = $.state.rankingManagerItemHandle 
        // 前のフレームで接触していたプレイヤーIDの一覧
        let previousOverlapPlayers = _overlapPlayers;

        // このフレームで接触しているプレイヤーIDの一覧
        let currentOverlapPlayers = [];
        let collisions = $.getOverlaps();
        for (let collision of collisions) {
            // 接触しているオブジェクトがプレイヤーであるかどうかを確認
            let playerHandle = collision.handle;
            // $.log("playerHandle?.type: " + playerHandle?.type);
            if (playerHandle == null || playerHandle?.type !== "player") return;
            // 現在接触しているプレイヤーの一覧に追加
            // $.log("playerHandle.id: " + playerHandle.id);
            currentOverlapPlayers.push(playerHandle.id);

            // 前のフレームで接触していたプレイヤーは除外
            // playerHandle.addVelocityの実行には頻度制限があるためその対策、また接触し続けた場合に加速し続けてしまうことを防止
            if (previousOverlapPlayers.includes(playerHandle.id)) return;
            // $.log("rankingManagerItemHandle.send: <marker> player gets point");
            rankingManagerItemHandle.send("<marker> player gets point", { PlayerHandle: playerHandle, Point: point });

            $.state.scoreCounterActive = false;
        }
        _overlapPlayers = currentOverlapPlayers;
    }
};

const handleCollisions = onCollide();
$.onUpdate(deltaTime => {
    handleCollisions($);
});