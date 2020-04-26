const handler = require("./newHandler")

module.exports = {
  command: "new <name> [dir]",
  desc: "Create a new Budibase app",
  builder: yargs => {
    yargs.positional("name", {
      type: "string",
      describe: "the name of your app",
      alias: "n",
    })
    yargs.positional("dir", {
      type: "string",
      describe: "budibase apps directory",
      alias: "d",
      default: "~/budibase",
    })
  },
  handler,
}
