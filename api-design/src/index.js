const express = require("express");

const app = express();

app.use((req, res, next) => {
	if (!req.headers.authorization) {
		res.setHeader("WWW-Authenticate", "Basic realm=user password");
		res.status(401).send("Authentication required");
	}
	next();
});

app.get("/", (req, res) => {
	res.send("Hello, world!!!");
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
