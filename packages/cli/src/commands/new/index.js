const handler = require("./newHandler");

module.exports = {
    command: "new <name> [config]", 
    desc: "Create a new Budibase app",
    builder: yargs => {
        yargs.positional("name", {
            type: "string",
            describe: "the name of your app",
            alias: "n"
        });
        yargs.positional("config", {
            type: "string",
            describe: "config file to use - optional, defaults to config.js",
            alias: "c",
            default: "config.js"
        })
    },
    handler
}

