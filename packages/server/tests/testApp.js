const app = require("../app");
const { promisify } = require("util");
const rimraf = promisify(require("rimraf"));
const createMasterDb = require("../initialise/createMasterDb");
const request = require("supertest");
const fs = require("fs");
var enableDestroy = require('server-destroy');

const mkdir = promisify(fs.mkdir);
const masterOwnerName = "test_master";
const masterOwnerPassword = "test_master_pass";

const config = {
    datastore: "local",
    datastoreConfig: {
        rootPath: "./tests/.data"
    },
    keys: ["secret1", "secret2"],
    port: 4002
}


module.exports = () => {

    let server;

    return ({
        start: async () => {
            await reInitialize();
            server = await app(config);
            enableDestroy(server);
        },
        config,
        server:() => server,
        post: (url, body) => postRequest(server,url,body),
        masterAuth: {
            username: masterOwnerName,
            password: masterOwnerPassword
        },
        destroy: () => server.destroy()
    })
};

const postRequest = (server, url, body) => 
    request(server)
    .post(url)
    .send(body)
    .set('Accept', 'application/json');


const reInitialize = async () => {
    try {
        await rimraf(config.datastoreConfig.rootPath);
    } catch(_){}
    
    await mkdir(config.datastoreConfig.rootPath);

    const datastoreModule = require("../../datastores/datastores/" + config.datastore);
    await createMasterDb(
        datastoreModule,
        config.datastoreConfig,
        masterOwnerName,
        masterOwnerPassword 
    );
}

