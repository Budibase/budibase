import {getMemoryStore} from "./specHelpers";
import {createIndexFile} from "../src/indexing/sharding";
import {uniqueIndexName} from "../src/indexing/read";
import {includes} from "lodash";

describe("indexing.createIndexFile", () => {

    it("should create an empty document <indexkey>.csv", async () => {
        const datastore = getMemoryStore();

        const index = {map : "return {name: record.name, age: record.age}", filter:""};
        const indexKey = `/customers/hello`;
        await datastore.createFolder("/customers");
        await createIndexFile(datastore, indexKey, index);

        const savedIndex = await datastore.loadFile(indexKey);
        
        expect(savedIndex).toBe("");
    });

});