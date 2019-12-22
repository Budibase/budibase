import {
setupApphierarchy, 
basicAppHierarchyCreator_WithFields_AndIndexes
} from "./specHelpers";
import {
getRelevantReverseReferenceIndexes,
getRelevantAncestorIndexes
} from "../src/indexing/relevant";
import {some} from "lodash";
import {joinKey} from "../src/common";
import { getRecordInfo } from "../src/recordApi/recordInfo";

describe("getRelevantIndexes", () => {

    it("should get indexes only, when key is root level record", async () => {
        const {appHierarchy} = await setupApphierarchy(
            basicAppHierarchyCreator_WithFields_AndIndexes);
        
        const heirarchalIndexesByPath = getRelevantAncestorIndexes(
            appHierarchy.root, {
                appName:"hello", 
                key: "/settings"
            }
        );

        const reverseReferenceIndexesByPath = getRelevantReverseReferenceIndexes(
            appHierarchy.root, {
                appName:"hello", 
                key: "/settings"
            }
        );

        expect(heirarchalIndexesByPath.length).toBe(0);
        expect(reverseReferenceIndexesByPath.length).toBe(0);
        
    });

    it("should get collection default index, when key is child of root level collection", async () => {
        const {recordApi, 
                appHierarchy} = await setupApphierarchy(
            basicAppHierarchyCreator_WithFields_AndIndexes);
        
        const customer = recordApi.getNew("/customers", "customer");

        const indexes = getRelevantAncestorIndexes(
            appHierarchy.root, customer);

        expect(indexes.length).toBe(4);
        
        const indexExists = key => 
            some(indexes, c => c.indexDir === key);
        
        expect(indexExists("/customer_index")).toBeTruthy();
        expect(indexExists("/deceased")).toBeTruthy();
        expect(indexExists("/customersBySurname")).toBeTruthy();
    });

    it("should ignore index when allowedRecordNodeIds does not contain record's node id", async () => {
        const {recordApi, 
                appHierarchy} = await setupApphierarchy(
            basicAppHierarchyCreator_WithFields_AndIndexes);
        
        const customer = recordApi.getNew("/customers", "customer");
        const invoice = recordApi.getNew(joinKey(customer.key, "invoices"), "invoice");

        const indexes = getRelevantAncestorIndexes(
            appHierarchy.root, invoice);
        
        const indexExists = key => 
            some(indexes, c => c.indexDir === key);

        expect(indexExists("/customersBySurname")).toBeFalsy();
    });

    it("should include index when allowedRecordNodeIds contains record's node id", async () => {
        const {recordApi, 
                appHierarchy} = await setupApphierarchy(
            basicAppHierarchyCreator_WithFields_AndIndexes);
        
        const customer = recordApi.getNew("/customers", "customer");

        const indexes = getRelevantAncestorIndexes(
            appHierarchy.root, customer);

        expect(indexes.length).toBe(4);
        
        const indexExists = key => 
            some(indexes, c => c.indexDir === key);

        expect(indexExists("/customersBySurname")).toBeTruthy();
    });

    it("should get default index and relevant parent index when record is 2 nested collections deep", async () => {
        const {recordApi, appHierarchy} = await setupApphierarchy(
        basicAppHierarchyCreator_WithFields_AndIndexes);

        const nodeid = appHierarchy.customerRecord.nodeId;
        const invoice  = recordApi.getNew(`/customers/${nodeid}-1234/invoices`, "invoice")

        const indexes = getRelevantAncestorIndexes(
            appHierarchy.root, invoice);
        const {dir} = getRecordInfo(appHierarchy.root, `/customers/${nodeid}-1234`);
        expect(indexes.length).toBe(4);
        expect(some(indexes, i => i.indexDir === `/customer_invoices`)).toBeTruthy();
        expect(some(indexes, i => i.indexDir === `${dir}/invoice_index`)).toBeTruthy();
    });

    it("should get reverseReferenceIndex accross hierarchy branches", async () => {
        const {appHierarchy, 
                recordApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);
        
        const partner = recordApi.getNew("/partners", "partner");
        partner.businessName = "acme inc";
        //await recordApi.save(partner);

        const customer = recordApi.getNew("/customers", "customer");
        customer.partner = {key:partner.key, value:partner.businessName};
        //await recordApi.save(customer);
        
        
        const indexes = getRelevantReverseReferenceIndexes(
            appHierarchy.root, customer);
        expect(indexes.length).toBe(1);
        const partnerdir = getRecordInfo(appHierarchy.root, partner.key).dir;
        expect(indexes[0].indexDir)
        .toBe(joinKey(partnerdir, appHierarchy.partnerCustomersReverseIndex.name));


    });

    it("should get reverseReferenceIndex when referencing record in same collection", async () => {
        const {appHierarchy,
                recordApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);
        
        const referredByCustomer = recordApi.getNew("/customers", "customer");
        referredByCustomer.surname = "ledog";

        const referredToCustomer = recordApi.getNew("/customers", "customer");
        referredToCustomer.referredBy = {key:referredByCustomer.key, value:"ledog"};        
        
        const indexes = getRelevantReverseReferenceIndexes(
            appHierarchy.root, referredToCustomer);

        const referredByCustomerDir = getRecordInfo(appHierarchy.root, referredByCustomer.key).dir;
        
        expect(indexes.length).toBe(1);
        expect(indexes[0].indexDir)
        .toBe(joinKey(referredByCustomerDir, appHierarchy.referredToCustomersReverseIndex.name));
    });
});