const velocity = new Vector3(0, 2, 0);
const tile = $.subNode("Tile");
const period = 3;
const width = 4;

const trapezoidalWave = (t) => {
    if (t < 0.25) {
        return t * 4;
    } else
        if (t < 0.5) {
            return 1;
        } else
            if (t < 0.75) {
                return 3 - t * 4;
            } else {
                return 0;
            }
};

$.onUpdate(deltaTime => {
    // 初期化
    if (!$.state.initialized) {
        $.state.initialized = true;
        $.state.overlapPlayers = [];
    }

    // 前のフレームで接触していたプレイヤーIDの一覧
    let previousOverlapPlayers = $.state.overlapPlayers;

    // このフレームで接触しているプレイヤーIDの一覧
    let currentOverlapPlayers = [];

    // 接触しているオブジェクトをすべて取得
    let overlaps = $.getOverlaps();

    for (let overlap of overlaps) {
        // 接触しているオブジェクトがプレイヤーであるかどうかを確認
        let playerHandle = overlap.object.playerHandle;
        if (playerHandle == null || playerHandle?.type !== "player") return;

        // 現在接触しているプレイヤーの一覧に追加
        currentOverlapPlayers.push(playerHandle.id);

        // 前のフレームで接触していたプレイヤーは除外
        // playerHandle.addVelocityの実行には頻度制限があるためその対策、また接触し続けた場合に加速し続けてしまうことを防止
        if (previousOverlapPlayers.includes(playerHandle.id)) return;

        // プレイヤーに一定の速度を加えて打ち上げる
        playerHandle.addVelocity(velocity);
    };

    $.state.overlapPlayers = currentOverlapPlayers;

    let time = $.state.time ?? 0;
    time += deltaTime;
    $.state.time = time;
    const pos = new Vector3(
        trapezoidalWave(time % period / period) * width - width / 2,
        0,
        0);
    tile.setPosition(pos);
});
