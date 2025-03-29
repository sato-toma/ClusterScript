const dirFrontItem = new Vector3(1, 0, 0) // アイテムの正面のベクトル
const dirUpItem = new Vector3(0, 1, 0) // アイテムの上のベクトル
const dirRightItem = new Vector3(0, 0, 1) // アイテムの右のベクトル

const DangerousDrivingManager = (($) => {
    const REGEX = /(あおり|煽り|アオリ)(運転|うんてん|ウンテン)/;
    const INTERVAL = 0.5; // [s]
    const TRY_COUNT = 4;
    let _active = false
    let _counter = 0;
    let _time = 0;
    const onCommentReceived = ($, message) => {
        if (REGEX.test(message)) {
            _active = true;
        }
    }
    const onPhysicsUpdate = ($, deltaTime) => {
        if (_active) {
            _time += deltaTime;
            if (_time < INTERVAL) {
                return;
            }
            _time = 0;

            // Y軸(上)方向に力を加える
            $.addImpulsiveForce(dirUpItem);

            // Y軸回転を加える
            let itemRotation = $.getRotation();
            let torque = _counter % 2 == 0 ? dirUpItem : dirUpItem.clone().negate();
            // $.log("torque: " + torque);
            const velocity = torque.applyQuaternion(itemRotation);
            $.addImpulsiveTorque(velocity);

            if (_counter >= TRY_COUNT) {
                _counter = 0;
                _active = false;
            }
            _counter++;
        }
    }
    return { onCommentReceived, onPhysicsUpdate };
})($);

const SuperAccelerationManager = (($) => {
    const REGEX = /(超|ちょう|チョウ)(加速|かそく|カソク)/;
    let _active = false
    const onCommentReceived = ($, message) => {
        if (REGEX.test(message)) {
            _active = true;
        }
    }
    const onPhysicsUpdate = ($, deltaTime) => {
        if (_active) {
            _active = false;
            let itemRotation = $.getRotation();
            const dir = dirFrontItem.clone();
            const intensity = 100;
            const velocity = dir.applyQuaternion(itemRotation).multiplyScalar(intensity);
            $.addImpulsiveForce(velocity);
        }
    }
    return { onCommentReceived, onPhysicsUpdate };
})($);

const DoughnutManager = (($) => {
    const REGEX = /(ドーナッツターン|どーなっつたーん)/;
    const INTERVAL = 5; // [s]
    let _active = false
    let _time = 0;
    const onCommentReceived = ($, message) => {
        if (REGEX.test(message)) {
            _active = true;
        }
    }
    const onPhysicsUpdate = ($, deltaTime) => {
        if (_active) {
            _time += deltaTime;
            if (_time > INTERVAL) {
                _active = false;
                _time = 0;
                return;
            }

            let itemRotation = $.getRotation();
            let torque = dirUpItem;
            const velocityTorque = torque.applyQuaternion(itemRotation);
            $.addImpulsiveTorque(velocityTorque);
            let intensity = 0.5;
            const dir = dirFrontItem.clone().multiplyScalar(intensity);
            // $.log("dir: " + dir);
            const velocity = dir.applyQuaternion(itemRotation);
            $.addImpulsiveForce(velocity);
        }
    }
    return { onCommentReceived, onPhysicsUpdate };
})($);

const DeathRoleManager = (($) => {
    const REGEX = /(デスロール|ですろーる)/;
    const INTERVAL = 0.5; // [s]
    const TRY_COUNT = 6;
    let _active = false
    let _counter = 0;
    let _time = 0;
    const onCommentReceived = ($, message) => {
        if (REGEX.test(message)) {
            _active = true;
        }
    }
    const onPhysicsUpdate = ($, deltaTime) => {
        if (_active) {
            _time += deltaTime;
            if (_time < INTERVAL) {
                return;
            }
            _time = 0;

            $.addImpulsiveForce(dirUpItem);

            let itemRotation = $.getRotation();
            let intensity = 2.0;
            let torque = dirFrontItem.clone().multiplyScalar(intensity); // X軸回転
            const velocity = torque.applyQuaternion(itemRotation);
            $.addImpulsiveTorque(velocity);

            if (_counter >= TRY_COUNT) {
                _counter = 0;
                _active = false;
            }
            _counter++;
        }
    }
    return { onCommentReceived, onPhysicsUpdate };
})($);

const LovingManager = (($) => {
    const REGEX = /(愛|あい|アイ)しているの(サイン|さいん)/;
    let hazardLampNode = $.subNode("HazardLamp");

    const INTERVAL = 0.5; // [s]
    const TRY_COUNT = 10;
    let _active = false
    let _counter = 0;
    let _time = 0;

    const onCommentReceived = ($, message) => {
        if (REGEX.test(message)) {
            _active = true;
        }
    }
    const onPhysicsUpdate = ($, deltaTime) => {
        if (_active) {
            _time += deltaTime;
            if (_time < INTERVAL) {
                return;
            }
            _time = 0;
            let currentActive = hazardLampNode.getEnabled();
            hazardLampNode.setEnabled(!currentActive);
            if (_counter >= TRY_COUNT) {
                _counter = 0;
                _active = false;
                hazardLampNode.setEnabled(false);
            }
            _counter++;
        }
    }
    return { onCommentReceived, onPhysicsUpdate };
})($);

const PumpingBrakeManager = (($) => {
    const REGEX = /(ポンピングブレーキ|ぽんぴんぐぶれーき)/;
    let hazardLampNode = $.subNode("BrakeLamp");

    const INTERVAL = 0.1; // [s]
    const TRY_COUNT = 6;
    let _active = false
    let _counter = 0;
    let _time = 0;

    const onCommentReceived = ($, message) => {
        if (REGEX.test(message)) {
            _active = true;
        }
    }
    const onPhysicsUpdate = ($, deltaTime) => {
        if (_active) {
            _time += deltaTime;
            if (_time < INTERVAL) {
                return;
            }
            _time = 0;

            let currentActive = hazardLampNode.getEnabled();
            hazardLampNode.setEnabled(!currentActive);
            if (_counter >= TRY_COUNT) {
                _counter = 0;
                _active = false;
                hazardLampNode.setEnabled(false);
            }
            _counter++;
        }
    }
    return { onCommentReceived, onPhysicsUpdate };
})($);

$.onCommentReceived((comments) => {
    // $.log("comments " + comments.map(c => c.body));
    const speedRegex = /(u|d|U|D|↑|↓|上|下)/;

    for (const comment of comments) {
        DangerousDrivingManager.onCommentReceived($, comment.body);
        SuperAccelerationManager.onCommentReceived($, comment.body);
        DoughnutManager.onCommentReceived($, comment.body);
        DeathRoleManager.onCommentReceived($, comment.body);
        LovingManager.onCommentReceived($, comment.body);
        PumpingBrakeManager.onCommentReceived($, comment.body);

        const matchSpeed = comment.body.match(speedRegex);
        if (matchSpeed) {
            const direction = matchSpeed[1];
            let speed = 0;
            if (["u", "U", "↑", "上"].includes(direction)) {
                speed += 1;
            } else if (["d", "D", "↓", "下"].includes(direction)) {
                speed += -1;
            }
            $.state.accel = true;
        }
    }
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
    DangerousDrivingManager.onPhysicsUpdate($, deltaTime);
    SuperAccelerationManager.onPhysicsUpdate($, deltaTime);
    DoughnutManager.onPhysicsUpdate($, deltaTime);
    DeathRoleManager.onPhysicsUpdate($, deltaTime);
    LovingManager.onPhysicsUpdate($, deltaTime);
    PumpingBrakeManager.onPhysicsUpdate($, deltaTime);
});
