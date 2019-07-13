const app = require("../app");
const { rimraf, mkdir } = require("../utilities/fsawait");
const createMasterDb = require("../initialise/createMasterDb");
const request = require("supertest");
const fs = require("fs");
const { masterAppPackage, applictionVersionPackage } = require("../utilities/createAppPackage");
const buildAppContext = require("../initialise/buildAppContext");
var enableDestroy = require('server-destroy');

const masterOwnerName = "test_master";
const masterOwnerPassword = "test_master_pass";

const extraMasterPlugins = {
    test_plugins: {
        outputToFile : ({filename, content}) => {
            fs.writeFile(`./tests/.data/${filename}`, content, {encoding:"utf8"});
        }
    }
}

const customizeMaster = appDefinition => {

    appDefinition.actions.outputToFile = {
        name: 'outputToFile',
        behaviourSource: 'test_plugins',
        behaviourName: 'outputToFile',
        initialOptions: {}
    };

    appDefinition.triggers.push({
        actionName: 'outputToFile',
        eventName: 'authApi:createTemporaryAccess:onComplete',
        optionsCreator: 'return ({filename:"tempaccess" + context.userName, content:context.result})',
        condition: ''
    });

    return appDefinition;
}

const config = {
    datastore: "local",
    datastoreConfig: {
        rootPath: "./tests/.data"
    },
    keys: ["secret1", "secret2"],
    port: 4002,
    latestPackagesFolder: "./appPackages",
    extraMasterPlugins,
    customizeMaster
}


module.exports = () => {

    let server;

    return ({
        start: async () => {
            try {
                await reInitialize();
                const budibaseContext = await buildAppContext(config, true);
                server = await app(budibaseContext);
            } catch(e) {
                console.log(e.stack);
            }
            enableDestroy(server);
        },
        config,
        server:() => server,
        post: (url, body) => postRequest(server,url,body),
        get: (url) => getRequest(server, url),
        credentials: {
            masterOwner: {
                username: masterOwnerName,
                password: masterOwnerPassword,
                cookie: ""
            },
            testAppUser1: {
                username: "testAppUser1",
                password: "user1_instance1_password",
                cookie: ""
            },
            testAppUser2: {
                username: "testAppUser2",
                password: "user1_instance2_password",
                cookie: ""
            }
        },
        apps: {
            testApp1: {
                key:null,
                instance1:null,
                instance2:null,
                version1:null,
            }
        },        
        testAppInfo: {
            name: "testApp"
        },
        destroy: () => server.destroy(),
        masterAppPackage: masterAppPackage({ config }),
        testAppInstance1AppPackage: async (app) => applictionVersionPackage(
            await buildAppContext(config, true), 
            "testApp", 
            app.apps.testApp1.instance1.version.id,
            app.apps.testApp1.instance1.key)
    })
};



const postRequest = (server, url, body) => 
    request(server)
    .post(url)
    .send(body)
    .set('Accept', 'application/json');

const getRequest = (server, url) => 
    request(server)
    .get(url)
    .set('Accept', 'application/json');

const reInitialize = async () => {
    try {
        await rimraf(config.datastoreConfig.rootPath);
    } catch(_){}
    
    await mkdir(config.datastoreConfig.rootPath);

    const datastoreModule = require("../../datastores/datastores/" + config.datastore);
    const budibaseContext = await buildAppContext(config, false);
    await createMasterDb(
        budibaseContext,
        datastoreModule,
        masterOwnerName,
        masterOwnerPassword
    );
}


