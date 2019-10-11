const handler = require("./initHandler");

module.exports = {
    cmd: "init", 
    description: "Initialise Budibase. Run this first to setup your local Budibase",
    builder: yargs => {},
    handler
}

