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
		} else if (reqType(response) === "announce"){
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

function buildConnReq() {}

function buildAnnounceReq(connId) {}

function parseConnResp(resp) {}

function parseAnnounceResp(resp) {}
