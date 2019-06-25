const util = require("util");
const fs = require("fs");
const { join } = require("path");
const { ncp } = require('ncp');
const { masterAppPackage } = require("../utilities/createAppPackage");
const rimraf = util.promisify(require("rimraf"));
const mkdir = util.promisify(fs.mkdir);

const exists = root => async (path) => {
    try {
        await util.promisify(fs.access)(
            join(root,path)
        );       
    } catch (e) {
        return false;
    }
    return true;
};

const copyfolder = (source, destination) =>
    new Promise((resolve, reject) => {
        ncp(source, destination, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

module.exports = async (config, bbMaster, latestAppsFolder) => {

    const appsRuntimeFolder = "./runtime_apps";
    // create runtime folder
    // copy master into /master/latest 
    if(await exists(appsRuntimeFolder)) {
        try {
            await rimraf(appsRuntimeFolder);
        } catch(err) {
            console.log(err);
        }
    }
    
    await mkdir(appsRuntimeFolder);
    

    /*
    const allApps = await bbMaster
                            .indexApi
                            .listItems("/all_applications");    
    
    for(let app of allApps) {
        app.
    }
    */
    

    const apps = {
        "_master": masterAppPackage(config)
    }

    return ((appName, versionId) => {
        if(appName === "_master") {
            return apps[appName];
        }

        return apps[appName][versionId];
    });
}