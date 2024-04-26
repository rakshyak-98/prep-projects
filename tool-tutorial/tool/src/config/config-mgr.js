import chalk from "chalk";
import { cosmiconfigSync } from "cosmiconfig";
import Ajv from "ajv";
import schema from "./schema.json"
const ajv = new Ajv();
const configLoader = cosmiconfigSync("tool");

export default function getConfig() {
	const result = configLoader.search(process.cwd());
	if (result) {
		const isValid
		if
		console.log("Found configuration", result.config);
		return result;
	} else {
		console.log(chalk.yellow("Could not find configuration, using default"));
		return { port: 1234 };
	}
}
