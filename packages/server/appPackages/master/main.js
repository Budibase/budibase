const { tmpdir } = require("os");
const { join } = require("path");
const uuid = require("uuid/v1");
const { take, takeRight } = require("lodash/fp");
const { splitKey, $, joinKey } = require("budibase-core").common;
const { unzipTarGzPackageToRuntime } = require("../../utilities/targzAppPackage");
const { getRuntimePackageDirectory } = require("../../utilities/runtimePackages");
const { exists } = require("../../utilities/fsawait");
const createInstanceDb = require("../../initialise/createInstanceDb"); 
const { createWriteStream } = require("fs");
const { applictionVersionPackage } = require("../../utilities/createAppPackage");
const { getApisWithFullAccess } = require("../../utilities/budibaseApi");

module.exports = (config) => {
    const datastoreModule  = require(`../../../datastores/datastores/${config.datastore}`);
    return ({
    initialiseInstance : async ({ instance, apis }) => {
        const appKey = $(instance.key, [
            splitKey,
            take(2),
            joinKey
        ]);
        
        const application = await apis.recordApi.load(appKey);

        const dbConfig = await createInstanceDb(
            datastoreModule,
            config.datastoreConfig,
            application.id,
            instance.id
        );

        const versionId = $(instance.version.key, [
            splitKey,
            takeRight(1),
            joinKey
        ]);
        
        const runtimeDir = getRuntimePackageDirectory(
            application.name,
            versionId);
        
        if(!await exists(runtimeDir))
            await downloadAppPackage(apis, instance, application.name, versionId);
        
        instance.datastoreconfig = JSON.stringify(dbConfig);
        instance.isNew = false;
        await apis.recordApi.save(instance);
    },

    createNewUser: async ({user, apis}) => {
        const instance = apis.recordApi.load(user.instance.key);

        const appKey = $(instance.key, [
            splitKey,
            take(2),
            joinKey
        ]);
        
        const application = await apis.recordApi.load(appKey);

        const versionId = $(instance.version.key, [
            splitKey,
            takeRight(1),
            joinKey
        ]);

        const appPackage = applictionVersionPackage(
            application.name,
            versionId);

        const instanceApis = getApisWithFullAccess(
            datastoreModule.getDatastore(instance.datastoreconfig), 
            appPackage);

        const authUser = instanceApis.authApi.getNewUser();
        authUser.name = user.name;
        authUser.accessLevels = [instance.version.defaultAccessLevel];
        await instanceApis.authApi.createUser(authUser);

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