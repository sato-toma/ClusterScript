const subNodes = [
    $.subNode("Sphere0"),
    $.subNode("Sphere1"),
    $.subNode("Sphere2"),
]
const subNodesSize = subNodes.length;
let nodeIndex = 0;
$.onUse((isDown, player) => {
    // $.log(`colorIndex=${colorIndex}`);
    if (!isDown) { return; }
    if ($.getGrabbingPlayer() === null) { return; }

    const node = subNodes[nodeIndex];
    let enabled = node.getEnabled();
    node.setEnabled(!enabled);

    nodeIndex = (nodeIndex + 1) % subNodesSize; // 0 -> 1 -> 2 ...
});



