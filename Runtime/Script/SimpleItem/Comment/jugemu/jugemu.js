// const subNodeText = $.subNode("Text");
const jugemuFull =
    "じゅげむ" + "じゅげむ" +
    "ごこうのすりきれ" +
    "かいじゃりすいぎょの" +
    "すいぎょうまつ" + "うんらいまつ" + "ふうらいまつ" +
    "くうねるところにすむところ" +
    "やぶらこうじのぶらこうじ" +
    "ぱいぽぱいぽぱいぽのしゅーりんがん" +
    "しゅーりんがんのぐーりんだい" +
    "ぐーりんだいのぽんぽこぴーのぽんぽこなーの" +
    "ちょうきゅうめいのちょうすけ";
const toHiragana = (text) => {
    const mapping = {
        "寿": "じゅ", "限": "げ", "無": "む",
        "五": "ご", "劫": "こう", "擦": "す", "切": "き",
        "海": "かい", "砂": "じゃ", "利": "り",
        "水": "すい", "魚": "ぎょ",
        "行": "ぎょう", "末": "まつ", "雲": "うん", "来": "らい", "風": "ふう",
        "食": "く", "寝": "ね", "処": "ところ", "住": "す",
        "藪": "やぶ", "柑": "こう", "子": "じ",
        "パ": "ぱ", "イ": "い", "ポ": "ぽ", "シ": "し", "ュ": "ゅ", "ー": "ー",
        "リ": "り", "ン": "ん", "ガ": "が", "グ": "ぐ", "ダ": "だ", "コ": "こ",
        "ピ": "ぴ", "ナ": "な",
        "長": "ちょう", "久": "きゅう", "命": "めい", "助": "すけ",
        "ジ": "じ", "ゲ": "げ", "ム": "む",
        "ゴ": "ご", "ウ": "う", "ノ": "の", "ス": "す", "キ": "き", "レ": "れ",
        "カ": "か", "ャ": "ゃ",
        "ギ": "ぎ", "ョ": "ょ",
        "マ": "ま", "ツ": "つ", "ヤ": "や", "ブ": "ぶ", "ラ": "ら", "フ": "ふ",
        "ク": "く", "ネ": "ね", "ル": "る", "ト": "と", "ロ": "ろ", "ニ": "に",
        "チ": "ち", "メ": "め", "ケ": "け",
    };
    return text.split("").map(c => mapping[c] || c).join("");
};
let isJugemuMode = false;
let currentIndex = 0;

$.onCommentReceived((comments) => {
    $.log("comments " + comments.map(c => c.body));
    for (const comment of comments) {
        // $.log("currentIndex" + currentIndex);

        let input = toHiragana(comment.body.trim());
        // $.log("input: " + input);
        let expected = jugemuFull.slice(currentIndex, currentIndex + input.length);
        // $.log("expected: " + expected);
        if (isJugemuMode) {
            if (expected === input) {
                // 入力が現在のターゲットの続きなら進行
                currentIndex += input.length;

                let playerHandle = comment.sender;
                if (playerHandle !== null) {
                    // not ghost or group viewing users
                    let players = $.state.dancingPlayers;
                    $.state.dancingPlayers = players.concat(playerHandle);
                }
                if (currentIndex === jugemuFull.length) {
                    // $.log("ok"); // 全部正しく言えた
                    isJugemuMode = false;
                    currentIndex = 0;
                    $.state.dancingPlayers = [];
                }
            } else {
                // 入力が現在のターゲットの続きでないなら失敗
                // $.log("ng");
                isJugemuMode = false;
                currentIndex = 0;
                $.state.dancingPlayers = [];
            }
            continue;
        }
        if (jugemuFull.startsWith(input)) {
            // 「じゅ」などの部分入力でもモード開始
            isJugemuMode = true;
            currentIndex = input.length;

            let playerHandle = comment.sender;
            if (playerHandle !== null) {
                // not ghost or group viewing users
                let players = $.state.dancingPlayers;
                $.state.dancingPlayers = players.concat(playerHandle);
            }
            continue;
        }
        if (comment.body === comment.displayName) {
            let name = comment.displayName.trim();
            let firstChar = name.length > 0 ? name.charAt(0) : " ";
            let texts = [
                `おおそうじゃった、そうじゃった。\nお前さんは${comment.displayName}じゃったな。`,
                `${comment.displayName}というのかい？贅沢な名だね。\n今からお前の名前は${firstChar}だ。`,
                `${comment.displayName}...下の名前なんだっけ`,
                `${comment.displayName}君といっしょにいるとポカポカする。`,
            ];

            // ランダムに選択
            let text = texts[Math.floor(Math.random() * texts.length)];
            // subNodeText.setText(text);
            // $.log(text);

            isJugemuMode = false;
            currentIndex = 0;
            $.state.dancingPlayers = [];
        }

    }
})

const humanoidAnimation = $.humanoidAnimation("Dance0");
const danceChangePerSec = 0.12;
$.onStart(() => {
    $.state.danceTick = 0; //ダンスの秒数
    $.state.dancingPlayers = []; //ダンスプレイヤー
    $.state.tick = 0; //ポーズ切りかえを行うまでの秒数を計測
    $.state.danceLength = humanoidAnimation.getLength(); //ダンスの長さ
});
// idでフィルタリングと重複削除を行う関数
function filterAndRemoveDuplicates(array) {
    const seenIds = new Set(); // 重複をチェックするためのセット
    return array.filter((obj) => {
        // 重複チェック
        if (seenIds.has(obj.id)) {
            return false; // すでに同じidのオブジェクトがある場合は除外
        } else {
            seenIds.add(obj.id); // 新しいidをセットに追加
            return true; // 重複していない場合は残す
        }
    });
}

$.onUpdate((deltaTime) => {
    //ダンスの秒数を進める
    $.state.danceTick += deltaTime;
    if ($.state.danceTick > $.state.danceLength) {
        //ダンスが終わったら先頭のほうに戻す
        $.state.danceTick -= $.state.danceLength;
    }

    $.state.tick += deltaTime;
    if ($.state.tick < danceChangePerSec) {
        return;
    }
    $.state.tick -= danceChangePerSec;

    // $.log("dancingPlayers: " + $.state.dancingPlayers.length);
    // $.log("danceTick: " + $.state.danceTick);
    // $.log("danceLength: " + $.state.danceLength);
    //現在のダンス秒数から現在のポーズを取得
    let pose = humanoidAnimation.getSample($.state.danceTick);
    let dancingExistingPlayers = $.state.dancingPlayers.filter((player) => player.exists());
    let duplicatesRemovedArray = filterAndRemoveDuplicates(dancingExistingPlayers);
    //ワールドで対象のプレイヤーにポーズをとらせる
    duplicatesRemovedArray.forEach((p) => p.setHumanoidPose(pose, { timeoutSeconds: 1.0, timeoutTransitionSeconds: 0.3, transitionSeconds: 0.11 }));

    //今回いたプレイヤーは記録しておく
    $.state.dancingPlayers = dancingExistingPlayers;
});