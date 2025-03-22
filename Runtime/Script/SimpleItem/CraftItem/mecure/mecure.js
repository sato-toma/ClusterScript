const subNodeText = $.subNode("Text");
$.onInteract((player) => {
    // $.log(`onInteract`);
    let displayName = player.userDisplayName;
    let formattedDisplayName = displayName.split('').join('\n');
    let formattedText = `${formattedDisplayName}`;
    subNodeText.setText(formattedText);
    $.log(formattedText);
});