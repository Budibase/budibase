const handler = require("./runHandler")

module.exports = {
  command: "run [config]",
  aliases: ["$0"],
  desc:
    "Start budibase Server. You can access your apps and the builder from here if you have dev=true in your config",
  builder: yargs => {
    yargs.positional("config", {
      type: "string",
      describe:
        "config file to use. optional, defaults to config.js. Use 'dev' as shorthand for 'config.dev.js' ",
      alias: "c",
      default: "config.js",
    })
  },
  handler,
}
