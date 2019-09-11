const { 
    appPackageFolder
} = require("../createAppPackage");
const { componentLibraryInfo } = require("./componentLibraryInfo");
const {
    stat, ensureDir, pathExists,
    constants, copyFile, writeFile,
    readFile
} = require("fs-extra");
const { join, resolve, dirname } = require("path");
const sqrl = require('squirrelly');

module.exports = async (config, appname, pages, appdefinition) => {

    const appPath = appPackageFolder(config, appname);    

    await buildClientAppDefinition(
        config, appname,
        appdefinition, 
        appPath, pages, "main");

    await buildClientAppDefinition(
        config, appname,
        appdefinition, 
        appPath, pages, "unauthenticated")

    await buildIndexHtml(
        config, appname, appPath, 
        pages, "main");

    await buildIndexHtml(
        config, appname, appPath, 
        pages, "unauthenticated");

    await copyClientLib(appPath, "main");
    await copyClientLib(appPath, "unauthenticated");

}

const publicPath = (appPath, pageName) => join(appPath, "public", pageName);
const rootPath = (config, appname) => config.useAppRootPath ? `/${appname}` : "";

const copyClientLib = async (appPath, pageName) => {
    var sourcepath = require.resolve("@budibase/client",{
        paths: [appPath]
    });
    var destPath = join(publicPath(appPath, pageName), "budibase-client.js");

    await copyFile(sourcepath, destPath, constants.COPYFILE_FICLONE);

}

const buildIndexHtml = async (config, appname, appPath, pages, pageName) => {

    
    const appPublicPath = publicPath(appPath, pageName);
    const appRootPath = rootPath(config, appname);

    const stylesheetUrl = s => 
        s.indexOf('http://') === 0 || s.indexOf('https://') === 0
        ? s
        : `/${rootPath(config, appname)}/${s}`;

    const templateObj = {
        title: pages[pageName].index.title || "Budibase App",
        favicon: `${appRootPath}/${pages[pageName].index.favicon || "/assets/favicon.png"}`,
        stylesheets: (pages.stylesheets || []).map(stylesheetUrl),
        appRootPath
    }

    const indexHtmlTemplate = await readFile(
        resolve(__dirname, "index.template.html"), "utf8");

    const indexHtmlPath = join(appPublicPath, "index.html");

    const indexHtml = sqrl.Render(indexHtmlTemplate, templateObj)

    await writeFile(
        indexHtmlPath, 
        indexHtml,
        {flag:"w+"});
    
}


const buildClientAppDefinition = async (config, appname, appdefinition, appPath, pages, pageName) => {

    
    const appPublicPath = publicPath(appPath, pageName);
    const appRootPath = rootPath(config, appname);

    
    const componentLibraries = [];

    for(let lib of pages.componentLibraries) {
        const info = await componentLibraryInfo(appPath, lib);
        const libFile = info.components._lib || "index.js";
        const source = join(info.libDir, libFile); 
        const moduleDir = join(appPublicPath, "lib", info.libDir.replace(appPath, ""));
        const destPath = join(moduleDir, libFile);   

        await ensureDir(dirname(destPath));
             
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

    const clientAppDefObj = {
        hierarchy: appdefinition.hierarchy,
        componentLibraries: pages.componentLibraries,
        appRootPath: appRootPath,
        props: appdefinition.props[pageName]
    }
    
    await writeFile(filename, 
            `window['##BUDIBASE_APPDEFINITION##'] = ${JSON.stringify(clientAppDefObj)}`);

}