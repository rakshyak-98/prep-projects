import * as net from "net";

type TCPConn = {
	socket: net.Socket;
	err: null | Error;
	ended: boolean;
	reader: null | {
		resolve: (value: Buffer) => void;
		rejects: (reason: Error) => void;
	};
};
type TCPListener = { socket: net.Socket };

function soInit(socket: net.Socket): TCPConn {
	const conn: TCPConn = {
		socket: socket,
		err: null,
		ended: false,
		reader: null,
	};
	socket.on("data", (data) => {
		console.log(conn.reader); // check if we have soRead run once
		conn.socket.pause();
		conn.reader?.resolve(data);
		conn.reader = null;
	});

	socket.on("end", () => {
		conn.ended = true;
		if (conn.reader) {
			conn.reader.resolve(Buffer.from(""));
			conn.reader = null;
		}
	});

	socket.on("error", (err) => {
		conn.err = err;
		if (conn.reader) {
			conn.reader?.rejects(err);
			conn.reader = null;
		}
	});
	return conn;
}

function soRead(conn: TCPConn): Promise<Buffer> {
	console.assert(!conn.reader); // check no concurrent call
	return new Promise((resolve, rejects) => {
		if (conn.err) {
			rejects(conn.err);
		}
		if (conn.ended) {
			resolve(Buffer.from("")); // EOF
		}
		conn.reader = { resolve, rejects };
		conn.socket.resume();
	});
}

function soWrite(conn: TCPConn, data: Buffer): Promise<void> {
	console.assert(data.length > 0);
	return new Promise((resolve, rejects) => {
		if (conn.err) {
			rejects(conn.err);
		}
		conn.socket.write(data, (err?: Error) => {
			if (err) {
				rejects(err);
			} else {
				resolve();
			}
		});
	});
}

async function serverClient(socket: net.Socket): Promise<void> {
	const conn: TCPConn = soInit(socket);
	while (true) {
		const data = await soRead(conn);
		if (data.length === 0) {
			console.log("end connection");
			break;
		}
		console.log("data: ", data);
		await soWrite(conn, data);
	}
}

async function newConn(socket: net.Socket) {
	console.log("New connection: ", socket.remoteAddress, socket.remotePort);
	try {
		await serverClient(socket);
	} catch (exc) {
		console.log("Exception: ", exc);
	} finally {
		socket.destroy();
	}
}

function soListener(port: number, host: string): TCPListener {
	const server = net.createServer();
	const socket = net.connect({ host: host, port: port });
	server.on("connection", newConn);
	server.listen(port, host, () => {
		console.log("Started listening on", `${host}:${port}`);
	});
	return { socket };
}

function soAccept(listener: TCPListener): Promise<TCPConn> {
	return new Promise((resolve, rejects) => {
		try {
			resolve(soInit(listener.socket));
		} catch (exc) {
			rejects(exc);
		} finally {
			listener.socket.destroy();
		}
	});
}

const listener = soListener(3000, "localhost");
soAccept(listener);

