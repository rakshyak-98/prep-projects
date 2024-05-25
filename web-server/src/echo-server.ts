import * as net from "net";

const kMaxHeaderLen = 1024 * 8;

type HTTPReq = {
	method: string;
	uri: Buffer;
	version: string;
	headers: Buffer[];
};

type HTTPRes = {
	code: number;
	headers: Buffer[];
	body: BodyReader;
};

type BodyReader = {
	// The "Content-length", -1 if unknown".
	length: number;
	// read data, returns an empty buffer after EOF.
	read: () => Promise<Buffer>;
};

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
		rejects: (reason: Error) => void;
	};
};
type TCPListener = { socket: net.Socket };

declare function fieldGet(headers: Buffer[], key: string): null | Buffer;
declare function encodeHTTPResp(resp: HTTPRes): Buffer;

class HTTPError extends Error {
	statusCode: number;
	constructor(code: number, message: string) {
		super(message);
		this.statusCode = code;
		Object.setPrototypeOf(this, HTTPError.prototype);
	}
}

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

/**
 *  The payload body can be arbitrarily long, it may not even fit in memory,
 * thus we have to use the `soRead()` function to read from it instead of simple Buffer.
 * the end of data is signaled by an empty Buffer.from("").
 * And when using chunked encoding, delimited by LF (\n).
 */
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

async function serverClient(conn: TCPConn): Promise<void> {
	const buf: DynBuf = { data: Buffer.alloc(0), length: 0 };
	while (true) {
		const msg: null | HTTPReq = cutMessage(buf);
		if (!msg) {
			const data: Buffer = await soRead(conn);
			bufPush(buf, data);
			if (data.length === 0 && buf.length === 0) {
				return; // no request remaning
			}
			if (data.length === 0) {
				throw new HTTPError(400, "Unexpected EOF.");
			}
			// go some data, try it again.
			continue;
		}

		// process message and send response
		const reqBody: BodyReader = readerFromReq(conn, buf, msg);
		const res: HTTPRes = await handleReq(msg, reqBody);
		await writeHTTPResp(conn, res);
		// close the connection for HTTP/1.0
		if (msg.version === "1.0") {
			return;
		}

		// make sure that the request body is consumed completely
		while ((await reqBody.read()).length > 0) {
			/* empty */
		}
	} // loop for IO
}

async function newConn(socket: net.Socket) {
	const conn: TCPConn = soInit(socket);
	try {
		await serverClient(conn);
	} catch (exc) {
		console.log("Exception: ", exc);
		if (exc instanceof HTTPError) {
			const resp: HTTPRes = {
				code: exc.statusCode,
				headers: [],
				body: readerFromMemory(Buffer.from(exc.message + "\n")),
			};
			try {
				await writeHTTPResp(conn, resp);
			} catch (exc) {
				/* ignore */
			}
		}
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

function bufPush(buf: DynBuf, data: Buffer) {
	const newLen = buf.length + data.length;
	if (buf.length < newLen) {
		let cap = Math.max(buf.data.length, 32);
		while (cap < newLen) {
			cap *= 2;
		}
		const grown = Buffer.alloc(cap);
		buf.data.copy(grown, 0, 0);
		buf.data = grown;
	}
	data.copy(buf.data, buf.length, 0);
	buf.length = newLen;
}

function cutMessage(buf: DynBuf): null | HTTPReq {
	const idx = buf.data.subarray(0, buf.length).indexOf("\r\n\r\n");
	if (idx < 0) {
		if (buf.length >= kMaxHeaderLen) {
			throw new HTTPError(413, "header is too large");
		}
		return null;
	}
	const msg: HTTPReq = parseHTTPReq(Buffer.from(buf.data.subarray(0, idx + 1)));
	bufPop(buf, idx + 1);
	return msg;
}

function bufPop(buf: DynBuf, len: number): void {
	buf.data.copyWithin(0, len, buf.length);
	buf.length -= len;
}

function readerFromMemory(data: Buffer): BodyReader {
	let done = false;
	return {
		length: data.length,
		read: async (): Promise<Buffer> => {
			if (done) {
				return Buffer.from(""); // no more data
			} else {
				done = true;
				return data;
			}
		},
	};
}
function parseHTTPReq(data: Buffer): HTTPReq {
	const lines: Buffer[] = splitLines(data);
	const [method, uri, version] = parseRequestLine(lines[0]);
	const headers: Buffer[] = [];
	for (let i = 1; i < lines.length - 1; i++) {
		const h = Buffer.from(lines[i]);
		if (!validateHeader(h)) {
			throw new HTTPError(400, "bad filed");
		}
		headers.push(h);
	}
	console.assert(lines[lines.length - 1].length === 0);
	return {
		method,
		uri,
		version,
		headers,
	};
}

function readerFromReq(conn: TCPConn, buf: DynBuf, re: HTTPReq): BodyReader {
	let bodyLen = -1;
	const contentLen = fieldGet(req.headers, "Content-length");
	if (contentLen) {
		bodyLen = parseDec(contentLen.toString("latin1"));
		if (isNaN(bodyLen)) {
			throw new HTTPError(400, "bad Content-Lenght.");
		}
	}
	const bodyAllowed = !(req.method === "GET" || req.method === "HEAD");
	const chunked =
		fileGet(req.headers, "Transfer-Encoding")?.equals(Buffer.from("chunked")) || false;
	if ((!bodyAllowed && bodyLen > 0) || chunked) {
		throw new HTTPError(400, "HTTP body not allowed");
	}
	if (!bodyAllowed) {
		bodyLen = 0;
	}
	if (bodyLen >= 0) {
		return readerFromConnLenght(conn, buf, bodyLen);
	} else if (chunked) {
		throw new HTTPError(501, "TODO");
	} else {
		throw new HTTPError(501, "TODO");
	}
}

function readerFromConnLength(conn: TCPConn, buf: DynBuf, remain: number): BodyReader {
	return {
		length: remain,
		read: async (): Promise<Buffer> => {
			if (remain === 0) {
				return Buffer.from(""); // done
			}
			if (buf.length === 0) {
				const data = await soRead(conn);
				bufPush(buf, data);
				if (data.length == 0) {
					throw new Error("Unexpected EOF from HTTP body");
				}
			}
			const consume = Math.min(buf.length, remain);
			remain -= consume;
			const data = Buffer.from(buf.data.subarray(0, consume));
			bufPop(buf, consume);
			return data;
		},
	};
}

async function handleReq(req: HTTPReq, body: BodyReader): Promise<HTTPRes> {
	let resp: BodyReader;
	switch (req.uri.toString("latin1")) {
		case "/echo":
			resp = body;
			break;
		default:
			resp = readerFromMemory(Buffer.from("hello world.\n"));
			break;
	}
	return {
		code: 200,
		headers: [Buffer.from("Server: my_first_http_server")],
		body: resp,
	};
}

async function writeHTTPResp(conn: TCPConn, resp: HTTPRes): Promise<void> {
	if (resp.body.length < 0) {
		throw new Error("TODO: chunked encoding");
	}
	console.assert(!fieldGet(resp.headers, "Content-Lenght"));
	await soWrite(conn, encodeHTTPResp(resp));
	while (true) {
		const data = await resp.body.read();
		if (data.length === 0) {
			break;
		}
		await soWrite(conn, data);
	}
}

const listener = soListener(3000, "localhost");
soAccept(listener);

