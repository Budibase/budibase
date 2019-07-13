const app = require("./app");
const config = require("./config");
const buildAppContext = require("./initialise/buildAppContext");

(async () => {
    const bbContext = await buildAppContext(config(), true);
    const server = await app(bbContext);
    server.on("listening", () => {
        console.log(`Budibase Server listening on port ${bbContext.config.port}`);
    })
})()
