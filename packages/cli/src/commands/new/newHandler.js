const { getAppContext } = require("../../common");
const { 
    getMasterApisWithFullAccess 
} = require("@budibase/server/utilities/budibaseApi");
const { copy, readJSON, writeJSON } = require("fs-extra");
const { resolve, join } = require("path");
const thisPackageJson = require("../../../package.json");
const {exec} = require('child_process');

module.exports = ({name}) => {
    run({name});
}

const run = async (opts) => {
    const context = await getAppContext(opts.config);
    const bb = await getMasterApisWithFullAccess(context);

    const app = bb.recordApi.getNew("/applications", "application");
    app.name = opts.name;

    await bb.recordApi.save(app);
    await createEmtpyAppPackage(opts);

    exec(`cd ${opts.name} && npm install`);
}

const createEmtpyAppPackage = async (opts) => {
    const templateFolder = resolve(
        __dirname, "appPackageTemplate");

    const destinationFolder = resolve(".", opts.name);

    await copy(templateFolder, destinationFolder);

    const packageJsonPath = join(opts.name, "package.json");
    const packageJson = await readJSON(packageJsonPath);

    packageJson.name = opts.name;
    packageJson.dependencies["@budibase/standard-components"] = `^${thisPackageJson.version}`;

    await writeJSON(packageJsonPath, packageJson);

}