const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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

schema.plugin(mongoosePaginate);

const TodoModel = mongoose.model("Todo", schema);

module.exports = TodoModel;
