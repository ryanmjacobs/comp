let ws = new WebSocket("ws://" + location.hostname + ":9987");

ws.onmessage = function(msg) {
    let data = JSON.parse(msg.data);

    if (data.type == "update-state") {
        draw(data.state);
    }
};

ws.onopen = function() {
    ws.send('{"hello":"world"}');
};

function draw(state) {
    state = {
        motors: [false, false, true],
        direction: true,
        engage: true
    };

    for (let i = 0; i < 3; i++) {
        let el = document.getElementById("motor-btn-" + (i+1));
        el.className = state.motors[i] ? "btn on" : "btn off";
    }
}

draw();
