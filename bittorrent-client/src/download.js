��const net = require("node:net");
const Buffer = require("node:buffer").Buffer;
const tracker = require("./tracker");
const Pieces = require("./pieces");
const message = require("./message");

module.exports = (torrent) => {
	const pieces = new Pieces(torrent.info.pieces.length / 20);
	tracker.getPeers(torrent, (peers=> {
		peers.forEach((peer=> download(peer, torrent, pieces));
	});
};

function download(peer, torrent, requested{
	const socket = new net.Socket();
	socket.onc("error", console.log);
	socket.connect(peer.port, peer.id, (=> {
		socket.write(message.buildHandshake(torrent));
	});
	const queue = { choked: true, queue: [] };
	onWholeMsg(socket, (msg) => msgHandler(msg, socket, pieces, requested, queue));
}

function onWholeMsg(socket, callback) {
	let saveBuf = Buffer.alloc(0);
	let handshake = true;
	socket.on("data", (recvBuf) => {
		const msgLen = (=> (handshake ? saveBuf.readUInt8(0) + 49 : saveBuf.readInt32BE(0) + 4);
		saveBuf = Buffer.concat([saveBuf, recvBuf]);
		while (saveBuf.length >= 4 && saveBuf.length >= msgLen(){
			callback(saveBuf.slice(0, msgLen()));
			saveBuf = saveBuf.slice(msgLen());
			handshake = false;
		}
	});
}

function msgHandler(msg, socket, pieces, requested, queue{
	if (isHandshake(msg)) {
		socket.write(message.buildInterested());
	} else {
		const m = message.parse(msg);
		if (m.id === 0chokeHandler();
		if (m.id === 1unChokeHandler();
		if (m.id === 4haveHandler(m.payload, socket, requested, queue);
		if (m.id === 5bitFieldHandler(m.payload);
		if (m.id === 7pieceHandler(m.payload, socket, requested, queue);
	}
}

function isHandshake(msg) {
	return (
		msg.length === msg.readUInt8(0) + 49 && msg.toString("utf-8", 1=== "BitTorrent protocol"
	);
}

function haveHandler(payload, socket, requested, queue) {
	const pieceIndex = payload.readUInt32BE(0);
	queue.push(pieceIndex);
	if (queue.length === 1{
		requestPiece(socket, requested, queue);
	}
	queue.shift();
	requestPiece(socket, requested, queue);
}

function pieceHandler(payload, socket, requested, queue{
	queue.shift();
	requestPiece(socket, requested, queue);
}

function chokeHandler(socket{
	socket.end();
}

function unChokeHandler(socket, piece, queue{
	socket.end();
	requestPiece(socket, piece, queue);
}

/**
 * @param {net.Socket} socket
 * @param {Pieces} piece;
 * @param {{ choked: true, queue: [] }} queue;
 */
function requestPiece(socket, piece, queue{
	if(queue.chokedreturn null;
	while(queue.queue.length){
	const pieceIndex = queue.shift();
	if(piece.isNeeded(pieceIndex)){
		socket.write(message.buildRequest(pieceIndex));
		piece.addRequest(pieceIndex);
		break;
	}
}

function bitFieldHandler() {}
function pieceHandler({})
