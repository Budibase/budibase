import {setupApphierarchy,
    basicAppHierarchyCreator_WithFields_AndIndexes} from "./specHelpers";
import {joinKey} from "../src/common";
import {getLockFileContent} from "../src/common/lock";
import {some, isArray} from "lodash";
import {cleanup} from "../src/transactions/cleanup";
import {LOCK_FILE_KEY} from "../src/transactions/transactionsCommon";
import { getRecordInfo } from "../src/recordApi/recordInfo";

describe("cleanup transactions", () => {

    it("testing disable of cleanupTransactions, just for test purposes", async () => {
        const {recordApi, app,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes, true);
        const record1 = recordApi.getNew("/customers", "customer");
        record1.surname = "Zeecat";
    
        const record2 = recordApi.getNew("/customers", "customer");
        record2.surname = "Ledog";
    
        await recordApi.save(record1);
        await recordApi.save(record2);
    
        const records = await indexApi.listItems("/customer_index");
    
        // cleanup should be disabled as above
        expect(records.length).toBe(0);
    });

    it("should index 2 new create transactions", async () => {
        // cleanup is disabled, with true parameter
        const {recordApi, app,
                indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes, true);
        const record1 = recordApi.getNew("/customers", "customer");
        record1.surname = "Zeecat";

        const record2 = recordApi.getNew("/customers", "customer");
        record2.surname = "Ledog";

        await recordApi.save(record1);
        await recordApi.save(record2);
        
        await cleanup(app);

        const records = await indexApi.listItems("/customer_index");
        expect(records.length).toBe(2);
        expect(some(records, r => r.surname === "Zeecat")).toBeTruthy();
        expect(some(records, r => r.surname === "Ledog")).toBeTruthy();
    });

    it("when create and update transaction for the same record, index should be latest record", async () => {

        const {recordApi, app,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes, true);
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";

        const savedRecord = await recordApi.save(record);

        savedRecord.surname = "Zeecat";
        await recordApi.save(savedRecord);
        
        await cleanup(app);

        const records = await indexApi.listItems("/customer_index");
        expect(records.length).toBe(1);
        expect(some(records, r => r.surname === "Zeecat")).toBeTruthy();

    });

    it("should choose current version of record when multiple update transactions found", async () => {

        const {recordApi, app,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes, true);
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";

        const savedRecord = await recordApi.save(record);

        savedRecord.surname = "Zeecat";
        await recordApi.save(savedRecord);

        savedRecord.surname = "Afish";
        await recordApi.save(savedRecord);

        savedRecord.surname = "Lelapin";
        await recordApi.save(savedRecord);
        
        await cleanup(app);

        const records = await indexApi.listItems("/customer_index");
        expect(records.length).toBe(1);
        expect(some(records, r => r.surname === "Lelapin")).toBeTruthy();

    });

    it("should not reindex when transactionId does not match that of the record", async () => {

        const {recordApi, app, 
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes, true);
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";

        const savedRecord = await recordApi.save(record);

        await cleanup(app);

        savedRecord.surname = "Zeecat";
        await recordApi.save(savedRecord);

        savedRecord.transactionId = "something else";

        const recordInfo = getRecordInfo(app.hierarchy, savedRecord.key);
        await recordApi._storeHandle.updateJson(
            recordInfo.child("record.json"), 
            savedRecord);
        
        await cleanup(app);

        const records = await indexApi.listItems("/customer_index");
        expect(records.length).toBe(1);
        expect(records[0].surname).toBe("Ledog");

    });

    it("should not reindex when transactionId does not match that of the record, and has multiple transactions", async () => {

        const {recordApi, app, 
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes, true);
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";

        const savedRecord = await recordApi.save(record);

        await cleanup(app);

        savedRecord.surname = "Zeecat";
        await recordApi.save(savedRecord);

        savedRecord.surname = "Lefish";
        await recordApi.save(savedRecord);

        savedRecord.transactionId = "something else";
        
        const recordInfo = getRecordInfo(app.hierarchy, savedRecord.key);
        await recordApi._storeHandle.updateJson(
            recordInfo.child("record.json"), 
            savedRecord);
        
        await cleanup(app);

        const records = await indexApi.listItems("/customer_index");
        expect(records.length).toBe(1);
        expect(records[0].surname).toBe("Ledog");

    });

    it("should remove from index when delete and update transactions exists", async () => {
        const {recordApi, app,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes, true);
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";

        const savedRecord = await recordApi.save(record);

        await cleanup(app);

        savedRecord.surname = "Zeecat";
        await recordApi.save(savedRecord);
        await recordApi.delete(savedRecord.key);
        await cleanup(app);

        const records = await indexApi.listItems("/customer_index");
        expect(records.length).toBe(0);
    });

    it("should not add to index when create and delete found", async () => {
        const {recordApi, app,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes, true);
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";

        const savedRecord = await recordApi.save(record);
        await recordApi.delete(savedRecord.key);
        await cleanup(app);

        const records = await indexApi.listItems("/customer_index");
        expect(records.length).toBe(0);
    });

    it("should correctly remove from indexes, when multiple update transactions exist", async() => {
        const {recordApi, app,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes, true);
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";
        record.isalive = false;
        const savedRecord = await recordApi.save(record);
        await cleanup(app);

        const preUpdateRecords = await indexApi.listItems("/deceased");
        expect(preUpdateRecords.length).toBe(1);

        savedRecord.surname = "Ledog";
        await recordApi.save(savedRecord);
        savedRecord.isalive = true;
        await recordApi.save(savedRecord);

        await cleanup(app);
        const records = await indexApi.listItems("/deceased");
        expect(records.length).toBe(0);
    });

    it("should not add to index when created, then updated to be filtered out of index", async() => {
        const {recordApi, app,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes, true);
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";
        record.isalive = false;
        const savedRecord = await recordApi.save(record);
        savedRecord.surname = "Ledog";
        savedRecord.isalive = true;
        await recordApi.save(savedRecord);

        await cleanup(app);
        
        const records = await indexApi.listItems("/deceased");
        expect(records.length).toBe(0);
    });

    it("should do nothing when lockfile exists", async() => {
        const {recordApi, app,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes, true);
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";
        await recordApi.save(record);
        const currentTime = await app.getEpochTime();
        await recordApi._storeHandle.createFile(
            LOCK_FILE_KEY, 
            getLockFileContent(30000, (currentTime + 30000))
        );

        await cleanup(app);
        
        let records = await indexApi.listItems("/customer_index");
        expect(records.length).toBe(0);

        await recordApi._storeHandle.deleteFile(LOCK_FILE_KEY);
        await cleanup(app);
        records = await indexApi.listItems("/customer_index");
        expect(records.length).toBe(1);

    });

    it("should take control when lockfile is timedout", async() => {
        const {recordApi, app,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes, true);
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";
        await recordApi.save(record);
        await recordApi._storeHandle.createFile(
            LOCK_FILE_KEY, 
            getLockFileContent(30000, (new Date(1990,1,1,0,0,0,0).getTime()))
        );

        await cleanup(app);
        
        let records = await indexApi.listItems("/customer_index");
        expect(records.length).toBe(1);

    });


})