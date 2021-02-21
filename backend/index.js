// Include Nodejs' net module.
const { Server } = require('http');
const Net = require('net');
// The port on which the server is listening.
const port = 8080;
const util = require("util");
// Use net.createServer() in your code. This is just for illustration purpose.
// Create a new TCP server.
const server = new Net.Server();
// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.
server.listen(port, function() {
    console.log(`Server listening for connection requests on socket localhost:${port}`);
});
const messages = [];
const connections = [];
// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.

function count(a,i){
    var result = 0;
    for(var o in a)
     if(a[o] == i)
      result++;
    return result;
   }
server.on('connection', async function (socket) {
    socket.user = {
        username: "",
        ip: socket.address(),
        id: connections.length
    }
    
    connections.push(socket);

    const sendAll = o=>connections.forEach(e=>{
        if(e.user.id==!socket.user.id)e.write(JSON.stringify(o))
    });

    socket.on('data', function(data) {
        socket.write("Testing aaaaaaaaaaaaaaaa Fortnite epic YAH")
        const client = connections[socket.user.id];
        let message;
        console.log(data.toString())
        try {
            message = JSON.parse(data);
        } catch(e) {
            socket.destroy()
            return;
        }
        if(message.op == "connect") {
            connections[socket.user.id].user.username = message.username;
            
            if(connections.map(e=>e.user.username==message.username).filter(Boolean).length > 1) {
                socket.write(JSON.stringify({op: "message", message: "Name is duplicated. Pick a new one.", username: "System"}))
                socket.destroy();
                return;
            }

            sendAll({op: "connect", username: message.username})

            console.log(`${message.username} has connected with ID ${client.user.id}.`);
        }

        if(message.op == "message") {
            messages.push({u:client.user.username,m:message.message})
            sendAll({op: "message", username: client.user.username, message: message.message})
        }
    });

    socket.on('end', function() {
        console.log('Closing connection with the client');
        connections.splice(socket.user.id, 1)
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
        connections.splice(socket.user.id, 1)
    });
});