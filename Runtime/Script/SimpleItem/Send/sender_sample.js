// プロトコル
let protocolDamage = "damage";
let protocolDamageValue = 0;

$.onStart(() => {
    $.state.using = false;
    // $.log("プロトコルの送信値: " + protocolDamageValue);
    $.state.damage = protocolDamageValue;
});

$.onUse((isDown, player) => {
    if (!isDown) {
        return;
    }

    if ($.state.using) {
        return;
    }

    if ($.getGrabbingPlayer() === null) {
        return;
    }
    // $.log("start using");
    $.state.using = true;
});

$.onUpdate((dt) => {
    if (!$.state.using) {
        return;
    }

    if ($.getGrabbingPlayer() === null) {
        return;
    }
    $.log("onUpdate using");
    // OverlapDetectorShapeに重なっている、検知対象となる物体
    let overlaps = $.getOverlaps();
    let handles = [];
    for (let overlap of overlaps) {
        $.log("overlap.handle?.type:" + overlap.handle?.type);
        if (overlap.handle?.type === "item") {
            handles.push(overlap.handle);
        }
    }

    // $.log("damage プロトコルにdamage値を発火");
    // $.log("handles.length: " + handles.length);
    for (let i = 0; i < handles.length; i++) {
        $.log("送信ダメージ: " + $.state.damage);
        handles[i].send(protocolDamage, $.state.damage);
    }

    // using終了
    $.state.using = false;
});