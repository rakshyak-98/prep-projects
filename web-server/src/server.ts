import * as net from "net";

function newConnection(socket: net.Socket) {
	socket.on("end", () => {
		socket.write("EOF.");
	});
	socket.on("data", (data) => {
		console.log("Received:", data.toString());
		if(data.includes("quit")){
			console.info("Closing.");
			socket.write("Closed.");
			socket.end(); // this is send FIN
		}
		socket.write("Echo: " + data.toString());
	});
	socket.on("error", (err) => {
		throw err;
	});
}

let server = net.createServer();
server.on("connection", newConnection);
server.listen({ host: "127.0.0.1", port: 3000 }, () => {
	console.log("Started listening");
});

