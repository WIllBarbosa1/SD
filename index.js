const readline = require("readline");
const {handleSendMessage}  = require("./client.js");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', (msg) => {
    handleSendMessage(msg)
});