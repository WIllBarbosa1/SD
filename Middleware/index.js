const dotenv = require("dotenv");
const dgram = require("dgram");
const { send } = require("process");

dotenv.config();

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

    handleKeepAlive(service, newAddress);
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

  socketComunication.bind(SERVICE_PORT, () => {
    console.log("Socket on");
  });
}

function handleKeepAlive(service, address) {
  const isValidService = Object.keys(discoveryServices).includes(service);

  if (isValidService) {
    const addressList = discoveryServices[service].map(({address})=>address)
    const hasOnList = addressList?.includes(address);

    if (hasOnList) {
      discoveryServices[service].find((element, index)=>{
        if (element.address === address) {
          discoveryServices[service][index].keepAliveTime = new Date()
        }
      })
    }else{
      console.log(`Novo serviço de ${service} adicionado: ${address}`);
      discoveryServices[service]?.push({address,keepAliveTime: new Date()}) || console.log("Error:");
    }
  }
}

function handleClearKeepAlive(type) {
  let sendList = discoveryServices[type];

  console.log('SendList: ', sendList);

  sendList.forEach( (destiny, index) => {
    let { keepAliveTime } = destiny
    if (new Date().getTime() - new Date(keepAliveTime).getTime()  > 1000) {
      console.log('Lista limpa: ', destiny.address);
      discoveryServices[type].splice(index, 1)
    }
  });
}

function handleSendOne(msg, type) {
  let message = Buffer.from(`${type}:${msg}`);

  handleClearKeepAlive(type)

  if (discoveryServices[type].length === 0) {
    console.log(`Não existem serviços de ${type} disponiveis, por favor tente novamente em alguns instantes.`);
  } else {
    let [sendDestiny] = discoveryServices[type];
    let [adress, port] = String(sendDestiny.address).split(":");

    socketComunication.send(message, 0, message.length, port, adress);
  }
  
}

function handleSendAll(type, msg) {
  let message = Buffer.from(`${type}:${msg}`);

  handleClearKeepAlive(type)
  
  if (discoveryServices[type].length === 0) {
    console.log(`Não existem serviços de ${type} disponiveis, por favor tente novamente em alguns instantes.`);
  }else{
    let sendList = discoveryServices[type];

    sendList.forEach( (destiny, index) => {
      let {adress} = destiny.address
      let [sendAdress, port] = String(adress).split(":");
      socketComunication.send(message, 0, message.length, port, sendAdress);
    });
  }
  
}

module.exports = {
  handleStart,
  handleSendAll,
  handleSendOne,
};
