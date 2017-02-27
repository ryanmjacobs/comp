let ws = new WebSocket("ws://" + location.hostname + ":9987");

ws.onmessage = function(msg) {
    let data = JSON.parse(msg.data);
    console.log(data);

    switch (data.type) {
        case "update-state":
            draw(data);
            break;
    }
};

ws.onopen = function() {
    ws.send('{"hello":"world"}');
};

function draw(state) {
    function set_btn(which, state) {
        let el = document.getElementById(which);
        el.classList.remove("on", ["off"]);
        el.classList.add(state ? "on" : "off");
    }

    for (let i = 0; i < 3; i++) {
        set_btn("motor-btn-" + (i+1), state.motors[i]);
    }

    set_btn("arrow-btn-left", !state.direction);
    set_btn("arrow-btn-right", state.direction);
    set_btn("engage-btn", state.engaged);
}

let notify_relay = function(which) {
    ws.send(JSON.stringify({
        type: "client-click",
        which: which
    }));
};

function setup_onclick(which, callback) {
    let el = document.getElementById(which);
    el.onclick = () => callback(which);
}

setup_onclick("motor-btn-1",     notify_relay);
setup_onclick("motor-btn-2",     notify_relay);
setup_onclick("motor-btn-3",     notify_relay);
setup_onclick("arrow-btn-left",  notify_relay);
setup_onclick("arrow-btn-right", notify_relay);
setup_onclick("engage-btn",      notify_relay);
