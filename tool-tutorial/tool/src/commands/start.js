import {createLogger} from "../logger.js"
import chalk from "chalk";
const logger = createLogger("commands:start")

export default function start(config) {
	logger.highlight(chalk.bgCyanBright("\tStarting the app"));
	logger.debug(chalk.gray("Received configuration in start -", config));
};

