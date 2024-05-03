const net = require("net");
const { bufPush } = require("./dynamic-buffer");
const { cutMessage } = require("./message-protocol");

const server = net.createServer({ allowHalfOpen: true, pauseOnConnect: true });

/**
 * @param {net.Socket} socket
 * @return {{socket: net.Socket, end: null | Error, ended: Boolean, reader: null | {resolve: () => void, reject: () => void }}}
 */

function soInit(socket) {
	const conn = {
		socket: socket,
		end: null,
		ended: false,
		reader: null,
	};

	socket.on("data", (data) => {
		console.assert(conn.reader);
		conn.socket.pause();
		conn.reader?.resolve(data);
		conn.reader = null;
	});

	socket.on("close", () => {
		conn.ended = true;
		if (conn.reader) {
			conn.reader.resolve(Buffer.from("")); // EOF
			conn.reader = null;
		}
	});

	socket.on("error", (err) => {
		conn.err = err;
		if (conn.reader) {
			conn.reader.reject(err);
			conn.reader = null;
		}
	});

	return conn;
}

/**
 * @param {{err: Error, ended: Boolean}} conn
 */

async function soRead(conn) {
	console.assert(!conn.reader);
	return new Promise((resolve, reject) => {
		if (conn.err) {
			reject(conn.err);
			return;
		}

		if (conn.ended) {
			resolve(Buffer.from(""));
			return;
		}

		conn.reader = { resolve, reject };
		conn.socket.resume();
	});
}

/**
 * @param {{socket: net.Socket, err: Error, ended: Boolean}} conn
 * @param {Buffer} data
 */

function soWrite(conn, data) {
	console.assert(data.length > 0);
	return new Promise((resolve, reject) => {
		if (conn.err) {
			reject(conn.err);
			return;
		}
		conn.socket.write(data, (err) => {
			if (err) {
				reject(err);
			} else {
				{
					resolve();
				}
			}
		});
	});
}

/**
 * @param {net.Socket} socket
 * @var {{data: Buffer, length: number}} buf
 */

async function serverClient(socket) {
	const conn = soInit(socket);
	/** */
	const buf = { data: Buffer.alloc(0), length: 0 };
	while (true) {
		// try to get one message from the buffer.
		const msg = cutMessage(buf);
		if (!msg) {
			/** @var {Buffer} data*/
			const data = await soRead(conn);
			bufPush(buf, data);
			if (data.length === 0) {
				return;
			}
			continue;
		}
		if (msg.equals(Buffer.from("quit\n"))) {
			await soWrite(conn, Buffer.from("Bye.\n"));
			socket.destroy();
			return;
		} else {
			const reply = Buffer.concat([Buffer.from("Echo: ", msg)]);
			await soWrite(conn, reply);
		}
	} // loop for messages
}

/**
 * @param {net.Socket} socket
 */

async function newConn(socket) {
	console.log("new connection", socket.remoteAddress, socket.remotePort);
	try {
		await serverClient(socket);
	} catch (exc) {
		console.error("Exception:", exc);
	} finally {
		socket.destroy();
	}
}

server.on("connection", newConn);

server.listen(3000, () => {
	console.log("Listening!!");
});

