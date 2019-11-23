const inquirer = require("inquirer");
const { mkdir, exists, copy } = require("fs-extra");
const chalk = require("chalk");
const { serverFileName, getAppContext } = require("../../common");
const passwordQuestion = require("@inquirer/password");
const createMasterDb = require("@budibase/server/initialise/createMasterDb");
const { join, resolve } = require("path");
const localDatastore = require("@budibase/datastores/datastores/local");

module.exports = (opts) => {
   run(opts);
}

const run = async (opts) => {

    await prompts(opts);
    await createDevConfig(opts);
    await createAppsDir(opts);
    await createDataFolder(opts);
    await initialiseDatabase(opts);
}

const prompts = async (opts) => {

    const questions = [
        {
            type: "input",
            name: "username",
            message: "Username for Admin: ",
            validate: function(value) {
              return !!value || "Please enter a username"
            }
        }
    ]

    if(!opts.username) {
        const answers = await inquirer.prompt(questions);
        opts.username = answers.username;
    }

    if(!opts.password) {

        const password = await passwordQuestion({
            message: "Password for Admin: ", mask: "*"
        });
        const passwordConfirm = await passwordQuestion({
            message: "Confirm Password: ", mask: "*"
        });
    
        if(password !== passwordConfirm) 
            throw new Exception("Passwords do not match!");
        
        
        opts.password = password;
    }
}

const createAppsDir = async (opts) => {
    if(!await exists(opts.configJson.latestPackagesFolder)) {
        await mkdir(opts.configJson.latestPackagesFolder);
    }
}

const createDataFolder = async (opts) => {
    
    const dataPath = opts.configJson.datastoreConfig.rootPath;

    if(await exists(dataPath)) {
        const err = `The path ${opts.datapath} already exists - has budibase already been initialised? Remove the directory to try again.`;
        throw new Error(err);
    }

    await mkdir(dataPath);
}

const createDevConfig = async (opts) => {

    const configTemplateFile = `config.${opts.config}.js`;
    const destConfigFile = "./config.js";

    if(await exists(destConfigFile)) {
        console.log(chalk.yellow("Config file already exists (config.js) - keeping your existing config"));
    } else {
        const srcConfig = serverFileName(configTemplateFile);
        await copy(srcConfig, destConfigFile);
    }
    opts.configJson = require(resolve("./config.js"))();
}

const initialiseDatabase = async (opts) => {

    const appContext = await getAppContext({masterIsCreated:false});

    await createMasterDb(
        appContext,
        localDatastore,
        opts.username,
        opts.password);

}