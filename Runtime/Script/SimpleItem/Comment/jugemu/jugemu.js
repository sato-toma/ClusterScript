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
        $.log("input: " + input);
        let expected = jugemuFull.slice(currentIndex, currentIndex + input.length);
        $.log("expected: " + expected);
        if (isJugemuMode) {
            if (expected === input) {
                // 入力が現在のターゲットの続きなら進行
                currentIndex += input.length;
                if (currentIndex === jugemuFull.length) {
                    $.log("ok"); // 全部正しく言えた
                    isJugemuMode = false;
                    currentIndex = 0;
                }
            } else {
                // 入力が現在のターゲットの続きでないなら失敗
                $.log("ng");
                isJugemuMode = false;
                currentIndex = 0;
            }
            continue;
        }
        if (jugemuFull.startsWith(input)) {
            // 「じゅ」などの部分入力でもモード開始
            isJugemuMode = true;
            currentIndex = input.length;
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
            $.log(text);

            isJugemuMode = false;
            currentIndex = 0;
        }

    }
})



