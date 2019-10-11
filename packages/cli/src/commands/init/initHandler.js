const inquirer = require("inquirer");
const { mkdir, exists, copy } = require("fs-extra");
const chalk = require("chalk");
const { cwd } = require("process");
const { join } = require("path");
const { serverFileName, getAppContext } = require("../../common");
const createMasterDb = require("@budibase/server/initialise/createMasterDb");
var localDatastore = require("@budibase/datastores/datastores/local");

module.exports = (argv) => {

    const questions = [
        {
            type: "input",
            name: "username",
            message: "Choose a username for Admin: ",
            validate: function(value) {
              return !!value || "Please enter a username"
            }
        },
        {
            type: "input",
            name: "password",
            message: "Choose a password for Admin: ",
            validate: function(value) {
              return !!value || "Please enter a password"
            }
        }
    ]

    inquirer
    .prompt(questions)
    .then(run);

}

const run = async (opts) => {

    opts.datapath = "./.data";
    await createDataFolder(opts);
    await createDevConfig(opts);
    await initialiseDatabase(opts);
}

const createDataFolder = async (opts) => {
    if(await exists(opts.datapath)) {
        const err = `The path ${opts.datapath} already exists - has budibase already been initialised? Remove the directory to try again.`;
        throw new Error(err);
    }

    await mkdir(opts.datapath);
}

const createDevConfig = async (opts) => {

    if(await exists("config.js")) {
        console.log(chalk.yellow("Config file already exists (config.js) - keeping your existing config"));
    } else {
        const srcConfig = serverFileName("config.dev.js");
        const destFile = "./config.js";
        await copy(srcConfig, destFile);
    }
}

const initialiseDatabase = async (opts) => {

    const appContext = await getAppContext({masterIsCreated:false});

    await createMasterDb(
        appContext,
        localDatastore,
        opts.username,
        opts.password);

}