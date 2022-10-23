const dgram = require("dgram");

const PORT = 8080;
const MULTICAST_PORT = 1900
const MULTICAST_ADDRESS = "239.255.255.250";

const server = dgram.createSocket("udp4");

const sendMessageMultcast = (msg) => {
  let message = Buffer.from(msg)
  server.send(message,0, message.length, MULTICAST_PORT, MULTICAST_ADDRESS)
}

server.on("error", (err) => {
  console.log('Error on server: ',err);
  server.close();
});

server.on("listening", () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.on("message", (msg) => {
  let message = String(msg)
  console.log(message);
  sendMessageMultcast(message)
});

server.bind(PORT, () => {
	let message = Buffer.from('SERVER:')
	setInterval(() => {
    server.send(message,0, message.length, MULTICAST_PORT, MULTICAST_ADDRESS)
	}, 1000);
});
