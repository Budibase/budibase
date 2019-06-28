const { tmpdir } = require("os");
const { join } = require("path");
const uuid = require("uuid/v1");
const { take, takeRight } = require("lodash/fp");
const { splitKey, $ } = require("budibase-core").common;
const { unzipTarGzPackageToRuntime } = require("../../utilities/targzAppPackage");
const { getRuntimePackageDirectory } = require("../../utilities/runtimePackages");
const { exists } = require("../../utilities/fsawait");
const createInstanceDb = require("../../initialise/createInstanceDb"); 

module.exports = (config) => ({
    initialiseInstance : async ({ instance, apis }) => {
    
        const appKey = $(instance.key, [
            splitKey,
            take(2)
        ]);
        
        const application = await apis.recordApi.load(appKey);

        const dbConfig = await createInstanceDb(
            require(config.datastore),
            config.datastoreConfig,
            application.id,
            instance.id
        );

        const versionId = $(instance.version.key, [
            splitKey,
            takeRight(1)
        ]);
        
        const runtimeDir = getRuntimePackageDirectory(
            application.name,
            versionId);
        
        if(!await exists(runtimeDir))
            await downloadAppPackage(instance, application.name, versionId);
        
        instance.datastoreconfig = JSON.stringify(dbConfig);
        instance.isNew = false;
        await apis.recordApi.save(instance);
    }
});

const downloadAppPackage = async (instance, appName, versionId) => {
    const inputStream = apis.recordApi.downloadFile(instance.key, "package.tar.gz");

    const tempFilePath = join(tmpdir(), `bbpackage_${uuid()}.tar.gz`);
    const outputStream = await app.datastore.writableFileStream(
        tempFilePath);
    
    await new Promise((resolve,reject) => {
        inputStream.pipe(outputStream);
        outputStream.on('error', reject);
        outputStream.on('finish', resolve);
    });

    await unzipTarGzPackageToRuntime(tempFilePath, appName, versionId);
}