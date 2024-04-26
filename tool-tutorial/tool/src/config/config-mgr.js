import {createLogger} from "../logger.js"
import chalk from "chalk";
import { cosmiconfigSync } from "cosmiconfig";
import betterAjvErrors from "better-ajv-errors";
import Ajv from "ajv";
import schema from "./schema.json" assert { type: "json" };
const logger = createLogger("config:mgr");
const ajv = new Ajv();
const configLoader = cosmiconfigSync("tool");

export default function getConfig() {
	const result = configLoader.search(process.cwd());
	if (result) {
		const isValid = ajv.validate(schema, result.config);
		if (!isValid) {
			logger.warning(chalk.yellow("Invalid configuration was supplied"));
			console.log(betterAjvErrors(schema, result.config, ajv.errors));
			process.exit(1);
		}
		logger.debug("Found configuration", result.config);
		return result.config;
	} else {
		logger.warning(chalk.yellow("Could not find configuration, using default"));
		return { port: 1234 };
	}
}
