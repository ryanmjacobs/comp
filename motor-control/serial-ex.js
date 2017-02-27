#!/usr/bin/env node

var Stream = require("stream");
var serialport = require("serialport");
var modem = "cu.usbmodem14231";

var ws = new Stream;
ws.writable = true;

ws.write = function(data) {
    serialPort.write(data[0]);
};

ws.end = function(buf) {
    console.log("bye");
};

var serialPort = new serialport("/dev/ttyUSB0", {
    baudrate: 9600,
    parser: serialport.parsers.readline("\n")
});

process.stdin.pipe(ws);
