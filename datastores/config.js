import fs from "fs";
import {join} from "path";
import {promisify} from 'es6-promisify'; 
import _rimraf from "rimraf";

const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);
const rimraf = promisify(_rimraf);

const getConfig = async () => {

    const config = {
        local: {
            root: "./output/local/files"
        },
        memory: {
            root:"./output/memory"
        },
        azure: {
            root:"./output/azure"
        }
    };

    await rimraf("./output");
    await mkdir("./output");

    for(let type in config) {
        await mkdir(join("output", type));
    }

    await mkdir("./output/local/files");

    return config;
};


export default getConfig;