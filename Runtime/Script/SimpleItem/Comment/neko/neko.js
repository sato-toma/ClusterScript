const transferDestination = $.subNode("TransferDestination");

$.onStart(() => {
    $.state.destination = transferDestination.getGlobalPosition();
});

$.onCommentReceived((comments) => {
    $.log("comments " + comments.map(c => c.body));
    const allowedChars = "にやゃぃんー～";
    let destination = $.state.destination;

    for (const comment of comments) {
        if (comment.via !== "cluster") {
            // Youtube comments
            continue;
        }
        const containsAllowedChars = [...comment.body].every(char => allowedChars.includes(char));
        if (containsAllowedChars) { continue; }

        let playerHandle = comment.sender;
        if (playerHandle == null) {
            // ghost or group viewing users
            continue;
        }
        playerHandle.setPosition(destination);
    }
})

