const dotenv = require("dotenv");
const dgram = require("dgram");

dotenv.config();

const PORT = 8080;
const socketComunication = dgram.createSocket("udp4");

const handleSendMessage = (msg, type, destinyAddress) => {
  let message = Buffer.from(`${type}:${msg}`);
  let [adress, port] = String(destinyAddress).split(":");
  socketComunication.send(message, 0, message.length, port, adress);
};

socketComunication.on("message", function (msg, { address, port }) {
  const [type, message] = String(msg).split(":");

  //sempre vai ser mandado para os servidores sejam de server ou de client so muda a lista de onde vai sair os endereços
  if (type === "SERVER") {
    //se for um client que estiver mandando a mensagem replicar nos servidores
    console.log("Server: ", message);
  } else if (type === "CLIENT") {
    //se for um server que estiver mandando a mensagem replicar nos clients
    console.log("Client: ", message);
  }
});

socketComunication.bind(PORT, () => {
  console.log("Socket on");
});

module.exports = {
  handleSendMessage,
};
