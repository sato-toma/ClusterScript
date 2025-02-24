

const initializeHandles = () => {
    const key = "<tub manager> initialize";
    return ($) => {
        let itemHandles = $.getItemsNear(new Vector3(), Infinity);
        for (let itemHandle of itemHandles) {
            const arg = {};
            arg.itemHandle = $.itemHandle;
            itemHandle.send(key, {});
        }
    }
};

const NodeManager = (($) => {
    const node_size = 1;
    const width = 5 - node_size * 0.5;
    const subNodePosition = $.subNode("Position");
    let _giftSender = [];
    const createPhaseManager = () => {
        let _time = 0;
        let _speed = 1;
        const period = 10;
        const trapezoidalWave = (t) => {
            if (t < 0.5) {
                return t * 4 - 1;
            } else {
                return 3 - t * 4;
            }
        };
        const UpdateTime = ($, deltaTime) => {
            _time += deltaTime * _speed;
            if (_time > period) {
                _time = 0;
            }
        }
        const GetPhase = ($) => {
            let t = _time % period / period;
            return trapezoidalWave(t);
        }
        return { UpdateTime, GetPhase };
    };
    const createTubManager = (() => {
        const _tubMarkers = [];
        const addMarker = ($, marker) => {
            // $.log(`addMarker`);
            if (marker) {
                _tubMarkers.push(marker);
            }
        };
        const sendMessageMarker = ($, number, key, message) => {
            // $.log("sendMessageMarker");
            if (_tubMarkers.length > 0) {
                let index = number % _tubMarkers.length;
                // $.log("_tubMarkers.length:" + _tubMarkers.length);
                _tubMarkers[index].send(key, message);
            }
        };
        return {
            addMarker, sendMessageMarker
        };
    });
    const phaseManager = createPhaseManager();
    const tubManager = createTubManager();

    const Update = ($, deltaTime) => {
        phaseManager.UpdateTime($, deltaTime);

        let position = subNodePosition.getPosition();
        position.z = phaseManager.GetPhase($) * width;
        subNodePosition.setPosition(position);
        // インターバルをすぎたら、_giftSenderの先頭要素を取得してphaseManagersの
        {
            let time = $.state._time ?? 0;
            time += deltaTime;
            const INTERVAL = 2;
            if (time > INTERVAL) {
                time = 0;
                if (_giftSender.length > 0) {
                    let giftSender = _giftSender.shift();
                    // $.log("Update giftSender:" + giftSender);
                    const { number, displayName, position } = giftSender;
                    // $.log("Update displayName:" + displayName);
                    // $.log("Update displayName:" + displayName);
                    // $.log("Update position:" + position);
                    // $.log("Update number:" + number);
                    const key = "<tub manager> Set Position";
                    tubManager.sendMessageMarker($, number, key, { position: position, displayName: displayName });
                }
            }
            $.state._time = time;

        }
    }

    PushGiftInfo = ($, displayName) => {
        let number = $.state._number ?? 0;
        let position = subNodePosition.getPosition();
        // $.log("PushGiftInfo position:" + position);
        _giftSender.push({ number, displayName, position });
        $.state._number = number + 1;
    }
    AddTub = ($, tub) => {
        tubManager.addMarker($, tub);
    }
    return { Update, PushGiftInfo, AddTub };
})($);

$.onUpdate(deltaTime => {
    NodeManager.Update($, deltaTime);
});

$.onGiftSent((gifts) => {
    // $.log("onGiftSent called");
    for (let i = 0; i < gifts.length; i++) {
        let displayName = gifts[i].senderDisplayName;
        NodeManager.PushGiftInfo($, displayName);
    }
});


const handleInitializeHandles = initializeHandles();
$.onStart(() => {
    handleInitializeHandles($);
});

$.onReceive((messageType, arg, sender) => {
    // $.log(`<manager> onReceive: ${arg}`);
    switch (messageType) {
        case "<tub marker> receive initialize":
            // $.log(`<tub marker> receive initialize: ${sender}`);
            NodeManager.AddTub($, sender);
            break;
    }
}, { item: true, player: false });


