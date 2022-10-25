const {
  handleStart,
  handleSendAll,
  handleSendOne,
  discoveryServices,
} = require("./Middleware/index");

handleStart("SERVER", (type, msg, despatcher) => {
  console.log(`Nova mensagem recebida de ${despatcher}:  ${msg}`);

  handleSendAll('CLIENT', msg, despatcher) 
});
