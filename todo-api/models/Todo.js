const mongoose = require("mongoose");

const schema = mongoose.Schema(
	{
		title: String,
		completed: {
			type: Boolean,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const TodoModel = mongoose.model("Todo", schema);

module.exports = TodoModel;
