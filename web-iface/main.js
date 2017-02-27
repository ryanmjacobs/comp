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
        motors: [true, false, true],
        direction: true,
        engage: false
    };

    function set_btn(which, state) {
        let el = document.getElementById(which);
        el.classList.remove(["on", "off"]);
        el.classList.add(state ? "on" : "off");
    }

    for (let i = 0; i < 3; i++) {
        set_btn("motor-btn-" + (i+1), state.motors[i]);
    }

    set_btn("arrow-btn-left", !state.direction);
    set_btn("arrow-btn-right", state.direction);
    set_btn("engage-btn", state.engage);
}

draw();
