"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../structures/Command");
const constants_1 = require("../constants");
const init_1 = require("./init");
const start_1 = require("./start");
const stop_1 = require("./stop");
const status_1 = require("./status");
const update_1 = require("./update");
const genUser_1 = require("./genUser");
const watch_1 = require("./watch");
exports.default = new Command_1.Command(`${constants_1.CommandWord.HOSTING}`)
    .addHelp("Controls self hosting on the Budibase platform.")
    .addSubOption("--init [type]", "Configure a self hosted platform in current directory, type can be unspecified, 'quick' or 'single'.", init_1.init)
    .addSubOption("--start", "Start the configured platform in current directory.", start_1.start)
    .addSubOption("--status", "Check the status of currently running services.", status_1.status)
    .addSubOption("--stop", "Stop the configured platform in the current directory.", stop_1.stop)
    .addSubOption("--update", "Update the Budibase images to the latest version.", update_1.update)
    .addSubOption("--watch-plugin-dir [directory]", "Add plugin directory watching to a Budibase install.", watch_1.watchPlugins)
    .addSubOption("--gen-user", "Create an admin user automatically as part of first start.", genUser_1.generateUser)
    .addSubOption("--single", "Specify this with init to use the single image.");
