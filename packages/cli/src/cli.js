const yargs = require("yargs");
const chalk = require("chalk");
const commands = [
    require("./commands/init"),
    require("./commands/new"),
    require("./commands/run")
];

module.exports = () => {
  const cli = yargs
                .scriptName("budi")
                .usage('$0 <cmd> [args]');

  for(let c of commands) {
      cli.command(c.cmd, c.description, c.builder, c.handler)
  }

  cli.fail((msg, err) => {
    if(err) {
        console.log(chalk.red(err.message));
        console.log(chalk.gray(err.toString()));
    } else {
        console.log(chalk.red(msg));
    }
  });

  return cli.help().argv;
}