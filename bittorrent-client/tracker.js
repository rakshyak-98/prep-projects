const crypto = require("node:crypto");
const dgram = require("node:dgram");

const util = require("./util.cjs");

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

function buildAnnounceReq(connId, torrent, port=6881) {
	const buf = Buffer.allocUnsafe(98);
	// connection id
	connId.copy(buf, 0);
	// action
	buf.writeUInt32BE(1, 0);
	// transaction id
	crypto.randomBytes(4).copy(buf, 12);
	// info hash
	// torrentParser.infoHash(torrent).cop(buf, 16);
	// peerId
	util.genId().copy(buf, 36);
	// downloaded
	Buffer.alloc(8).copy(buf, 56);
	// left
	// torrentParser.size(torrent).copy(buf, 64);
	// uploaded
	Buffer.alloc(8).copy(buf, 72);
	// event
	buf.writeUInt32BE(0, 80);
	// ip address
	buf.writeUInt32BE(0, 80);
	// key
	crypto.randomBytes(4).copy(buf, 88);
	// num want
	buf.writeInt32BE(-1, 92);
	// port
	buf.writeUInt16BE(port, 96);
	return buf;
}

function parseConnResp(resp) {
	return {
		action: resp.readUInt32BE(0),
		transactionId: resp.readUInt32BE(4),
		connectionId: resp.slice(8),
	};
}

function parseAnnounceResp(resp) {
	function group(iterable, groupSize){
		let groups = new Array();
		for(let i = 0; i < iterable.length; i+=groupSize){
			groups.push(iterable.slice(i, i + groupSize));
		}
		return groups;
	}
	return {
		action: resp.readUInt32BE(0),
		transactionId: resp.readUInt32BE(4),
		leechers: resp.readUInt32BE(8),
		seeders: resp.readUInt32BE(12),
		peers: group(resp.slice(20), 6).map(address => {
			return {
				ip: address.slice(0, 4).join('.'),
				port: address.readUInt16BE(4),
			}
		})
	}
}
