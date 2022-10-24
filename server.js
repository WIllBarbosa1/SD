const {
  handleStart,
  handleSendAll,
  handleSendOne,
  discoveryServices,
} = require("./Middleware/index");

handleStart("SERVER", (type, msg) => {
  handleSendAll('CLIENT', msg) 
});
