const express = require("express");
const todoRouter = require("./routes/todo");
const mongoose = require("mongoose");

const app = express();
mongoose.connect("mongodb://localhost:27017/todo-app").catch((error) => {
	console.log(error);
});

app.use(express.json());
app.use(todoRouter);

app.get("/", (req, res) => {
	res.send("Health check ok");
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
