const getMoveSpeedRate = () => {
    return Math.random() * 1.0 + 0.5; // 0.5~1.5の範囲でランダムに設定
};
const calculateVelocity = (playerPosition, centerPosition) => {
    const distanceToCenter = playerPosition.sub(centerPosition).length();
    let baseVelocity = 1 / (distanceToCenter + 1); // 中心に近いほど大きな速度
    baseVelocity += Math.random() * 0.1; // ランダム性を追加

    return baseVelocity;
};

const adjustVelocityForName = (playerName, velocity) => {
    if (playerName.includes('☆') || playerName.includes('!')) {
        velocity *= 1.2; // 特定の文字が含まれている場合、速度を増加
    }
    if (playerName.includes('(') || playerName.includes(')') || playerName.includes('「') || playerName.includes('」')) {
        velocity *= 0.8; // 特定の文字が含まれている場合、速度を減少
    }
    return velocity;
};


const handlePlayerVelocity = (player, centerPosition) => {
    const playerPosition = player.getPosition();
    let velocity = calculateVelocity(playerPosition, centerPosition);
    velocity = adjustVelocityForName(player.userDisplayName, velocity);

    // player.addVelocity(new Vector3(velocity, 0, velocity)); // X方向に速度を追加 // beta @ CCK 2.30.1
    player.setMoveSpeedRate(getMoveSpeedRate());
};

$.onInteract(() => {
    // $.log(`onInteract`);
    const position = $.getPosition();
    const radius = 5;
    let players = $.getPlayersNear(position, radius);
    for (let player of players) {
        handlePlayerVelocity(player, position);
    }
});

