const { resolve, join } = require("path");
const { cwd } = require("process");
const buildAppContext = require("@budibase/server/initialise/buildAppContext");

module.exports.serverFileName = relativePath => 
    resolve(__dirname, 
            "..",
            "node_modules",
            "@budibase", 
            "server", 
            relativePath);

module.exports.getAppContext = async (configName) => {

    if(configName) {
        if(!configName.endsWith(".js")) {
            configName = `config.${configName}.js`;
        }
    } else {
        configName = "config.js";
    }

    const config = require(join(cwd(), configName))();
    return await buildAppContext(config, false);
}