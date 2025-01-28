const RotateManager = ((() => {
    const Rotate = ($, deltaTime) => {
        const ANGULAR_VELOCITY = 45;

        const currentRotation = $.getRotation();
        const degreeDifference = ANGULAR_VELOCITY * deltaTime;
        const rotationDifference = new Quaternion().setFromEulerAngles(new Vector3(0, degreeDifference, 0));
        const newRotation = rotationDifference.clone().multiply(currentRotation);

        $.setRotation(newRotation);
    };
    return { Rotate };
})());

$.onUpdate(deltaTime => {
    PositionManager.Rotate($, deltaTime);
});