const {
  handleStart,
  handleSendAll,
  handleSendOne,
  discoveryServices,
} = require("./Middleware/index");

handleStart("CLIENT", (a, b) => {
  console.log("Nova mensagem recebida");
});
