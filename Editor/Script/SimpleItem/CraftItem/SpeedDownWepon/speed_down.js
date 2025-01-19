

$.onStart(() => {
    $.state.grabbingPlayer = null;
    $.state.grabbingLeft = true;
});

$.onGrab((isGrab, isLeft, player) => {
    if (isGrab) $.state.grabbingPlayer = player;
    else $.state.grabbingPlayer = null;
    $.state.grabbingLeft = isLeft;
});

const onCollide = () => {
    let _overlapPlayers = [];
    const speedL = 0.4;
    const speedR = 0.7;
    let _time = 0;
    const INTERVAL = 0.1;
    return ($, deltaTime) => {
        _time += deltaTime;
        if (_time < INTERVAL) {
            return;
        }
        _time = 0;

        let grabbingPlayer = $.state.grabbingPlayer;
        if (grabbingPlayer == null || !grabbingPlayer.exists()) {
            _overlapPlayers = [];
            return;
         }
        const grabbingLeft = $.state.grabbingLeft;
        let previousOverlapPlayers = _overlapPlayers;
        let currentOverlapPlayers = [];

        let collisions = $.getOverlaps();
        for (let collision of collisions) {
            let playerHandle = collision.handle;
            if (playerHandle == null || playerHandle?.type !== "player") return;
            if (playerHandle.id == grabbingPlayer.id) return;

            currentOverlapPlayers.push(playerHandle.id);
            if (previousOverlapPlayers.includes(playerHandle.id)) return;
            if (grabbingLeft) {
                playerHandle.setMoveSpeedRate(speedL);
            }
            else {
                playerHandle.setMoveSpeedRate(speedR);
             }
        }

        _overlapPlayers = currentOverlapPlayers;
    }
};
const handleCollisions = onCollide();

$.onUpdate(deltaTime => {
    handleCollisions($, deltaTime);
});