
const materialHandle = $.material("material0");

let colorIndex = 0;
const rainbowColors = [
    [1, 0, 0],     // Red
    [1, 0.5, 0],   // Orange
    [1, 1, 0],     // Yellow
    [0, 1, 0],     // Green
    [0, 1, 1],     // Cyan
    [0, 0, 1],     // Blue
    [1, 0, 1]      // Magenta
];

$.onUse((isDown, player) => {
    // $.log(`colorIndex=${colorIndex}`);
    if (!isDown) { return; }
    if ($.getGrabbingPlayer() === null) { return; }

    const [R, G, B] = rainbowColors[colorIndex];
    // $.log(`{R,G,B}=${R},${G},${B}`);
    materialHandle.setEmissionColor(R, G, B, 1);

    colorIndex = (colorIndex + 1) % rainbowColors.length; // get next index
});