

const node = $.subNode("Node");

const PositionManager = ((() => {
    let _time = 0;
    const INTERVAL = 1; // [s]
    const WIDTH = 2; // [m]
    const POSITIONS = [0, WIDTH, -WIDTH];
    let _currentIndex = 0;
    const GetPosition = ($, deltaTime) => {
        _time += deltaTime;
        if (_time < INTERVAL) {
            return;
        }
        _time = 0;

        _currentIndex = Math.floor(Math.random() * POSITIONS.length);
        const pos = new Vector3(0, 0, POSITIONS[_currentIndex]);
        return pos;
    };

    return { GetPosition };
})());


$.onUpdate(deltaTime => {
    let pos = PositionManager.GetPosition($, deltaTime);
    node.setPosition(pos);
});
