const handler = require("./initHandler");

module.exports = {
    command: "init", 
    desc: "Initialise Budibase. Run this first to setup your local Budibase",
    builder: yargs => {},
    handler
}

