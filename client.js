const {
  handleStart,
  handleSendAll,
  handleSendOne,
  discoveryServices,
} = require("./Middleware/index");
const readline = require("readline");

handleStart("CLIENT", (type, msg, despatcher) => {
  console.log(`Nova mensagem recebida de ${despatcher}:  ${msg}`);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", (msg) => {
  handleSendOne(msg, 'SERVER');
});