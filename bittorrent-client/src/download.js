const net = require("node:net");
const Buffer = require("node:buffer").Buffer;
const tracker = require("./tracker");

module.exports = (torrent) => {
	const requested = [];
	tracker.getPeers(torrent, (peers) => {
		peers.forEach((peer) => download(peer, torrent, requested));
	});
};

function download(peer, torrent, requested) {
	const socket = new net.Socket();
	socket.connect(peer.port, peer.id, () => {
		socket.write(message.buildHandshake(torrent));
	});
	onWholeMsg(socket, (msg) => msgHandler(msg, socket, requested, queue));
}

function msgHandler(msg, socket, requested) {
	if (isHandshake(msg)) {
		socket.write(message.buildInterested());
	} else {
		const m = message.parse(msg);
		if (m.id === 0) chokeHandler();
		if (m.id === 1) unChokeHandler();
		if (m.id === 4) haveHandler(m.payload, socket, requested, queue);
		if (m.id === 5) bitfieldHandler(m.payload);
		if (m.id === 7) pieceHandler(m.payload, socket, requested, queue);
	}
}

function haveHandler(payload, socket, requested, queue) {
	const pieceIndex = payload.readUInt32BE(0);
	queue.push(pieceIndex);
	if (queue.length === 1) {
		requestPiece(socket, requested, queue);
	}
}

function pieceHandler(payload, socket, requested, queue) {
	queue.shift();
	requestedPiece(socket, requested, queue);
}



function isHandshake(msg) {
	return (
		msg.length === msg.readUInt8(0) + 49 && msg.toString("utf-8", 1) === "BitTorrent protocol"
	);
}

function onWholeMsg(socket, callback) {
	let saveBuf = Buffer.alloc(0);
	let handshake = true;
	socket.on("data", (recvBuf) => {
		const msgLen = () => (handshake ? saveBuf.readUInt8(0) + 49 : saveBuf.readInt32BE(0) + 4);
		saveBuf = Buffer.concat([saveBuf, recvBuf]);
		while (saveBuf.length >= 4 && saveBuf.length >= msgLen()) {
			callback(saveBuf.slice(0, msgLen()));
			saveBuf = saveBuf.slice(msgLen());
			handshake = false;
		}
	});
}

function chokeHandler() {}
function unChokeHandler() {}
function bitfieldHandler() {}
function pieceHandler() {}

