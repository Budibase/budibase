import {isUndefined, has} from "lodash";
import {take} from "lodash/fp";
import {Readable, Writable} from "readable-stream";
import { Buffer } from "safe-buffer";
import {splitKey, joinKey, $} from "../src/common"; 
import {getLastPartInKey} from "../src/templateApi/heirarchy";

const folderMarker = "OH-YES-ITSA-FOLDER-";
const isFolder = val => val.includes(folderMarker);

const getParentFolderKey = key => 
    $(key, [
        splitKey,
        take((splitKey(key).length - 1)),
        joinKey,
    ]);

const getParentFolder = (data,key) => {
    const parentKey = getParentFolderKey(key);
    if(data[parentKey] === undefined)
        throw new Error("Parent folder for " + key + " does not exist (" + parentKey + ")");
    return JSON.parse(data[parentKey]);
}

const addItemToParentFolder = (data, path) => {
    if(getParentFolderKey(path) === "/") return;
    const parentFolder = getParentFolder(data, path);
    parentFolder.items.push(
        getLastPartInKey(path));
    data[getParentFolderKey(path)] = JSON.stringify(parentFolder);
}

export const createFile = data => async (path, content) => {
    if(await exists(data)(path))  {
        throw new Error(path + " already exists");
    }
    addItemToParentFolder(data, path);
    data[path] = content;
};
export const updateFile = data => async (path, content) => {
    // putting this check in to force use of create
    if(!await exists(data)(path)) throw new Error("cannot update " + path + " - does not exist"); 
    data[path] = content;
}

export const writableFileStream = data => async (path) => {
    //if(!await exists(data)(path)) throw new Error("cannot write stream to " + path + " - does not exist"); 
    const stream = Writable();
    stream._write = (chunk, encoding, done) => {
        data[path] = data[path] === undefined 
                     ? [] : data[path];
        data[path] = [...data[path], ...chunk];
        done();
    };
    return stream;
};

export const readableFileStream = data => async (path) => {
    if(!await exists(data)(path)) 
        throw new Error("cannot read stream from " + path + " - does not exist"); 
    const s = new Readable();
    s._read = () => {
        s.push(Buffer.from(data[path]));
        s.push(null);
    }; 
    return s;
};

export const renameFile = data => async (oldKey, newKey) => {
    if(!await exists(data)(oldKey)) throw new Error("cannot rename path: " + oldKey + " ... does not exist");
    if(await exists(data)(newKey)) throw new Error("cannot rename path: " + newKey + " ... already exists");    
    data[newKey] = data[oldKey];
    delete data[oldKey];
};

export const loadFile = data => async (path) => {
    const result = data[path];
    if(isUndefined(result)) throw new Error("Load failed - path " + path + " does not exist");
    return result;
};
export const exists = data => async (path) => has(data, path);
export const deleteFile = data => async (path) => {
    if(!await exists(data)(path)) 
        throw new Error("Cannot delete file, path " + path + " does not exist");
    if(isFolder(data[path])) throw new Error("DeleteFile: Path " + path + " is a folder, not a file");
    const parentFolder = getParentFolder(data, path);
    parentFolder.items = parentFolder.items.filter(i => i !== getLastPartInKey(path));
    data[getParentFolderKey(path)] = JSON.stringify(parentFolder);
    delete data[path];
}
export const createFolder = data => async (path) => {
    if(await exists(data)(path)) throw new Error("Cannot create folder, path " + path + " already exists");
    addItemToParentFolder(data, path);
    data[path] = JSON.stringify({folderMarker, items:[]});
}
export const deleteFolder = data => async (path) => {
    if(!await exists(data)(path)) throw new Error("Cannot delete folder, path " + path + " does not exist");
    if(!isFolder(data[path])) 
        throw new Error("DeleteFolder: Path " + path + " is not a folder");
    delete data[path];
} 

export const getFolderContents = data => async (folderPath) => { 
    if(!isFolder(data[folderPath])) 
        throw new Error("Not a folder: " + folderPath);
    if(!await exists(data)(folderPath))
        throw new Error("Folder does not exist: " + folderPath);
    return JSON.parse(data[folderPath]).items;
};

export default data => {
    return {
        createFile : createFile(data),
        updateFile : updateFile(data),
        loadFile : loadFile(data),
        exists : exists(data),
        deleteFile : deleteFile(data),
        createFolder: createFolder(data),
        deleteFolder: deleteFolder(data),
        readableFileStream: readableFileStream(data),
        writableFileStream: writableFileStream(data),
        renameFile: renameFile(data),
        getFolderContents: getFolderContents(data),
        datastoreType : "memory",
        datastoreDescription: "",
        data 
    };
};