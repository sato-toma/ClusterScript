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
    const dangerousDrivingRegex = /(あおり|煽り|アオリ)(運転|うんてん|ウンテン)/;
    const superAccelerationRegex = /(超|ちょう|チョウ)(加速|かそく|カソク)/;
    const doughnutRegex = /(ドーナッツターン|どーなっつたーん)/;
    const aisiteruRegex = /(愛|あい|アイ)しているの(サイン|さいん)/;
    const pompingBrakeRegex = /(ポンピングブレーキ|ぽんぴんぐぶれーき)/;
    const deathRoleRegex = /(デスロール|ですろーる)/;
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
            $.state.accel = true;
        }

        if (dangerousDrivingRegex.test(comment.body)) {
            $.state.dangerousDrivingRegex = true;
        }

        if (superAccelerationRegex.test(comment.body)) {
            $.state.superAccelerationRegex = true;
        }

        if (doughnutRegex.test(comment.body)) {
            $.state.doughnutRegex = true;
        }
        if (deathRoleRegex.test(comment.body)) {
            $.state.deathRoleRegex = true;
        }
        if (aisiteruRegex.test(comment.body)) {
            $.state.aisiteruRegex = true;
        }
        if (pompingBrakeRegex.test(comment.body)) {
            $.state.pompingBrakeRegex = true;
        }
    }

})
let INTERVAL = 0.5; // [s]
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
            // $.log("itemRotation: " + itemRotation);
            const dir = new Vector3(1, 1, 0);
            // const theta = new Quaternion().setFromEulerAngles(new Vector3(0, 60, 0));
            const intensity = 4;
            // const velocity = dir.applyQuaternion(itemRotation).applyQuaternion(theta).multiplyScalar(intensity);
            const velocity = dir.applyQuaternion(itemRotation).multiplyScalar(intensity);
            // $.log("addImpulsiveForce: velocity: " + velocity);
            $.addImpulsiveForce(velocity);
        }
        else {
            let itemRotation = $.getRotation();
            // $.log("itemRotation: " + itemRotation);
            const dir = new Vector3(0, 1, 0);
            // const theta = new Quaternion().setFromEulerAngles(new Vector3(0, 60, 0));
            const intensity = 4;
            // const velocity = dir.applyQuaternion(itemRotation).applyQuaternion(theta).multiplyScalar(intensity);
            const velocity = dir.applyQuaternion(itemRotation).multiplyScalar(intensity);
            // $.log("addImpulsiveTorque: velocity: " + velocity);
            $.addImpulsiveForce(new Vector3(0, 3, 0));
            $.addImpulsiveTorque(velocity);
        }
    }
    let dangerousDrivingRegex = $.state.dangerousDrivingRegex ?? false;
    if (dangerousDrivingRegex) {
        let counter = $.state.counter??0;
        // $.log("counter: " + counter);
        let _time = $.state.time ?? 0;
        _time += deltaTime;
        $.state.time = _time;
        if (_time < INTERVAL) {
            return;
        }

        $.state.time = 0;

        let itemRotation = $.getRotation();
        let torque = counter % 2 == 0 ? new Vector3(0, 1, 0) : new Vector3(0, -1, 0);
        $.log("torque: " + torque);
        const velocity = torque.applyQuaternion(itemRotation);
        $.addImpulsiveForce(new Vector3(0, 1, 0));
        $.addImpulsiveTorque(velocity);
        counter++;
        if (counter >= 4) {
            counter = 0;
            $.state.dangerousDrivingRegex = false;
        }
        $.state.counter = counter;
    }
    let superAccelerationRegex = $.state.superAccelerationRegex ?? false;
    if (superAccelerationRegex) {
        $.state.superAccelerationRegex=false;
        let itemRotation = $.getRotation();
        // $.log("itemRotation: " + itemRotation);
        const dir = new Vector3(1, 0, 0);
        // const theta = new Quaternion().setFromEulerAngles(new Vector3(0, 60, 0));
        const intensity = 100;
        // const velocity = dir.applyQuaternion(itemRotation).applyQuaternion(theta).multiplyScalar(intensity);
        const velocity = dir.applyQuaternion(itemRotation).multiplyScalar(intensity);
        // $.log("addImpulsiveForce: velocity: " + velocity);
        $.addImpulsiveForce(velocity);
    }

    let doughnutRegex = $.state.doughnutRegex ?? false;
    if (doughnutRegex) {
        let _time = $.state.time1 ?? 0;
        _time += deltaTime;
        $.state.time1 = _time;
        if (_time > INTERVAL * 10) {
            $.state.doughnutRegex = false;
            $.state.time1 = 0;
            return;
        }

        let itemRotation = $.getRotation();
        let torque = new Vector3(0, 1, 0) ;
        // $.log("itemRotation: " + itemRotation);

        // const theta = new Quaternion().setFromEulerAngles(new Vector3(0, 60, 0));
        const velocityTorque = torque.applyQuaternion(itemRotation);

        // $.log("addImpulsiveForce: velocity: " + velocity);
        $.addImpulsiveTorque(velocityTorque);
        const dir = new Vector3(0.5, 0, 0);
        const velocity = dir.applyQuaternion(itemRotation);
        $.addImpulsiveForce(velocity);
    }
    let deathRoleRegex = $.state.deathRoleRegex ?? false;
    if (deathRoleRegex) {
        let counter = $.state.counterDeathRoleRegex ?? 0;
        // $.log("counter: " + counter);
        let _time = $.state.timeDeathRoleRegex ?? 0;
        _time += deltaTime;
        $.state.timeDeathRoleRegex = _time;
        if (_time < INTERVAL) {
            return;
        }

        $.state.timeDeathRoleRegex = 0;

        let itemRotation = $.getRotation();
        let torque = new Vector3(2, 0, 0);
        $.log("torque: " + torque);
        const velocity = torque.applyQuaternion(itemRotation);
        $.addImpulsiveForce(new Vector3(0, 1, 0));
        $.addImpulsiveTorque(velocity);
        counter++;
        if (counter >= 6) {
            counter = 0;
            $.state.deathRoleRegex = false;
        }
        $.state.counterDeathRoleRegex = counter;
    }
    let aisiteruRegex = $.state.aisiteruRegex ?? false;
    if (aisiteruRegex) {

        let counter = $.state.counterAisiteru ?? 0;
        let _time = $.state.timeAisiteru ?? 0;
        _time += deltaTime;
        $.state.timeAisiteru = _time;
        if (_time < INTERVAL) {
            return;
        }
        $.state.timeAisiteru = 0;
        let hazardLampNode = $.subNode("HazardLamp");
        let currentActive = hazardLampNode.getEnabled();
        hazardLampNode.setEnabled(!currentActive);
        counter++;
        if (counter >= 10) {
            counter = 0;
            $.state.aisiteruRegex = false;
            hazardLampNode.setEnabled(false);
        }
        $.state.counterAisiteru = counter;
    }

    let pompingBrakeRegex = $.state.pompingBrakeRegex ?? false;
    if (pompingBrakeRegex) {

        let counter = $.state.counterPomping ?? 0;
        let _time = $.state.timePomping ?? 0;
        _time += deltaTime;
        $.state.timePomping = _time;
        if (_time < INTERVAL) {
            return;
        }
        $.state.timePomping = 0;
        let hazardLampNode = $.subNode("BrakeLamp");
        let currentActive = hazardLampNode.getEnabled();
        hazardLampNode.setEnabled(!currentActive);
        counter++;
        if (counter >= 6) {
            counter = 0;
            $.state.pompingBrakeRegex = false;
            hazardLampNode.setEnabled(false);
        }
        $.state.counterPomping = counter;
    }
});
