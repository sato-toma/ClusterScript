// const subNodeText = $.subNode("Text");
const JugemuManager = (($) => {
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
    _dancingPlayers = []; //ダンスプレイヤー
    let _commentQueue = [];
    let _isJugemuMode = false;
    let _currentIndex = 0;
    const sound = $.audio("Sound");
    function StopJugemu($) {
        _isJugemuMode = false;
        sound.stop();
        _currentIndex = 0;
        _dancingPlayers = [];
    }
    const PopComment = ($) => {
        // $.log("_commentQueue" + _commentQueue);
        if (_commentQueue.length > 0) {
            const comment = _commentQueue.shift();
            // $.log("comment" + comment);
            // $.log("_currentIndex" + _currentIndex);

            let input = toHiragana(comment.body.trim());
            // $.log("input: " + input);
            let expected = jugemuFull.slice(_currentIndex, _currentIndex + input.length);
            // $.log("expected: " + expected);
            if (_isJugemuMode) {
                if (expected === input) {
                    // 入力が現在のターゲットの続きなら進行
                    _currentIndex += input.length;

                    let playerHandle = comment.sender;
                    if (playerHandle !== null) {
                        // not ghost or group viewing users
                        let players = _dancingPlayers;
                        _dancingPlayers = players.concat(playerHandle);
                    }
                    if (_currentIndex === jugemuFull.length) {
                        // $.log("ok"); // 全部正しく言えた
                        StopJugemu($);
                    }
                } else {
                    // 入力が現在のターゲットの続きでないなら失敗
                    // $.log("ng");
                    StopJugemu($);
                }
            } else {
                if (jugemuFull.startsWith(input)) {
                    // 「じゅ」などの部分入力でもモード開始
                    _isJugemuMode = true;
                    sound.play();
                    _currentIndex = input.length;

                    let playerHandle = comment.sender;
                    if (playerHandle !== null) {
                        // not ghost or group viewing users
                        let players = _dancingPlayers;
                        _dancingPlayers = players.concat(playerHandle);
                    }
                }
            }
         }
    }

    const AddComments = ($, comments) => {
        // $.log("AddComments " + comments.map(c => c.body));
        _commentQueue = _commentQueue.concat(comments);
    }

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
    const humanoidAnimation = $.humanoidAnimation("Dance0");
    const _danceLength = humanoidAnimation.length;
    _danceTick= 0; //ダンスの秒数
    const Dance = ($) => {
        // $.log("dancingPlayers: " + _dancingPlayers.length);
        // $.log("danceTick: " + danceTick);
        // $.log("danceLength: " + _danceLength);
        //現在のダンス秒数から現在のポーズを取得
        let pose = humanoidAnimation.getSample(_danceTick);
        let dancingExistingPlayers = _dancingPlayers.filter((player) => player.exists());
        let duplicatesRemovedArray = filterAndRemoveDuplicates(dancingExistingPlayers);
        //ワールドで対象のプレイヤーにポーズをとらせる
        duplicatesRemovedArray.forEach((p) => p.setHumanoidPose(pose, { timeoutSeconds: 1.0, timeoutTransitionSeconds: 0.3, transitionSeconds: 0.11 }));

        //今回いたプレイヤーは記録しておく
        _dancingPlayers = dancingExistingPlayers;
    }
    const UpdateDance = ($, deltaTime) => {
        //ダンスの秒数を進める
        _danceTick += deltaTime;
        if (_danceTick > _danceLength) {
            //ダンスが終わったら先頭のほうに戻す
            _danceTick -= _danceLength;
        }
    }
    return { PopComment, AddComments, UpdateDance, Dance };
 })($);


$.onCommentReceived((comments) => {
    JugemuManager.AddComments($, comments);
    for (const comment of comments) {
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
            $.log(text);
        }
     }
})

const IntervalUpdater = (() => {
    let _tick = 0; // 切りかえを行うまでの秒数を計測
    const INTERVAL = 0.2;
    const IsEnough = ($, deltaTime) => {
        _tick += deltaTime;
        if (_tick < INTERVAL) {
            return false;
        }
        _tick -= INTERVAL;
        return true;
     }
    return { IsEnough }
})();

$.onUpdate((deltaTime) => {
    JugemuManager.PopComment($);
    JugemuManager.UpdateDance($, deltaTime);
    if (!IntervalUpdater.IsEnough($, deltaTime)) {
        return;
    }
    JugemuManager.Dance($);
});