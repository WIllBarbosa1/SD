const dgram = require('dgram');
const ip = require("ip");

const PORT = 1900;
const client = dgram.createSocket('udp4');

const MULTICAST_ADDRESS = "239.255.255.250";

let servers = []

const handleServerKeepAlive = (server) => {
    const hasOnList = servers.includes(server)
    
    if (!hasOnList) {
        console.log(`Novo server adicionado: ${server}`);
        servers.push(server)
    }
}

const handleSendMessage = (msg) => {
    let message = Buffer.from(`MESSAGE:${msg}`)
    let [adress, port] = String(servers[0]).split(':')
    // console.log('Adress: ', adress);
    // console.log('Port: ', port);
    client.send(message,0, message.length, port, adress)
}

client.on('listening',  () => {
    const {address, port} = client.address();
    console.log('UDP Client listening on ' + address + ":" + port);
});

client.on('message', function (msg, {address, port}) {

    const [action, message] = String(msg).split(':')

    if (action === 'SERVER') {
        handleServerKeepAlive(`${address}:${port}`)
    } else if (action === 'MESSAGE') {
        // console.log('Ip: ', ip.address);
        // console.log('Address: ', address);
        if (ip.address() !== address) {
            console.log('Nova mensagem: ', message);
        }
    }

});

client.bind(PORT, ()=>{
    client.addMembership(MULTICAST_ADDRESS);
});

module.exports = {
    handleSendMessage
}