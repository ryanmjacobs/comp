#!/usr/bin/env node

let WebSocket = require("ws");
let ws = new WebSocket("ws://localhost:9987");

// setup serial port
var SerialPort = require("serialport");
var port = new SerialPort("/dev/ttyUSB0", {baudRate: 115200});
port.is_open = false;
port.on("data",  d => console.log("serial_port  data: ", d.toString("utf-8").trim()));
port.on("error", e => console.log("serial_port error: ", e.message));
port.on("open", function() {
    port.is_open = true;
    console.log("serial_port opened...");
});

// init state
let STATE = {
    motors: [0, 0, 0],
    direction: 0,
    engaged: 0
};

ws.onmessage = function(msg) {
    let data = JSON.parse(msg.data);
    console.log(data);

    switch (data.type) {
        case "client-click":
            switch (data.which) {
                case "motor-btn-1":
                    STATE.motors[0] = neg(STATE.motors[0]);
                    break;

                case "motor-btn-2":
                    STATE.motors[1] = neg(STATE.motors[1]);
                    break;

                case "motor-btn-3":
                    STATE.motors[2] = neg(STATE.motors[2]);
                    break;

                case "arrow-btn-left":
                    STATE.direction = 0;
                    break;

                case "arrow-btn-right":
                    STATE.direction = 1;
                    break;

                case "engage-btn":
                    STATE.engaged = neg(STATE.engaged);
                    break;
            }
            serial_write_state(STATE);

        case "hello":
            broadcast_state(STATE);
            break;
    }
};

function broadcast_state(state) {
    let msg = Object.assign({type: "update-state"}, state);
    ws.send(JSON.stringify(msg));
}

function neg(arg) {
    return arg ? 0 : 1;
}

function serial_write_state(state) {
    let buf = new Buffer(5);

    buf[0] = state.motors[0];
    buf[1] = state.motors[1];
    buf[2] = state.motors[2];
    buf[3] = state.direction;
    buf[4] = state.engaged;

    if (port.is_open)
        port.write(buf);
}
