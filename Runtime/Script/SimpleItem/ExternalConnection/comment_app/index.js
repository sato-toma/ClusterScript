// callExternalの呼び出し間隔（秒数）
const interval = 15;
const requestType = "CommentApp";
const metaDataSubmit = "CommentAppSubmit";
const endpointId = "07aa78a7-1631-4a3f-9712-9002798dd4b8";
$.onStart(() => {
    // 現在のランキングを取得するため、recordsが空の状態でサーバーにアクセスする
    let request = {
        type: requestType,
        comments: ["Hello onStart"]
    };
    $.callExternal(endpointId, JSON.stringify(request), metaDataSubmit);

    // 前回のcallExternal呼び出しからの経過時間
    $.state.waitingTime = 0;
});


$.onUpdate(deltaTime => {
    // 前回の呼び出しから一定以上の時間が経過していればcallExternalを呼び出す
    let waitingTime = $.state.waitingTime + deltaTime;
    if (waitingTime >= interval) {
        waitingTime = 0;
        // サーバーへのrequestとして「サーバーでの処理分岐用タグ」「追加するレコード」「表示する上位ランカーの数」を設定
        // requestをstringに変換したものをサーバーに送信
        let request = {
            type: requestType,
            comments: ["Hello onUpdate"]
         };
        $.callExternal(endpointId, JSON.stringify(request), metaDataSubmit);
    }
    $.state.waitingTime = waitingTime;
});


// callExternal実行後、サーバーからの応答を受け取ったときに呼び出される処理
$.onExternalCallEnd((response, meta, errorReason) => {
    // サーバーとの通信でエラーが発生した場合にその理由を表示
    if (response == null) {
        $.log("callExternal ERROR: " + errorReason);
        return;
    }

    // metaを照合して処理を分岐
    // metaの値はcallExternalの第2引数に渡したもの
    if (meta === metaDataSubmit) {
        // サーバーからのresponseのJSONをパース
        let parsedResponse = JSON.parse(response);
        $.log("callExternal response: " + parsedResponse);
   }
});