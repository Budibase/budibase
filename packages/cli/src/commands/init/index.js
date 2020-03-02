const handler = require("./initHandler")

module.exports = {
  command: "init [dir] [config] [username] [password]",
  desc: "Initialise Budibase. Run this first to setup your local Budibase",
  builder: yargs => {
    yargs.positional("dir", {
      type: "string",
      describe:
        "your apps directory - directory will be created if it does not exist",
      default: ".",
      alias: "d",
    })
    yargs.positional("config", {
      type: "string",
      describe: "config template file to use - optional, defaults to config.js",
      alias: "c",
      default: "dev",
      choices: ["dev", "contributors"],
    })
    yargs.positional("username", {
      type: "string",
      describe: "username for admin interface",
      alias: "u",
      default: "",
    })
    yargs.positional("password", {
      type: "string",
      describe: "password for admin interface",
      alias: "p",
      default: "",
    })
  },
  handler,
}
