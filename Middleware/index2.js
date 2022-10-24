const { handleKeepAlive } = require("./KeepAlive/index.js");
const { handleSendMessage } = require("./Connections/index.js");
const { discoveryServices } = require("./Discovery/index.js");

const readline = require("readline");

handleKeepAlive("CLIENT");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", (msg) => {
  console.log("Discovery: ", discoveryServices);
  handleSendMessage(msg, "CLIENT", discoveryServices["CLIENT"][0]);
});
