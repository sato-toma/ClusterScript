const Rotate = () => {
    const ANGULAR_VELOCITY = 30;
    return ($, deltaTime) => {
        const currentRotation = $.getRotation();
        const degreeDifference = ANGULAR_VELOCITY * deltaTime;
        const rotationDifference = new Quaternion().setFromEulerAngles(new Vector3(0, 0, degreeDifference));
        const newRotation = rotationDifference.clone().multiply(currentRotation);

        $.setRotation(newRotation);
    }
};

const handleRotate = Rotate();
$.onUpdate(deltaTime => {
    handleRotate($, deltaTime);
});