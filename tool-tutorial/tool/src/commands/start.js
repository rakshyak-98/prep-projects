import chalk from "chalk";

export default function start(config) {
	console.log(chalk.bgCyanBright("\tStarting the app"));
	console.log(chalk.gray("Received configuration in start -", config));
};

