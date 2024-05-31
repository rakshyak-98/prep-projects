const crypto = require("node:crypto");
const dgram = require("node:dgram");

const urlParse = require("node:url").parse;
const Buffer = require("node:buffer").Buffer;

module.exports.getPeers = (torrent, callback) => {
	const socket = dgram.createSocket("udp4");
	const url = torrent.announce.toString("utf-8");
	socket.on("message", (response) => {
		if (reqType(response) === "connect") {
			const connResp = parseConnResp(response);
			const announceReq = buildAnnounceReq(connResp.connectionId);
			udpSend(socket, announceReq, url);
		} else if (reqType(response) === "announce") {
			const announceResp = parseAnnounceResp(response);
			callback(announceResp.peers);
		}
	});
};

function udpSend(socket, rawUrl, callback = () => {}) {
	const url = urlParse(rawUrl);
	socket.send(message, 0, message.length, url.port, url.host, callback);
}

function reqType(resp) {}

function buildConnReq() {
	const buf = Buffer.alloc(16);
	// connection_id
	buf.writeUInt32BE(0x417, 0);
	buf.writeUInt32BE(0x27101980, 4);
	// action
	buf.writeUInt32BE(0, 8);
	// transaction id
	crypto.randomBytes(4).copy(buf, 12);
	return buf;
}

function buildAnnounceReq(connId) {}

function parseConnResp(resp) {
	return {
		action: resp.readUInt32BE(0),
		transactionId: resp.readUInt32BE(4),
		connectionId: resp.slice(8),
	};
}

function parseAnnounceResp(resp) {}

