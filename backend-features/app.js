const express = require("express");
const mongoose = require("mongoose");

const app = express();
mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true });

app.get("items/", async (req, res) => {
	const { cursor, limit } = req.query;
	const limitInt = parseInt(limit) || 10;

	let query = {};
	if (cursor) {
		query = { _id: { $gt: mongoose.Types.ObjectId(cursor) } };
	}

	/**
	 * @type {Array}
	 * list of items
	 * */
	const items = await Item.find(query).sort({ _id: 1 }).limit(limitInt);
	const nextCursor = items.length > 0 ? items.slice(0, limitInt).pop()._id : null;
	res.json({ items, nextCursor });
});

