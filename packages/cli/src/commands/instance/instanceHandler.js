const inquirer = require("inquirer");
const { mkdir, exists, copy, readJSON } = require("fs-extra");
const { join } = require("path");
const chalk = require("chalk");
const fp = require("lodash/fp");
const { serverFileName, getAppContext } = require("../../common");
const passwordQuestion = require("@inquirer/password");
const createMasterDb = require("@budibase/server/initialise/createMasterDb");
var localDatastore = require("@budibase/datastores/datastores/local");

module.exports = (opts) => {
   run(opts);
}

const run = async (opts) => {

    const appContext = await getAppContext({configName: opts.config, masterIsCreated:true});
    opts.appContext = appContext;
    opts.datapath = "./.data";
    await fetchUserLevels(opts);
    await prompts(opts);
    await createInstance(opts);
}

const fetchUserLevels = async (opts) => {
    const accessLevels = await readJSON(
        join(
            opts.appContext.config.latestPackagesFolder || ".", 
            opts.appname, 
            "access_levels.json")
    );

    if(accessLevels.levels.length === 0)
        throw new Exception("No access levels. Use the builder to create one");

    opts.accessLevels = accessLevels.levels;
}

const prompts = async (opts) => {

    const questions = [
        {
            type: "input",
            name: "username",
            message: "Username: ",
            validate: function(value) {
              return !!value || "Please enter a username"
            }
        }
    ]

    if(opts.accessLevels.length === 1) {
        opts.userAccessLevel = opts.accessLevels[0].name;
    } else {
        questions.push({
            type: "input",
            name: "userAccessLevel",
            message: `Access Level [${fp.join(", ")(opts.accessLevels.map(l => l.name))}]: `,
            choices: opts.accessLevels.map(l => l.name)
        });
    }

    const answers = await inquirer.prompt(questions);
    const password = await passwordQuestion({
        message: "Password for Admin: ", mask: "*"
    });
    const passwordConfirm = await passwordQuestion({
        message: "Confirm Password: ", mask: "*"
    });

    if(password !== passwordConfirm) 
        throw new Exception("Passwords do not match!");
    
    opts.username = answers.username;
    opts.password = password;
    if(opts.accessLevels.length > 1) {
        opts.userAccessLevel = answers.userAccessLevel;
    }
}


const createInstance = async (opts) => {

    const bb = opts.appContext.master.bbMaster;

    const app = await opts.appContext.master.getApplication(opts.appname);
    const instance = bb.recordApi.getNew(`${app.key}/instances`, "instance");
    instance.name = "dev instance";
    instance.active = true;
    instance.version = {key:""};

    const user = bb.authApi.getNewUser();
    user.accessLevels.push(opts.userAccessLevel);
    user.name = opts.username;

    await bb.recordApi.save(instance);
    const savedInstance = await bb.recordApi.load(instance.key);
    await opts.appContext.master.createAppUser(
        opts.appname, savedInstance, user, opts.password);

}