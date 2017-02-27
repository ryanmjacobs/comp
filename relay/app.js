#!/usr/bin/env node

const PORT = 9987;

let WebSocket = require("ws");
let wss = new WebSocket.Server({ port: PORT });

wss.broadcast = function(data) {
    console.log(data);

    wss.clients.forEach(function(client) {
        if (client.readyState === WebSocket.OPEN)
            client.send(data);
    });
};

wss.on("connection", function(ws) {
    ws.on("message", data => wss.broadcast(data));
});

console.log("listening on ws://localhost:" + PORT);
