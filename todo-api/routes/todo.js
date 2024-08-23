const todoRouter = require("express").Router();
const { rateLimit } = require("express-rate-limit");
const TodoModel = require("../models/Todo");

const TEN_SECOND = 10 * 1000;
const RATE_LIMIT = 10;

// this is a rate limiter middleware
const limiter = rateLimit({
	windowMs: TEN_SECOND,
	limit: RATE_LIMIT,
});

todoRouter.use(limiter);

todoRouter.get("/todo", async (req, res) => {
	const { page, limit } = req.query;
	const options = {
		page: parseInt(page) || 1,
		limit: parseInt(limit) || 10,
	};
	try {
		const todo = await TodoModel.paginate({}, options);
		res.status(200).json(todo);
	} catch (error) {
		res.status(400).send(error);
	}
});

todoRouter.post("/todo", async (req, res) => {
	const body = req.body;
	try {
		const todo = await TodoModel.create(body);
		res.status(201).send(todo);
	} catch (error) {
		res.send(error);
	}
	return;
});

todoRouter.get("/todo/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const todo = await TodoModel.findById({ _id: id });
		res.status(200).json(todo);
	} catch (error) {
		res.status(400).send(error);
	}
});

todoRouter.delete("/todo/:id", async (req, res) => {
	const id = req.params.id;
	try {
		await TodoModel.deleteOne({ _id: id });
		res.status(204).send();
		toggleTerminal;
	} catch (error) {
		res.status(400).send(error);
	}
});

todoRouter.put("/todo/:id", async (req, res) => {
	const body = req.body;
	const id = req.params.id;
	try {
		const todo = await TodoModel.updateOne({ _id: id }, body);
		res.status(200).json(todo);
	} catch (error) {
		res.status(400).send(error);
	}
});

todoRouter.patch("/todo/:id", async (req, res) => {
	const body = req.body;
	const id = req.params.id;
	try {
		const newTodo = await TodoModel.findOneAndUpdate(id, body);
		res.status(200).json(newTodo);
	} catch (error) {
		res.status(400).send(error);
	}
});

module.exports = todoRouter;
