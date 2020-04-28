const handler = require("./initHandler")

module.exports = {
  command: "init [dir] [database] [clientId] [couchDbUrl]",
  desc: "Initialise Budibase. Run this first to setup your local Budibase",
  builder: yargs => {
    yargs.positional("dir", {
      type: "string",
      describe:
        "your apps directory - directory will be created if it does not exist",
      default: "~/.budibase",
      alias: "d",
    })
    yargs.positional("database", {
      type: "string",
      describe: "use a local (PouchDB) or remote (CouchDB) database",
      alias: "b",
      default: "local",
      choices: ["local", "remote"],
    })
    yargs.positional("clientId", {
      type: "string",
      describe: "used to determine the name of the global databse",
      alias: "c",
      default: "new",
    })
    yargs.positional("couchDbUrl", {
      type: "string",
      describe: "connection string for couch db, format: https://username:password@localhost:5984",
      alias: "x",
      default: "",
    })
    yargs.positional("quiet", {
      type: "boolean",
      describe: "flag - if set, then run in quiet mode - use all defaults",
      alias: "q",
      default: false,
    })
  },
  handler,
}
