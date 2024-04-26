import chalk from "chalk";
import debug from "debug";

export function createLogger(name){
    return {
        log: (...args) => console.log(chalk.gray(...args)),
        warning: (...args) => console.log(chalk.yellowBright(...args)),
        highlight: (...args) => console.log(chalk.bgCyanBright(...args)),
        debug: debug(name),
    }
}
