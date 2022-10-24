const dotenv = require("dotenv");
const dgram = require("dgram");

dotenv.config();

const socketRecive = dgram.createSocket("udp4");

socketRecive.on("message", function (msg, { address, port }) {
  const [type, message] = String(msg).split(":");

  if (type === "SERVER") {
    console.log("Server");
    // handleServerKeepAlive(`${address}:${port}`);
  } else if (type === "CLIENT") {
    console.log("Client");
    // console.log('Ip: ', ip.address);
    // console.log('Address: ', address);
    // if (ip.address() !== address) {
    //   console.log("Nova mensagem: ", message);
    // }
  }
});

// module.exports = {
//   handleSendMessage,
// };
