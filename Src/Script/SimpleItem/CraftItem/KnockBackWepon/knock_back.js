

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
    const speed = 5;
    const dirY = new Vector3(0, -1 * speed,0);
    return ($) => {
        let grabbingPlayer = $.state.grabbingPlayer;
        if (grabbingPlayer == null || !grabbingPlayer.exists()) {
            _overlapPlayers = [];
            return;
         }
        const grabbingLeft = $.state.grabbingLeft;
        let grabbingPlayerPosition = grabbingPlayer.getPosition();
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
                let direction = playerHandle.getPosition().clone().sub(grabbingPlayerPosition).normalize();
                playerHandle.addVelocity(direction.clone().multiplyScalar(speed));
            }
            else {
                playerHandle.addVelocity(dirY);
             }
        }

        _overlapPlayers = currentOverlapPlayers;
    }
};
const handleCollisions = onCollide();

$.onUpdate(deltaTime => {
    handleCollisions($);
});