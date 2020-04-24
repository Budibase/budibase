const handler = require("./initHandler")

module.exports = {
  command: "init [dir] [database] [clientId] [couchDbConnectionString]",
  desc: "Initialise Budibase. Run this first to setup your local Budibase",
  builder: yargs => {
    yargs.positional("dir", {
      type: "string",
      describe:
        "your apps directory - directory will be created if it does not exist",
      default: "~/budibase",
      alias: "d",
    })
    yargs.positional("database", {
      type: "string",
      describe: "database to use usually couch for dev",
      alias: "db",
      default: "pouch",
      choices: ["pouch", "couch"],
    })
    yargs.positional("clientId", {
      type: "string",
      describe: "used to determine the name of the global databse",
      alias: "c",
      default: "new",
    })
    yargs.positional("couchDbConnectionString", {
      type: "string",
      describe: "connection string for couch db, format: https://username:password@localhost:5984",
      alias: "x",
      default: "",
    })
  },
  handler,
}
