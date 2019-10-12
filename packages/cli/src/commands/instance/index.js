const handler = require("./instanceHandler");

module.exports = {
    command: "instance <appname> [config]", 
    desc: "Create a new instance for an app",
    builder: yargs => {
        yargs.positional("appname", {
            type: "string",
            describe: "the name of the app to create an instance",
            alias: "a"
        });

        yargs.positional("config", {
            type: "string",
            describe: "config file to use. optional, defaults to config.js. Use 'dev' as shorthand for 'config.dev.js' ",
            alias: "c",
            default: "config.js"
        })
    },
    handler
}

