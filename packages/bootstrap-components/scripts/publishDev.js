const { readdir, stat, copyFile } = require("fs-extra");
const { constants } = require("fs");
const { join, basename } = require("path");

const packagesFolder = "..";

const jsFile = dir => join(dir, "index.js");
const generatorsFile = dir => join(dir, "generators.js");
const jsMapFile = dir => join(dir, "index.js.map");
const sourceJs = jsFile("dist");
const sourceJsMap = jsMapFile("dist");
const componentsFile = "components.json";
const sourceGenerators = generatorsFile("dist");

const appPackages = join(packagesFolder, "server", "appPackages");

const publicMain = appName => join(appPackages, appName, "public", "main", "lib", "node_modules", "@budibase", "bootstrap-components");
const publicUnauth = appName => join(appPackages, appName, "public", "unauthenticated", "lib", "node_modules", "@budibase", "bootstrap-components");
const nodeModulesDist = appName => join(appPackages, appName, "node_modules", "@budibase", "bootstrap-components", "dist");
const nodeModules = appName => join(appPackages, appName, "node_modules", "@budibase", "bootstrap-components");

(async () => {

    const apps = await readdir(appPackages);

    const copySource = file => async toDir => {
        const dest = join(toDir, basename(file));
        try {
            await copyFile(file, dest, constants.COPYFILE_FICLONE);
            console.log(`COPIED ${file} to ${dest}`);
        } catch(e) {
            console.log(`COPY FAILED ${file} to ${dest}: ${e}`);
        }
    }

    const copySourceJs = copySource(sourceJs);
    const copySourceJsMap = copySource(sourceJsMap);
    const copyGenerators = copySource(sourceGenerators);
    const copyComponentsJson = copySource(componentsFile);
    

    for(let app of apps) {
        if(!(await stat(join(appPackages, app))).isDirectory()) continue;

        await copySourceJs(nodeModulesDist(app));
        await copySourceJsMap(nodeModulesDist(app));
        await copyGenerators(nodeModulesDist(app));

        await copyComponentsJson(nodeModules(app));

        await copySourceJs(join(publicMain(app), "dist"));
        await copySourceJsMap(join(publicMain(app), "dist"));
        await copyGenerators(join(publicMain(app), "dist"));


        await copySourceJs(join(publicUnauth(app), "dist"));
        await copySourceJsMap(join(publicUnauth(app), "dist"));
        await copyGenerators(join(publicUnauth(app), "dist"));
    }

})();