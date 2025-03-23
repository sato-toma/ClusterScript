$.onGrab((isGrab, isLeftHand, player) => {
    if (isGrab) {
        // $.log("isGrabbing");
        $.state.grabbingPlayer = player;
    } else {
        // $.log("releasing");
        $.state.throwUp = true;
    }
});

$.onPhysicsUpdate(deltaTime => {
    let throwUp = $.state.throwUp ?? false;
    if (throwUp) {
        // $.log("relonPhysicsUpdateeasing");
        // $.log("throwUp: " + throwUp);
        let grabbingPlayer = $.state.grabbingPlayer;
        // $.log("grabbingPlayer: " + grabbingPlayer);
        if (grabbingPlayer === null || !grabbingPlayer.exists()) {
            $.state.throwUp = false;
            $.state.grabbingPlayer = null;
            return;
        }
        let playerRotation = grabbingPlayer.getRotation();
        const dir = new Vector3(0, 1, 1);
        const intensity = 4;
        // $.log("playerRotation: " + playerRotation);
        const velocity = dir.applyQuaternion(playerRotation).multiplyScalar(intensity);
        // $.log("velocity: " + velocity);
        $.addImpulsiveForce(velocity);
        $.state.throwUp= false;
    }
});