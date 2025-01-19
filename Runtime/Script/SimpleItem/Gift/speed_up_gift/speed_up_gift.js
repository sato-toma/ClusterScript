$.onGiftSent((gifts) => {
    // $.log("onGiftSent called");
    for (let i = 0; i < gifts.length; i++) {
        let player = gifts[i].sender;
        let price = gifts[i].price;
        // $.log("push player:" + player);
        if (player != null) {
            // $.log("push player.Userid:" + player.userId);
            player.setMoveSpeedRate(price);
        }
    }
});

