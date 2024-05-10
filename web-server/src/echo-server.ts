import * as net from "net";

type DynBuf = {
	data: Buffer;
	length: number;
};

type TCPConn = {
	socket: net.Socket;
	err: null | Error;
	ended: boolean;
	reader: null | {
		resolve: (value: Buffer) => void;
		reject: (value: Error | Buffer) => void;
	};
};

type TCPListener = {
	server: net.Server;
	address: string | net.AddressInfo | null;
};

/**
 * Register callbacks for socket event listener `data` `end` and `error`
 * */
function soInit(socket: net.Socket) {
	const conn: TCPConn = {
		err: null,
		ended: false,
		socket: socket,
		reader: null,
	};
	socket.on("data", (data: Buffer) => {
		conn.socket.pause();
		conn.reader!.resolve(data);
		conn.reader = null;
	});
	socket.on("end", () => {
		conn.ended = true;
		if (conn.reader) {
			conn.reader.resolve(Buffer.from("")); // 0 length data buffer indicate connection closed.
			conn.reader = null;
		}
	});
	socket.on("error", (err: Error) => {
		conn.err = err;
		if (conn.reader) {
			conn.reader.reject(err);
			conn.reader = null;
		}
	});
	return conn;
}

function soRead(conn: TCPConn): Promise<Buffer> {
	console.assert(!conn.reader);
	return new Promise((resolve, reject) => {
		if (conn.err) {
			reject(conn.err);
		}
		if (conn.ended) {
			resolve(Buffer.from("")); // EOF
			return;
		}
		conn.reader = { resolve, reject };
		conn.socket.resume();
	});
}

function soWrite(conn: TCPConn, data: Buffer) {
	console.assert(!conn.reader);
	return new Promise<void>((resolve, reject) => {
		if (conn.err) {
			reject(conn.err);
			return;
		}
		conn.socket.write(data, (err?: Error) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

async function newConn(socket: net.Socket) {
	console.log("new Connection: ", socket.remoteAddress, socket.remotePort);
	try {
		await serverClient(socket);
	} catch (exc) {
		console.log("exception:", exc);
	} finally {
		socket.destroy();
	}
}

// echo server
async function serverClient(socket: net.Socket) {
	const conn: TCPConn = soInit(socket);
	const buf: DynBuf = { data: Buffer.alloc(0), length: 0 };
	while (true) {
		const msg: null | Buffer = cutMessage(buf);
		if (!msg) {
			const data = await soRead(conn);
			bufPush(buf, data);
			if (data.length === 0) {
				console.log("end connection");
				return;
			}
			continue;
		}

		if (msg.equals(Buffer.from("quit\n"))) {
			await soWrite(conn, Buffer.from("Byte.\n"));
			socket.destroy();
		}
	}
}

function cutMessage(buf: DynBuf): null | Buffer {
	const idx = buf.data.subarray(0, buf.length).indexOf("\n");
	if (idx < 0) {
		return null;
	}
	const msg = Buffer.from(buf.data.subarray(0, idx + 1));
	bufPop(buf, idx + 1);
	return msg;
}

function bufPop(buf: DynBuf, len: number): void {
	buf.data.copyWithin(0, len, buf.length);
	buf.length -= len;
}

function soListen(port: number, host: string): TCPListener {
	const server = net.createServer({ allowHalfOpen: true, pauseOnConnect: true });
	server.listen({ port, host }, () => {
		console.log(`Server is listening of ${host}:${port}}`);
	});
	return { server, address: server.address() };
}

function soAccept(listener: TCPListener): Promise<TCPConn> {
	return new Promise((resolve, reject) => {
		listener.server.on("connection", (socket) => {
			const conn: TCPConn = { socket: socket, err: null, ended: false, reader: null };
			resolve(conn);
		});
		listener.server.on("error", (err) => {
			reject(err);
		});
	});
}

function bufPush(buf: DynBuf, data: Buffer) {
	const newLen = data.length + buf.length;
	if (buf.data.length < newLen) {
		let cap = Math.max(buf.data.length, 32);
		while (cap < newLen) {
			cap *= 2;
		}
		const grown = Buffer.alloc(cap);
		buf.data.copy(grown, 0, 0);
	}
	data.copy(buf.data, buf.length, 0);
	buf.length = newLen;
}

const listener = soListen(3000, "localhost");
soAccept(listener)
	.then((conn) => serverClient(conn.socket))
	.catch((err) => console.error(err));

