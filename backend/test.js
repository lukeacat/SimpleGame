var net = require('net');
const { stringify } = require('querystring');
const readline = require('readline');
var client = new net.Socket();
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
const json=b=>JSON.stringify(b)

client.connect(8080, '127.0.0.1', function() {
	console.log('Connected');
    
    client.write(json({op: "connect", username: process.argv[2]}))
});


rl.on('line', function(line){
    client.write(json({op: "message", message: line}))
})

client.on('data', function(data) {
	const message = JSON.parse(data);

    if(message.op == "connect") {
        console.log(`${message.username} has connected`)
    }
    if(message.op == "message") {
        //username: client.user.username, message: message.message
        console.log(`${message.username}: ${message.message}`)
    }
});

client.on('close', function() {
	console.log('Connection closed');
});