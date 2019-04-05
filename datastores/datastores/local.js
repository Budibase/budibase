const {promisify} = require('util'); 
const fs = require("fs");
const {join} = require("path");

const readFile = promisify(fs.readFile);
const writeFile = (path, content) => 
    promisify(fs.writeFile)(path, content, "utf8");
const access = promisify(fs.access);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);

const updateFile = root => async (path, file) => 
    await writeFile(
            join(root,path), 
            file
        );

const createFile = updateFile;

const loadFile = root => async (path) => 
        await readFile(
            join(root,path)
        , "utf8");

const exists = root => async (path) => {
    try {
        await access(
            join(root,path)
        );       
    } catch (e) {
        return false;
    }
    return true;
};

const createFolder = root => async (path) => 
    await mkdir(
        join(root, path));
    
module.exports.deleteFile = root => async (path) => 
    await unlink(
        join(root, path)
    );

const deleteFolder = root => async (path) =>
    await rmdir(
        join(root, path));

const readableFileStream = root => async path => 
    fs.createReadStream(
        join(root, path), "utf8"
    );

const writableFileStream = root => async path => 
    fs.createWriteStream(
        join(root, path), "utf8"
    );

const getFolderContents = root => async path => {
    await readdir(
        join(root, path)
    );
};

const renameFile = root => async (oldPath, newPath) => 
    await rename(
        join(root, oldPath),
        join(root, newPath)
    );

const datastoreFolder = (type, productSetId, productId, productInstanceId) => 
    !productSetId ? type
    : !productInstanceId ? `${type}.${productSetId}`
    : `${type}.${productSetId}.${productId}.${productInstanceId}`;

const createEmptyDb = async (dbRootConfig, type, productSetId, productId, productInstanceId) => {
    const folder = datastoreFolder(type, productSetId, productId, productInstanceId);
    await createFolder(dbRootConfig)(folder);
    return folder;
};

const getDatastoreConfig = (dbRootConfig, type, productSetId, productId, productInstanceId) => 
    join(dbRootConfig, 
         datastoreFolder(
            type, productSetId, productId, productInstanceId
         ));

const getMasterDbRootConfig = () => "./data";
const getProductSetDbRootConfig = async (productSetId) => "./data";
const getProductInstanceDbRootConfig = 
    async (productSetId, productId, productInstanceId) => "./data";

module.exports.databaseManager = {
    createEmptyDb, getDatastoreConfig,
    getMasterDbRootConfig, getProductSetDbRootConfig,
    getProductInstanceDbRootConfig
};

module.exports.getDatastore = rootFolderPath => ({
    createFile : createFile(rootFolderPath),
    updateFile : updateFile(rootFolderPath),
    loadFile : loadFile(rootFolderPath),
    exists : exists(rootFolderPath),
    deleteFile : deleteFile(rootFolderPath),
    createFolder: createFolder(rootFolderPath),
    deleteFolder: deleteFolder(rootFolderPath),
    readableFileStream: readableFileStream(rootFolderPath),
    writableFileStream: writableFileStream(rootFolderPath),
    renameFile: renameFile(rootFolderPath),
    getFolderContents: getFolderContents(rootFolderPath),
    createEmptyDb: createEmptyDb(rootFolderPath),
    datastoreType : "local",
    datastoreDescription: rootFolderPath
});
