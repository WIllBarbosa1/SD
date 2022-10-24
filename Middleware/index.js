const dotenv = require("dotenv");
const dgram = require("dgram");
const { send } = require("process");

dotenv.config();

const PORT = 8080;
const SERVICE_PORT = 8080;
const MULTICAST_PORT = 1900;
const MULTICAST_ADDRESS = "239.255.255.250";

const socketMultcast = dgram.createSocket("udp4");
const socketComunication = dgram.createSocket("udp4");

let discoveryServices = {
  SERVER: [],
  CLIENT: [],
};

function handleStart(serviceType, callbackReciver) {
  //Multcast
  socketMultcast.on("listening", () => {
    const { address, port } = socketMultcast.address();
    console.log("UDP Client listening on " + address + ":" + port);
  });

  socketMultcast.on("message", function (msg, { address }) {
    const service = String(msg);
    const newAddress = `${address}:${SERVICE_PORT}`;

    handleNewService(service, newAddress);
  });

  socketMultcast.bind(MULTICAST_PORT, () => {
    let message = Buffer.from(serviceType);

    console.log("Multcast Socket on");

    socketMultcast.addMembership(MULTICAST_ADDRESS);

    setInterval(() => {
      socketMultcast.send(
        message,
        0,
        message.length,
        MULTICAST_PORT,
        MULTICAST_ADDRESS
      );
    }, 1000);
  });

  //comunicação
  socketComunication.on("message", function (msg, { address, port }) {
    const [type, message] = String(msg).split(":");
    callbackReciver(type, message);
  });

  socketComunication.bind(PORT, () => {
    console.log("Socket on");
  });
}

function handleNewService(service, address) {
  const isValidService = Object.keys(discoveryServices).includes(service);

  if (isValidService) {
    const hasOnList = discoveryServices[service]?.includes(address);

    if (!hasOnList) {
      console.log(`Novo serviço de ${service} adicionado: ${address}`);
      discoveryServices[service]?.push(address) || console.log("Error:");
    }
  }
}

function handleSendOne(msg, type) {
  let message = Buffer.from(`${type}:${msg}`);
  let [sendDestiny] = discoveryServices[type];
  let [adress, port] = String(sendDestiny).split(":");

  socketComunication.send(message, 0, message.length, port, adress);
}

function handleSendAll(type, msg) {
  let message = Buffer.from(`${type}:${msg}`);
  let sendList = discoveryServices[type];

  sendList.forEach( (destiny, index) => {
    let [adress, port] = String(destiny).split(":");
    socketComunication.send(message, 0, message.length, port, adress);
  });
  
}

module.exports = {
  handleStart,
  handleSendAll,
  handleSendOne,
};
