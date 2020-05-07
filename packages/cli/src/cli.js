const yargs = require("yargs")
const chalk = require("chalk")

module.exports = () => {
  yargs
    .scriptName("budi")
    .usage("$0 <cmd> [args]")
    .command(require("./commands/init"))
    .command(require("./commands/new"))
    .command(require("./commands/run"))
    .fail((msg, err) => {
      if (err) {
        console.log(chalk.red(err.message))
        console.log(chalk.gray(err.toString()))
      } else {
        console.log(chalk.red(msg))
      }
    })
    .help().argv
}
