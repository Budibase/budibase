const { 
    readJSON, exists 
} = require("fs-extra");
const { resolve } = require("path");

const getLibDir = (appPath, libname) => require.resolve(libname, {
    basedir: appPath
});

const getComponentsFilepath = libPath => 
    resolve(libPath, "components.json");

module.exports.componentsFilepath = (appPath, libname) => 
    getComponentsFilepath(getLibDir(appPath, libname));

module.exports.componentLibraryInfo = async (appPath, libname) => {

    const libDir = getLibDir(appPath, libname);
    const componentsPath = getComponentsFilepath(libDir);
    
    if(!await exists(componentsPath)) {
        const e = new Error(`could not find components definition file at ${componentsPath}`);
        e.statusCode = 404;
        throw e;
    }

    try {
        return ({
            components: await readJSON(componentsPath),
            libDir,
            componentsPath
        });
    } catch(e) {
        const err = `could not parse JSON - ${componentsPath} : ${e.message}`;
        throw new Error(err);
    }
}