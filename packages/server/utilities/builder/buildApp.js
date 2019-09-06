const { 
    appPackageFolder
} = require("../createAppPackage");
const { componentLibraryInfo } = require("./componentLibraryInfo");
const {
    stat, ensureDir, pathExists,
    constants, copyFile, writeFile,
    readFile
} = require("fs-extra");
const { join } = require("path");
const sqrl = require('squirrelly');

module.exports = async (config, appname, pageName, pages, appdefinition) => {

    const appPath = appPackageFolder(config, appname);    

    await buildClientAppDefinition(
        config, appname,
        appdefinition, componentLibraries, 
        appPath, appRootPath)

    await buildIndexHtml(
        config, appname, appPath, 
        pageName, pages);
    
    await copyClientLib(appPath);

}

const publicPath = async  appPath => join(appPath, "public");
const rootPath = (config, appname) => config.useAppRootPath ? `/${appname}` : "";

const copyClientLib = async appPath => {
    var sourcepath = require.resolve("budibase-client",{
        basedir: appPath
    });
    var destPath = join(publicPath(appPath), "budibase-client.js");

    await copyFile(sourcepath, destPath, constants.COPYFILE_FICLONE);

}

const buildIndexHtml = async (config, appname, appPath, pageName, pages) => {

    
    const appPublicPath = publicPath(appPath);
    const appRootPath = rootPath(config, appname);

    const stylesheetUrl = s => 
        s.indexOf('http://') === 0 || s.indexOf('https://') === 0
        ? s
        : `/${rootPath(config, appname)}/${s}`;


    const templateObj = {
        title = pages[pageName].index.title || "Budibase App",
        favicon = `${appRootPath}/${pages[pageName].index.favicon || "/assets/favicon.png"}`,
        stylesheets = pages.stylesheets.map(stylesheetUrl),
        appRootPath
    }

    const indexHtmlTemplate = await readFile(
        resolve(__dirname, "index.template.html"));

    const indexHtmlPath = join(appPublicPath, "index.html");

    await writeFile(
        indexHtmlPath, 
        sqrl.Render(indexHtmlTemplate, templateObj),
        {flag:"w+"});
}


const buildClientAppDefinition = async (config, appname, appdefinition, pages, appPath) => {

    const componentLibraries = [];
    const appPublicPath = publicPath(appPath);
    const appRootPath = rootPath(config, appname);

    for(let lib of pages.componentLibraries) {
        const info = await componentLibraryInfo(appPath, lib);
        const source = join(info.libDir, info.components._lib);
        const destDir = join(appPublicPath, "lib", info.libDir.replace(appPath, ""));
        await ensureDir(destDir);

        const destPath = join(destDir, info.components._lib);        
        componentLibraries.push(destPath);

        let shouldCopy = !(await pathExists(destPath));
        if(!shouldCopy) {
            const destStat = await stat(destPath);
            const sourceStat = await stat(source);
            shouldCopy = destStat.ctimeMs !== sourceStat.ctimeMs;
        }

        if(shouldCopy) {
            await copyFile(source, destPath, constants.COPYFILE_FICLONE);
        }
        
    }

    const filename = join(appPublicPath, "clientAppDefinition.js");

    await writeFile(filename, 
`window['##BUDIBASE_APPDEFINITION##'] = {
    hierarchy: ${JSON.stringify(appdefinition.hierarchy)},
    componentLibraries: ${JSON.stringify(componentLibraries)},
    appRootPath: '${appRootPath}'
}`);

}