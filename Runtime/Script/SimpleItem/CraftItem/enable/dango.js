const subNodes = [
    $.subNode("Sphere0"),
    $.subNode("Sphere1"),
    $.subNode("Sphere2"),
]
const subNodesSize = subNodes.length;
let nodeIndex = 0;
let toggleMode = true;
$.onUse((isDown, player) => {
    // $.log(`colorIndex=${colorIndex}`);
    if (!isDown) { return; }
    if ($.getGrabbingPlayer() === null) { return; }

    if (toggleMode) {
        const node = subNodes[nodeIndex];
        let enabled = node.getEnabled();
        node.setEnabled(!enabled);

        nodeIndex = (nodeIndex + 1) % subNodesSize; // 0 -> 1 -> 2 ...
        if (nodeIndex === 0) {
            toggleMode = false;
        }
    } else {
        subNodes.forEach(n => n.setEnabled(true));
        toggleMode = true;
    }
});



