const dotenv = require("dotenv");
const dgram = require("dgram");

dotenv.config();

const SERVICE_PORT = 8080;
const MULTICAST_PORT = 1900;
const MULTICAST_ADDRESS = "239.255.255.250";
const socketMultcast = dgram.createSocket("udp4");

let discoveryServices = {
  SERVER: [],
  CLIENT: [],
};

const handleNewService = (service, address) => {
  const isValidService = Object.keys(discoveryServices).includes(service);

  if (isValidService) {
    const hasOnList = discoveryServices[service]?.includes(address);

    if (!hasOnList) {
      console.log(`Novo serviço de ${service} adicionado: ${address}`);
      discoveryServices[service]?.push(address) || console.log("Error:");
    }
  }
};

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
  socketMultcast.addMembership(MULTICAST_ADDRESS);
});

module.exports = {
  discoveryServices,
};
