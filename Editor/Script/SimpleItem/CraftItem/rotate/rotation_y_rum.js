const Rotate = () => {
    const maxPeriod = 45;
    const minPeriod = 15;
    const ANGULAR_VELOCITY = Math.floor(Math.random() * maxPeriod) + minPeriod;
    return ($, deltaTime) => {
        const currentRotation = $.getRotation();
        const degreeDifference = ANGULAR_VELOCITY * deltaTime;
        const rotationDifference = new Quaternion().setFromEulerAngles(new Vector3(0, degreeDifference, 0));
        const newRotation = rotationDifference.clone().multiply(currentRotation);

        $.setRotation(newRotation);
    }
};

const handleRotate = Rotate();
$.onUpdate(deltaTime => {
    handleRotate($, deltaTime);
});