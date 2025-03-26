const NodeManager = (($) => {
    const Update = ($, deltaTime) => {
    }
    return { Update,  };
})($);

$.onUpdate(deltaTime => {
    NodeManager.Update($, deltaTime);
});

$.onCommentReceived((comments) => {
    // $.log("comments " + comments.map(c => c.body));
    const speedRegex = /(u|d|U|D|↑|↓|上|下)/;
    for (const comment of comments) {
        const matchSpeed = comment.body.match(speedRegex);
        if ( matchSpeed) {
            const direction = matchSpeed[1];
            let speed = 0;
            if (["u", "U", "↑", "上"].includes(direction)) {
                speed += 1;
            } else if (["d", "D", "↓", "下"].includes(direction)) {
                speed += -1;
            }
        }
    }
    $.state.accel = true;
})

$.onPhysicsUpdate(deltaTime => {
    let accel = $.state.accel ?? false;
    if (accel) {
        $.state.accel = false;
        // $.log("relonPhysicsUpdateeasing");
        // $.log("accel: " + accel);
        let flag = $.state.flag ?? true;
        $.state.flag = !flag;
        if (flag) {
            let itemRotation = $.getRotation();
            $.log("itemRotation: " + itemRotation);
            const dir = new Vector3(1, 1, 0);
            // const theta = new Quaternion().setFromEulerAngles(new Vector3(0, 60, 0));
            const intensity = 4;
            // const velocity = dir.applyQuaternion(itemRotation).applyQuaternion(theta).multiplyScalar(intensity);
            const velocity = dir.applyQuaternion(itemRotation).multiplyScalar(intensity);
            $.log("addImpulsiveForce: velocity: " + velocity);
            $.addImpulsiveForce(velocity);
        }
        else {
            let itemRotation = $.getRotation();
            $.log("itemRotation: " + itemRotation);
            const dir = new Vector3(0, 1, 0);
            // const theta = new Quaternion().setFromEulerAngles(new Vector3(0, 60, 0));
            const intensity = 4;
            // const velocity = dir.applyQuaternion(itemRotation).applyQuaternion(theta).multiplyScalar(intensity);
            const velocity = dir.applyQuaternion(itemRotation).multiplyScalar(intensity);
            $.log("addImpulsiveTorque: velocity: " + velocity);
            $.addImpulsiveForce(new Vector3(0, 3, 0));
            $.addImpulsiveTorque(velocity);
        }

    }
});