// プロトコル
let protocolDamage = "damage";
let protocolDamageType = "number";

const materialHandle = $.material("material0");
const rainbowColors = [
    [1, 0, 0],     // Red
    [1, 0.5, 0],   // Orange
    [1, 1, 0],     // Yellow
    [0, 1, 0],     // Green
    [0, 1, 1],     // Cyan
    [0, 0, 1],     // Blue
    [1, 0, 1]      // Magenta
];
const colorSize = rainbowColors.length

$.onReceive((protocol, body, _) => {
    // $.log("プロトコル: " + protocol);
    // $.log("プロトコルの受信値: " + body);
    if (protocol !== protocolDamage) {
        return;
    }
    if (typeof (body) !== protocolDamageType) {
        return;
    }

    let truncated = Math.trunc(body);
    // $.log("受信値の整数値: " + truncated);
    const randomValue = Math.floor(Math.random() * colorSize);
    // $.log(" randomValue: " + randomValue);
    // 例: randomValueが0、truncatedが-8、colorSizeが7のとき、rainbowColorsNoは6になる
    let rainbowColorsNo = (((truncated + randomValue) % colorSize) + colorSize) % colorSize;
    // $.log("虹色インデックス: " + rainbowColorsNo);
    const [R, G, B] = rainbowColors[rainbowColorsNo];
    // $.log(`{R,G,B}=${R},${G},${B}`);
    materialHandle.setEmissionColor(R, G, B, 1);
});
