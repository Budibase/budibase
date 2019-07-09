const app = require("./app");
const config = require("./config");
const buildAppContext = require("./initialise/buildAppContext");

buildAppContext(config, true)
    .then((appContext) => app(appContext));