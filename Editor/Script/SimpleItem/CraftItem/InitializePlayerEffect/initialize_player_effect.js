
$.onInteract(() => {
    $.log(`onInteract`);
    let players = $.getPlayersNear(new Vector3(), Infinity);
    for (let player of players) {
        $.log(`resetPlayerEffects`);
        player.resetPlayerEffects();
    }
});


