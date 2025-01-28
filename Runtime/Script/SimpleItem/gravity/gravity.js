const onCollide = () => {
    let _overlapPlayers = [];
    const GRAVITY = -3;
    return ($) => {
        let grabbingPlayer = $.state.grabbingPlayer;
        if (grabbingPlayer == null || !grabbingPlayer.exists()) {
            _overlapPlayers = [];
            return;
        }
        let previousOverlapPlayers = _overlapPlayers;
        let currentOverlapPlayers = [];

        let collisions = $.getOverlaps();
        for (let collision of collisions) {
            let playerHandle = collision.handle;
            if (playerHandle == null || playerHandle?.type !== "player") return;
            if (playerHandle.id == grabbingPlayer.id) return;

            currentOverlapPlayers.push(playerHandle.id);
            if (previousOverlapPlayers.includes(playerHandle.id)) return;
            playerHandle.setGravity(GRAVITY);
        }

        _overlapPlayers = currentOverlapPlayers;
    }
};
const handleCollisions = onCollide();

$.onUpdate(deltaTime => {
    handleCollisions($);
});