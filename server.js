const {
  handleStart,
  handleSendAll,
  handleSendOne,
  discoveryServices,
} = require("./Middleware/index");

handleStart("SERVER", (type, msg) => {
  console.log('Mensagem recebida: ', msg);
  handleSendAll('CLIENT', msg) 
});
