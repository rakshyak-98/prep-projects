const express = require("express");
const todoRouter = require("./routes/todo");
const mongoose = require("mongoose");

const app = express();
const url = process.env.MONGODB_URI;
const logger = (req, res, next) => {
	console.log(req.method, req.path);
	next();
}

mongoose
	.connect(url)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.error(url, error);
	});

app.use(express.json());
app.use(logger);
app.use(todoRouter);
app.get("/", (req, res) => {
	res.send("Health check ok");
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
