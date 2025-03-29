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

const AccelerationManager = (($) => {
    const UpRegex = /(u|U|↑|上)/;
    const DownRegex = /(d|D|↓|下)/;
    let _upActive = false
    let _downActive = false
    const onCommentReceived = ($, message) => {
        if (UpRegex.test(message)) {
            _upActive = true;
        }
        if (DownRegex.test(message)) {
            _downActive = true;
        }
    }
    const onPhysicsUpdate = ($, deltaTime) => {
        if (_upActive ^ _downActive) {
            let itemRotation = $.getRotation();
            const dir = _upActive ? dirFrontItem.clone() : dirFrontItem.clone().negate();
            let intensity = 4;
            const velocity = dir.applyQuaternion(itemRotation).multiplyScalar(intensity);
            $.addImpulsiveForce(velocity);

            _upActive = false;
            _downActive = false;
        }
    }
    return { onCommentReceived, onPhysicsUpdate };
})($);

const PopManager = (($) => {
    const Regex = /(ポップ|ぽっぷ)/;

    let _active = false
    const onCommentReceived = ($, message) => {
        if (Regex.test(message)) {
            _active = true;
        }
    }
    const onPhysicsUpdate = ($, deltaTime) => {
        if (_active) {
            _active = false;

            let itemRotation = $.getRotation();
            const dir = dirFrontItem.clone().add(dirUpItem.clone());
            const intensity = 4;
            const velocity = dir.applyQuaternion(itemRotation).multiplyScalar(intensity);
            // $.log("addImpulsiveForce: velocity: " + velocity);
            $.addImpulsiveForce(velocity);
        }
    }
    return { onCommentReceived, onPhysicsUpdate };
})($);

const RotateManager = (($) => {
    const Regex = /(回転|かいてん|カイテン|ローテーション)/;

    let _active = false
    const onCommentReceived = ($, message) => {
        if (Regex.test(message)) {
            _active = true;
        }
    }
    const onPhysicsUpdate = ($, deltaTime) => {
        if (_active) {
            _active = false;

            let itemRotation = $.getRotation();
            const intensityTorque = 4;
            const dirTorque = dirUpItem.clone().multiplyScalar(intensityTorque);
            const velTorque = dirTorque.applyQuaternion(itemRotation);
            $.addImpulsiveTorque(velTorque);

            const intensity = 3;
            const dir = dirUpItem.clone().multiplyScalar(intensity);
            $.addImpulsiveForce(dir);
        }
    }
    return { onCommentReceived, onPhysicsUpdate };
})($);

const LeftRightManager = (($) => {
    const LeftRegex = /(←|ヒダリ|左|ひだり)/;
    const RightRegex = /(→|ミギ|右|みぎ)/;

    let _leftActive = false
    let _rightActive = false
    const onCommentReceived = ($, message) => {
        if (LeftRegex.test(message)) {
            _leftActive = true;
        }
        if (RightRegex.test(message)) {
            _rightActive = true;
        }
    }
    const onPhysicsUpdate = ($, deltaTime) => {
        if (_leftActive ^ _rightActive) {
            let itemRotation = $.getRotation();
            const dir = _rightActive ? dirUpItem.clone() : dirUpItem.clone().negate();
            const intensityTorque = 4;
            const dirTorque = dir.clone().multiplyScalar(intensityTorque);
            const velTorque = dirTorque.applyQuaternion(itemRotation);
            $.addImpulsiveTorque(velTorque);
            _leftActive = false;
            _rightActive = false;
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
    for (const comment of comments) {
        AccelerationManager.onCommentReceived($, comment.body);
        DangerousDrivingManager.onCommentReceived($, comment.body);
        DeathRoleManager.onCommentReceived($, comment.body);
        DoughnutManager.onCommentReceived($, comment.body);
        LeftRightManager.onCommentReceived($, comment.body);
        LovingManager.onCommentReceived($, comment.body);
        PopManager.onCommentReceived($, comment.body);
        PumpingBrakeManager.onCommentReceived($, comment.body);
        RotateManager.onCommentReceived($, comment.body);
        SuperAccelerationManager.onCommentReceived($, comment.body);
    }
})

$.onPhysicsUpdate(deltaTime => {
    AccelerationManager.onPhysicsUpdate($, deltaTime);
    DangerousDrivingManager.onPhysicsUpdate($, deltaTime);
    DeathRoleManager.onPhysicsUpdate($, deltaTime);
    DoughnutManager.onPhysicsUpdate($, deltaTime);
    LeftRightManager.onPhysicsUpdate($, deltaTime);
    LovingManager.onPhysicsUpdate($, deltaTime);
    PopManager.onPhysicsUpdate($, deltaTime);
    PumpingBrakeManager.onPhysicsUpdate($, deltaTime);
    RotateManager.onPhysicsUpdate($, deltaTime);
    SuperAccelerationManager.onPhysicsUpdate($, deltaTime);
});

