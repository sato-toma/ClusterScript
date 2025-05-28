// callExternalの呼び出し間隔（秒数）
const interval = 15;

// GoogleAppsScriptのシート名
const sheetName = "ClusterJumpWorld0_1";
const goalStage = true;

// メタ情報
const metaData = sheetName;

const googleAppScriptType = "ClusterAzukiWorld";

// 表示するText View
const challengerNumText = $.subNode("ChallengerNumText");
const clearsNumText = $.subNode("ClearsNumText");
const clearedRateText = $.subNode("ClearedRateText");
const congratulationsText = $.subNode("CongratulationsText");

$.onStart(() => {
    let request = { type: googleAppScriptType, sheetName: sheetName, records: [] };

    // requestをstringに変換したものをサーバーに送信
    $.callExternal(JSON.stringify(request), metaData);

    // ランキングに新しく登録するレコードの配列
    $.state.records = [];

    // 前回のcallExternal呼び出しからの経過時間
    $.state.waitingTime = 0;
});


$.onUpdate(deltaTime => {
    // 初期化
    if (!$.state.initialized) {
        $.state.initialized = true;
        $.state.waitingTime = 0;
        $.state.records = [];
        $.state.overlapPlayers = [];

        challengerNumText.setText("Challengers: -");
        clearsNumText.setText("Clears: -");
        clearedRateText.setText("Clear Rate: -%");
        congratulationsText.setText("Congratulations! -");
    }

    // 前のフレームで接触していたプレイヤーIDの一覧
    let previousOverlapPlayers = $.state.overlapPlayers;
    // このフレームで接触しているプレイヤーIDの一覧
    let currentOverlapPlayers = [];
    // 接触しているオブジェクトをすべて取得
    let overlaps = $.getOverlaps();

    let tempRecords = [];
    let currentRecords = $.state.records;

    for (let overlap of overlaps) {
        // 接触しているオブジェクトがプレイヤーであるかどうかを確認
        let playerHandle = overlap.handle;
        if (playerHandle == null || playerHandle?.type !== "player") return;

        // 現在接触しているプレイヤーの一覧に追加
        currentOverlapPlayers.push(playerHandle.id);

        // 前のフレームで接触していたプレイヤーは除外
        // playerHandle.addVelocityの実行には頻度制限があるためその対策、また接触し続けた場合に加速し続けてしまうことを防止
        if (previousOverlapPlayers.includes(playerHandle.id)) return;

        let record = { namePlayer: playerHandle.userDisplayName, userId: playerHandle.userId, goalStage: goalStage };
        tempRecords.push(record)
    };
    tempRecords.forEach(tempRecord => {
        let existingIndex = currentRecords.findIndex(obj => obj.userId === tempRecord.userId);
        if (existingIndex === -1) {
            // 同じuserIdがない場合、新しいJSONオブジェクトを配列に追加
            currentRecords.push(tempRecord);
        } else {
            // 同じuserIdがある場合、isSetの値を更新
            currentRecords[existingIndex].goalStage |= tempRecord.goalStage;
        }
    })
    $.state.records = currentRecords;

    // 前回の呼び出しから一定以上の時間が経過していればcallExternalを呼び出す
    let waitingTime = $.state.waitingTime + deltaTime;
    if (waitingTime >= interval) {
        waitingTime = 0;

        let records = $.state.records;
        let request = { type: googleAppScriptType, sheetName: sheetName, records: records };

        // requestをstringに変換したものをサーバーに送信
        $.callExternal(JSON.stringify(request), metaData);

        // サーバーに送信済みのレコード情報をクリア
        $.state.records = [];
    }

    $.state.waitingTime = waitingTime;
});

$.onInteract(playerHandle => {
    let records = $.state.records;
    let record = { namePlayer: playerHandle.userDisplayName, userId: playerHandle.userId, goalStage: goalStage };
    records.push(record);
    $.state.records = records;
});

// callExternal実行後、サーバーからの応答を受け取ったときに呼び出される処理
$.onExternalCallEnd((response, meta, errorReason) => {
    // サーバーとの通信でエラーが発生した場合にその理由を表示
    if (response == null) {
        $.log("callExternal ERROR: " + errorReason);
        // challengerNumText.setText(errorReason);
        // clearsNumText.setText(errorReason);
        // clearedRateText.setText(errorReason);
        return;
    }
    // metaを照合して処理を分岐
    // metaの値はcallExternalの第2引数に渡したもの
    if (meta === metaData) {
        // サーバーからのresponseのJSONをパース
        let parsedResponse = JSON.parse(response);

        // responseの情報でtextViewを更新
        challengerNumText.setText("Challengers: " + parsedResponse.ChallengerNum);
        clearsNumText.setText("Clears: " + parsedResponse.ClearsNum);
        clearedRateText.setText("Clear Rate: " + parsedResponse.ClearedRate + "%");
        const textCongratulations = parsedResponse.Congratulations.join("\n");
        congratulationsText.setText("Congratulations! " + textCongratulations);
    }
});
