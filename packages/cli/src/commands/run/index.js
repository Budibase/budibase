const handler = require("./runHandler")

module.exports = {
  command: "run [dir]",
  aliases: ["$0"],
  desc:
    "Start budibase Server. You can access your apps and the builder from here if you have dev=true in your config",
  builder: yargs => {
    yargs.positional("dir", {
      type: "string",
      describe: "your budibase apps directory",
      alias: "d",
      default: "~/.budibase",
    })
  },
  handler,
}
