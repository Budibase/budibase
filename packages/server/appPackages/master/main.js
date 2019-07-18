const { tmpdir } = require("os");
const { join } = require("path");
const uuid = require("uuid/v1");
const { take, takeRight, last } = require("lodash/fp");
const { splitKey, $, joinKey } = require("budibase-core").common;
const { unzipTarGzPackageToRuntime } = require("../../utilities/targzAppPackage");
const { getRuntimePackageDirectory } = require("../../utilities/runtimePackages");
const { exists } = require("../../utilities/fsawait");
const createInstanceDb = require("../../initialise/createInstanceDb"); 
const { createWriteStream } = require("fs");
const { applictionVersionPackage } = require("../../utilities/createAppPackage");
const { getApisWithFullAccess } = require("../../utilities/budibaseApi");

module.exports = (context) => {
    const { config } = context;
    const datastoreModule  = require(`../../../datastores/datastores/${config.datastore}`);
    return ({
    initialiseInstance : async ({ instance, apis }) => {
        const appKey = $(instance.key, [
            splitKey,
            take(2),
            joinKey
        ]);
        
        const application = await apis.recordApi.load(appKey);

        const versionId = $(instance.version.key, [
            splitKey,
            last
        ]);
        
        const runtimeDir = getRuntimePackageDirectory(
            application.name,
            versionId);

        if(!await exists(runtimeDir))
            await downloadAppPackage(apis, instance, application.name, versionId);
            
        const dbConfig = await createInstanceDb(
            context,
            datastoreModule,
            application,
            instance
        );

        
        instance.datastoreconfig = JSON.stringify(dbConfig);
        instance.isNew = false;
        instance.transactionId = "";

        await apis.recordApi.save(instance);       
    },

    createNewUser: async ({user, apis}) => {
        
        if(!user.createdByMaster) return;

        const instance = await apis.recordApi.load(user.instance.key);

        const appKey = $(instance.key, [
            splitKey,
            take(2),
            joinKey
        ]);
        
        const application = await apis.recordApi.load(appKey);

        const versionId = $(instance.version.key, [
            splitKey,
            last,
        ]);

        const appPackage = await applictionVersionPackage(
            context,
            application.name,
            versionId,
            instance.key);

        const instanceApis = await getApisWithFullAccess(
            datastoreModule.getDatastore(
                JSON.parse(instance.datastoreconfig)), 
            appPackage);

        const authUser = instanceApis.authApi.getNewUser();
        authUser.name = user.name;
        authUser.accessLevels = [instance.version.defaultAccessLevel];
        
        await instanceApis.authApi.createUser(authUser);
    },

    setDefaultVersion : async ({apis, version}) => {
        const appKey = $(version.key, [
            splitKey,
            take(2),
            joinKey
        ]);
        
        const application = await apis.recordApi.load(appKey);

        if(application.defaultVersion.key) return;

        application.defaultVersion = version;

        await apis.recordApi.save(application);
    }

    });
}

const downloadAppPackage = async (apis, instance, appName, versionId) => {
    const inputStream = await apis.recordApi.downloadFile(instance.version.key, "package.tar.gz");

    const tempFilePath = join(tmpdir(), `bbpackage_${uuid()}.tar.gz`);
    const outputStream = createWriteStream(tempFilePath);
    
    await new Promise((resolve,reject) => {
        inputStream.pipe(outputStream);
        outputStream.on('error', reject);
        outputStream.on('finish', resolve);
    });

    await unzipTarGzPackageToRuntime(tempFilePath, appName, versionId);
}