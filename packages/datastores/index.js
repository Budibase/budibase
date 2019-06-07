import local from "./datastores/local";
import azureBlob from "./datastores/azure-blob";
import memory from "./datastores/memory";
import getConfig from "./config";
import tests from "./tests";

const initialise = async () => {

    const type = process.argv[2];
    const config = (await getConfig())[type];

    switch (type) {
        case "local":
            return {datastore:local(config.root), config};
        case "memory":
            return {datastore:memory(config), config};
        case "azure":
            return {datastore:azureBlob(config), config};
        default:
            break;
    }
}

initialise()
.then(init => {
    return tests(init.datastore, init.config);
})
.then(_ => console.log("done"))
.catch(e => console.log(e));
