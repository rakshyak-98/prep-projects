import * as net from "net";

function soListener(port: number, host: string){
	const server = net.createServer();
	const listener = server.listen(port, host);
}
