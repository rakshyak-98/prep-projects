const net = require("node:net");
const Buffer = require("node:buffer").Buffer;
const tracker = require("./tracker");

module.exports = (torrent) => {
	tracker.getPeers(torrent, (peers) => {
		peers.forEach(download);
	});
};

function download(peer) {
	const socket = new net.Socket();
	socket.on("error", console.log);
	socket.connect(port, ip, function () {
		socket.write(Buffer.from("hello world"));
	});
	socket.on("data", (responseBuffer) => {
		console.log(responseBuffer);
	});
}

