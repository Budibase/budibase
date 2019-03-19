import fs from "fs";
import {mkdir} from "fs";
import {join} from "path";
import {promisify} from 'es6-promisify'; 

mkdirp = promisify(mkdir);


const getConfig = async () => {

    const config = {
        local: {
            root: "./output/local/files"
        },
        memory: {}
    };

    try {
        await mkdir("./output");
    } catch(e){}

    for(let type in config) {
        await mkdir(join("output", type));
    }

    await mkdir("./output/local/files");

    return config;
};


export default getConfig;