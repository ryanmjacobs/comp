#!/usr/bin/env node

let WebSocket = require("ws");
let ws = new WebSocket("ws://localhost:9987");

let STATE = {
    motors: [false, false, false],
    direction: false,
    engaged: false
};

ws.onmessage = function(msg) {
    let data = JSON.parse(msg.data);
    console.log(data);

    switch (data.type) {
        case "client-click":
            switch (data.which) {
                case "motor-btn-1":
                    STATE.motors[0] = !STATE.motors[0];
                    break;

                case "motor-btn-2":
                    STATE.motors[1] = !STATE.motors[1];
                    break;

                case "motor-btn-3":
                    STATE.motors[2] = !STATE.motors[2];
                    break;

                case "arrow-btn-left":
                    STATE.direction = false;
                    break;

                case "arrow-btn-right":
                    STATE.direction = true;
                    break;

                case "engage-btn":
                    STATE.engaged = !STATE.engaged;
                    break;
            }

        case "hello":
            broadcast_state(STATE);
            break;
    }
};

function broadcast_state(state) {
    let msg = Object.assign({type: "update-state"}, state);
    ws.send(JSON.stringify(msg));
}
