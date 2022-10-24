const dgram = require("dgram");

const KEEP_ALIVE_PORT = 8000;
const MULTICAST_PORT = 1900;
const MULTICAST_ADDRESS = "239.255.255.250";

const socketKeep = dgram.createSocket("udp4");

const handleKeepAlive = (serviceType) => {
  socketKeep.bind(KEEP_ALIVE_PORT, () => {
    let message = Buffer.from(serviceType);
    setInterval(() => {
      socketKeep.send(
        message,
        0,
        message.length,
        MULTICAST_PORT,
        MULTICAST_ADDRESS
      );
    }, 1000);
  });
};

module.exports = {
  handleKeepAlive,
};
