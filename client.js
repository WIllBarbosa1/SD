const {
  handleStart,
  handleSendAll,
  handleSendOne,
  discoveryServices,
} = require("./Middleware/index");
const readline = require("readline");

handleStart("CLIENT", (a, b) => {
  console.log("Nova mensagem recebida: ", a);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", (msg) => {
  handleSendOne(msg, 'SERVER');
});