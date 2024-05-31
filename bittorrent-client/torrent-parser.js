"use strict";

const fs = require("node:fs");
const crypto = require("node:crypto");
const benCode = require("bencode");
const bigNum = require("bignum");

module.exports.open = (filepath) => {
	return benCode.decode(fs.readFileSync(filepath));
};

module.exports.size = (torrent) => {
	const size = torrent.info.files
		? torrent.info.files.map((file) => file.length).reduce((a, b) => a + b)
		: torrent.info.length;
	return bigNum.toBuffer(size, {size: 8});
};

module.exports.infoHash = (torrent) => {
	const info = benCode.encode(torrent.info);
	return crypto.createHash("sha1").update(info).digest();
};

