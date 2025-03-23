const node0 = $.subNode("Node0");
const node1 = $.subNode("Node1");
$.onStart = () => {
    $.state.toggleMode = true;
}
$.onUse((isDown, player) => {
    // $.log(`colorIndex=${colorIndex}`);
    if (!isDown) { return; }
    if ($.getGrabbingPlayer() === null) { return; }
    let toggleMode = $.state.toggleMode;
    toggleMode = !toggleMode;
    $.state.toggleMode = toggleMode ;
;
    node0.setEnabled(toggleMode);
    node1.setEnabled(!toggleMode);
});



