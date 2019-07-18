import {setupApphierarchy,
    basicAppHierarchyCreator_WithFields, 
    basicAppHierarchyCreator_WithFields_AndIndexes} from "./specHelpers";
import {joinKey} from "../src/common";
import {some, isArray, isObjectLike} from "lodash";

describe("recordApi > create > reindex", () => {

    it("should add to default index, when record created", async () => {

        const {recordApi,
        indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);
        const record = recordApi.getNew("/customers", "customer");

        record.surname = "Ledog";
        record.isalive = true;
        record.age = 9;
        record.createddate = new Date();

        await recordApi.save(record);

        const items = await indexApi.listItems("/customer_index");

        expect(items.length).toBe(1);
        expect(items[0].surname).toBe("Ledog");
        expect(items[0].key).toBeDefined();
        expect(items[0].key).toEqual(record.key);
    });

    it("should add to index with filter, when record created and passes filter", async () => {

        const {recordApi,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);
        const record = recordApi.getNew("/customers", "customer");

        record.surname = "Ledog";
        record.isalive = false;
        record.age = 9;
        record.createddate = new Date();

        await recordApi.save(record);

        const items = await indexApi.listItems("/deceased");

        expect(items.length).toBe(1);
        expect(items[0].surname).toBe("Ledog");
        expect(items[0].key).toBeDefined();
        expect(items[0].key).toEqual(record.key);
    });

    it("should not add to index with filter, when record created and fails filter", async () => {

        const {recordApi,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);
        const record = recordApi.getNew("/customers", "customer");

        record.surname = "Ledog";
        record.isalive = true;
        record.age = 9;
        record.createddate = new Date();

        await recordApi.save(record);

        const items = await indexApi.listItems("/deceased");

        expect(items.length).toBe(0);
    });


    it("should be able to add to and list subcollection, after save (i.e. save initialiieses collection)", async () => {
        const {recordApi, indexApi} = 
            await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        
        const customer = recordApi.getNew("/customers", "customer");
        await recordApi.save(customer);
        
        const invoicesCollectionKey = joinKey(customer.key, "invoices");
        const invoice = recordApi.getNew(invoicesCollectionKey, "invoice");
        invoice.totalIncVat = 10.5;
        invoice.createdDate = new Date();
        await recordApi.save(invoice);

        const invoices = await indexApi.listItems(
                            joinKey(customer.key, "invoice_index"));
        
        expect(isArray(invoices)).toBeTruthy();
        expect(invoices.length).toBe(1);
        expect(invoices[0].totalIncVat).toBe(10.5);

    });

    it("should add to global index, when required", async () => {
        const {recordApi, indexApi} = 
            await setupApphierarchy(basicAppHierarchyCreator_WithFields);

        const customer = recordApi.getNew("/customers", "customer");
        customer.surname = "Ledog";
        customer.age = 9;
        customer.isalive = true,
        customer.createdDate = new Date();
        await recordApi.save(customer);

        const customers = await indexApi.listItems("/customersReference");

        expect(isArray(customers)).toBeTruthy();
        expect(customers.length).toBe(1);
        expect(customers[0].name).toBe("Ledog");
    });

    it("should add reference field to index and reparse", async () => {
        const {recordApi, indexApi} = 
            await setupApphierarchy(basicAppHierarchyCreator_WithFields);

        const partner = recordApi.getNew("/partners", "partner");
        partner.businessName = "ACME";
        partner.phone = "098766e6";
        await recordApi.save(partner);

        const customer = recordApi.getNew("/customers", "customer");
        customer.surname = "Ledog";
        customer.age = 9;
        customer.isalive = true,
        customer.createdDate = new Date();
        customer.partner = partner;
        await recordApi.save(customer);

        const customers = await indexApi.listItems("/customer_index");

        expect(customers.length).toBe(1);
        expect(isObjectLike(customer.partner)).toBeTruthy();
        expect(customers[0].partner.key).toBe(partner.key);
        expect(customers[0].partner.name).toBe(partner.businessName);
        expect(customers[0].partner.phone).toBe(partner.phone);
    });

    it("should add to reverse reference index, when required", async () => {
        const {recordApi, indexApi} = 
            await setupApphierarchy(basicAppHierarchyCreator_WithFields);

        const referredByCustomer = recordApi.getNew("/customers", "customer");
        referredByCustomer.surname = "Ledog";
        referredByCustomer.age = 9;
        referredByCustomer.isalive = true,
        referredByCustomer.createdDate = new Date();
        await recordApi.save(referredByCustomer);

        const referredCustomer = recordApi.getNew("/customers", "customer");
        referredCustomer.surname = "Zeecat";
        referredCustomer.age = 9;
        referredCustomer.isalive = true,
        referredCustomer.createdDate = new Date();
        referredCustomer.referredBy = {
            key:referredByCustomer.key, 
            value:referredByCustomer.surname};
        await recordApi.save(referredCustomer);

        const customersReferredTo = await indexApi.listItems(
            joinKey(referredByCustomer.key, "referredToCustomers")
        );

        expect(isArray(customersReferredTo)).toBeTruthy();
        expect(customersReferredTo.length).toBe(1);
        expect(customersReferredTo[0].surname).toBe("Zeecat");
    });

    it("should add to sharded index, when record created, and should add into correct shards", async () => {

        const {recordApi,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);
        
        const record1 = recordApi.getNew("/customers", "customer");
        record1.surname = "Ledog";
        await recordApi.save(record1);

        const record2 = recordApi.getNew("/customers", "customer");
        record2.surname = "Zeecat";
        await recordApi.save(record2);

        const items = await indexApi.listItems("/customersBySurname");

        expect(items.length).toBe(2);
        expect(items[0].surname).toBe("Ledog");
        expect(items[0].key).toEqual(record1.key);

        expect(items[1].surname).toBe("Zeecat");
        expect(items[1].key).toEqual(record2.key);
    });

});

describe("recordApi > delete > reindex", () => {

    it("should remove from default index", async () => {
        const {recordApi,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);
        const record = recordApi.getNew("/customers", "customer");

        record.surname = "Ledog";
        record.isalive = true;
        record.age = 9;
        record.createddate = new Date();

        await recordApi.save(record);
        await recordApi.delete(record.key);

        const itemsAfterDelete= await indexApi.listItems("/customer_index");
        expect(itemsAfterDelete.length).toBe(0);
    });

    
    it("should remove from sharded index", async () => {
        const {recordApi,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);
        
        const record1 = recordApi.getNew("/customers", "customer");
        record1.surname = "Ledog";
        await recordApi.save(record1);

        const record2 = recordApi.getNew("/customers", "customer");
        record2.surname = "Zeecat";
        await recordApi.save(record2);

        await recordApi.delete(record1.key);

        const itemsAfterDelete= await indexApi.listItems("/customersBySurname");
        expect(itemsAfterDelete.length).toBe(1);
        expect(itemsAfterDelete[0].surname).toBe("Zeecat");
    });

    it("should remove from all indexes", async () => {
        const {recordApi,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);
        
        const referredBy = recordApi.getNew("/customers", "customer");
        referredBy.surname = "Zeecat";

        await recordApi.save(referredBy);

        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";
        record.isalive = false;
        record.age = 9;
        record.createddate = new Date();
        record.referredBy = {
            key: referredBy.key,
            value: referredBy.surname
        };

        await recordApi.save(record);
        await recordApi.delete(record.key);

        const itemsAfterDelete= await indexApi.listItems("/customer_index");
        expect(itemsAfterDelete.length).toBe(1);
        expect(itemsAfterDelete[0].surname).toBe("Zeecat");

        const deceasedItemsAfterDelete=
            await indexApi.listItems("/deceased");
        expect(deceasedItemsAfterDelete.length).toBe(0);

        const referredToItemsAfterDelete = 
            await indexApi.listItems(`${referredBy.key}/referredToCustomers`);
        expect(referredToItemsAfterDelete.length).toBe(0);

    });

    it("should only remove relevant record from all indexes", async () => {
        const {recordApi,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);
        const record = recordApi.getNew("/customers", "customer");

        record.surname = "Ledog";
        record.isalive = false;
        record.age = 9;
        record.createddate = new Date();

        await recordApi.save(record);

        const otherRecord = recordApi.getNew("/customers", "customer");
        otherRecord.surname = "Zeecat";
        otherRecord.isalive = false;
        otherRecord.age = 12;
        record.createddate = new Date();

        await recordApi.save(otherRecord);

        await recordApi.delete(record.key);

        const itemsAfterDelete= await indexApi.listItems("/customer_index");
        expect(itemsAfterDelete.length).toBe(1);
        expect(itemsAfterDelete[0].surname).toBe("Zeecat");

        const deceasedItemsAfterDelete=
            await indexApi.listItems("/deceased");
        expect(deceasedItemsAfterDelete.length).toBe(1);
        expect(deceasedItemsAfterDelete[0].surname).toBe("Zeecat");
    });

    it("should remove from global index", async () => {
        const {recordApi, indexApi} = 
            await setupApphierarchy(basicAppHierarchyCreator_WithFields);

        const customer = recordApi.getNew("/customers", "customer");
        customer.surname = "Ledog";
        customer.age = 9;
        customer.isalive = true,
        customer.createdDate = new Date();
        await recordApi.save(customer);
        await recordApi.delete(customer.key);
        const customers = await indexApi.listItems("/customersReference");

        expect(isArray(customers)).toBeTruthy();
        expect(customers.length).toBe(0);
    });
});

describe("recordApi > update > reindex", () => {

    it("should update values in indexes", async () => {
        const {recordApi,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);
        const record = recordApi.getNew("/customers", "customer");

        record.surname = "Ledog";
        record.isalive = false;
        record.age = 9;
        record.createddate = new Date();

        await recordApi.save(record);

        const loadedRecord = await recordApi.load(record.key);
        loadedRecord.surname = "Zeedog";
        await recordApi.save(loadedRecord);

        const itemsDefault = await indexApi.listItems("/customer_index");
        expect(itemsDefault[0].surname).toBe("Zeedog");
        expect(itemsDefault.length).toBe(1);

    });

    it("should update values in sharded index", async () => {
        const {recordApi,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";
        await recordApi.save(record);

        const loadedRecord = await recordApi.load(record.key);
        loadedRecord.surname = "Zeedog";
        await recordApi.save(loadedRecord);

        const itemsDefault = await indexApi.listItems("/customersBySurname");
        expect(itemsDefault[0].surname).toBe("Zeedog");
        expect(itemsDefault.length).toBe(1);

    });

    it("should only update values of relevant item", async () => {
        const {recordApi,
            indexApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);
        const record = recordApi.getNew("/customers", "customer");

        record.surname = "Ledog";
        record.isalive = false;
        record.age = 9;
        record.createddate = new Date();

        await recordApi.save(record);

        const otherRecord = recordApi.getNew("/customers", "customer");
        otherRecord.surname = "Zeecat";
        otherRecord.isalive = false;
        otherRecord.age = 12;
        record.createddate = new Date();

        await recordApi.save(otherRecord);

        const loadedRecord = await recordApi.load(record.key);
        loadedRecord.surname = "Zeedog";
        await recordApi.save(loadedRecord);

        const items = await indexApi.listItems("/customer_index");

        const hasItemWithSurname = sn => 
            some(items, i => i.surname === sn);

        expect(hasItemWithSurname("Zeedog")).toEqual(true);
        expect(hasItemWithSurname("Ledog")).toEqual(false);
        expect(hasItemWithSurname("Zeecat")).toEqual(true);
        expect(items.length).toBe(2);
    });

    it("should update global index", async () => {
        const {recordApi, indexApi} = 
            await setupApphierarchy(basicAppHierarchyCreator_WithFields);

        const customer = recordApi.getNew("/customers", "customer");
        customer.surname = "Ledog";
        customer.age = 9;
        customer.isalive = true,
        customer.createdDate = new Date();
        await recordApi.save(customer);

        const loadedCustomer = await recordApi.load(customer.key);
        loadedCustomer.surname = "Zeecat";
        await recordApi.save(loadedCustomer);

        const customers = await indexApi.listItems("/customersReference");
        expect(isArray(customers)).toBeTruthy();
        expect(customers.length).toBe(1);
        expect(customers[0].name).toBe("Zeecat");
    });

    it("should remove from one reference index and add to another when field changed", async () => {
        const {recordApi, indexApi} = 
        await setupApphierarchy(basicAppHierarchyCreator_WithFields);

        const partner1 = recordApi.getNew("/partners", "partner");
        partner1.businessName = "ACME inc";
        await recordApi.save(partner1);

        const partner2 = recordApi.getNew("/partners", "partner");
        partner2.businessName = "Big Corp ltd";
        await recordApi.save(partner2);

        const customer = recordApi.getNew("/customers", "customer");
        customer.surname = "Ledog";
        customer.partner = {
            key: partner1.key, value: partner1.businessName
        };

        const customerSaved = await recordApi.save(customer);

        customerSaved.partner = {
            key: partner2.key, value: partner2.businessName
        };

        await recordApi.save(customerSaved);

        const partner1Customer = 
            await indexApi.listItems(`${partner1.key}/partnerCustomers`);
        expect(partner1Customer.length).toBe(0);

        const partner2Customer = 
            await indexApi.listItems(`${partner2.key}/partnerCustomers`);
        expect(partner2Customer.length).toBe(1);
    });

    it("should remove from reference index when reference blanked", async () => {
        const {recordApi, indexApi} = 
        await setupApphierarchy(basicAppHierarchyCreator_WithFields);

        const partner1 = recordApi.getNew("/partners", "partner");
        partner1.businessName = "ACME inc";
        await recordApi.save(partner1);

        const customer = recordApi.getNew("/customers", "customer");
        customer.surname = "Ledog";
        customer.partner = {
            key: partner1.key, value: partner1.businessName
        };

        const customerSaved = await recordApi.save(customer);

        customerSaved.partner = {
            key: "", value: ""
        };

        await recordApi.save(customerSaved);

        const partner1Customer = 
            await indexApi.listItems(`${partner1.key}/partnerCustomers`);
        expect(partner1Customer.length).toBe(0);
    });

    it("should remove from reference index when filter no longer passes", async () => {
        const {recordApi, indexApi} = 
        await setupApphierarchy(basicAppHierarchyCreator_WithFields);

        const partner1 = recordApi.getNew("/partners", "partner");
        partner1.businessName = "ACME inc";
        await recordApi.save(partner1);

        const customer = recordApi.getNew("/customers", "customer");
        customer.surname = "Ledog";
        customer.partner = {
            key: partner1.key, value: partner1.businessName
        };

        const customerSaved = await recordApi.save(customer);

        customerSaved.isalive = false;

        await recordApi.save(customerSaved);

        const partner1Customer = 
            await indexApi.listItems(`${partner1.key}/partnerCustomers`);
        expect(partner1Customer.length).toBe(0);
    });

    it("should not add to reference index when filter does not pass", async () => {
        const {recordApi, indexApi} = 
        await setupApphierarchy(basicAppHierarchyCreator_WithFields);

        const partner1 = recordApi.getNew("/partners", "partner");
        partner1.businessName = "ACME inc";
        await recordApi.save(partner1);

        const customer = recordApi.getNew("/customers", "customer");
        customer.surname = "Ledog";
        customer.partner = {
            key: partner1.key, value: partner1.businessName
        };
        customer.isalive = false;

        await recordApi.save(customer);

        const partner1Customer = 
            await indexApi.listItems(`${partner1.key}/partnerCustomers`);
        expect(partner1Customer.length).toBe(0);
    });


    it("should remove from reference index, and not re-added when no longer passes filter, but reference is changed", async () => {
        const {recordApi, indexApi} = 
        await setupApphierarchy(basicAppHierarchyCreator_WithFields);

        const partner1 = recordApi.getNew("/partners", "partner");
        partner1.businessName = "ACME inc";
        await recordApi.save(partner1);

        const partner2 = recordApi.getNew("/partners", "partner");
        partner2.businessName = "Big Corp ltd";
        await recordApi.save(partner2);

        const customer = recordApi.getNew("/customers", "customer");
        customer.surname = "Ledog";
        customer.partner = {
            key: partner1.key, value: partner1.businessName
        };

        const customerSaved = await recordApi.save(customer);

        customerSaved.partner = {
            key: partner2.key, value: partner2.businessName
        };
        customerSaved.isalive = false;

        await recordApi.save(customerSaved);

        const partner1Customer = 
            await indexApi.listItems(`${partner1.key}/partnerCustomers`);
        expect(partner1Customer.length).toBe(0);

        const partner2Customer = 
            await indexApi.listItems(`${partner2.key}/partnerCustomers`);
        expect(partner2Customer.length).toBe(0);
    });

    it("should add to reference index, when reference is changed, and did not previsouly pass filter", async () => {
        const {recordApi, indexApi} = 
        await setupApphierarchy(basicAppHierarchyCreator_WithFields);

        const partner1 = recordApi.getNew("/partners", "partner");
        partner1.businessName = "ACME inc";
        await recordApi.save(partner1);

        const partner2 = recordApi.getNew("/partners", "partner");
        partner2.businessName = "Big Corp ltd";
        await recordApi.save(partner2);

        const customer = recordApi.getNew("/customers", "customer");
        customer.surname = "Ledog";
        customer.partner = {
            key: partner1.key, value: partner1.businessName
        };
        customer.isalive = false;

        const customerSaved = await recordApi.save(customer);

        customerSaved.partner = {
            key: partner2.key, value: partner2.businessName
        };
        customerSaved.isalive = true;

        await recordApi.save(customerSaved);

        const partner1Customer = 
            await indexApi.listItems(`${partner1.key}/partnerCustomers`);
        expect(partner1Customer.length).toBe(0);

        const partner2Customer = 
            await indexApi.listItems(`${partner2.key}/partnerCustomers`);
        expect(partner2Customer.length).toBe(1);
    });

});

describe("referenced object changed", () => {

    it("should update the reference", async () => {

        const { recordApi } = 
        await setupApphierarchy(basicAppHierarchyCreator_WithFields);

        const partner1 = recordApi.getNew("/partners", "partner");
        partner1.businessName = "ACME inc";
        const savedPartner = await recordApi.save(partner1);

        const customer = recordApi.getNew("/customers", "customer");
        customer.surname = "Ledog";
        customer.partner = {
            key: partner1.key, value: partner1.businessName
        };
        await recordApi.save(customer);
        savedPartner.businessName = "A.C.M.E Inc";
        await recordApi.save(savedPartner);

        const updatedCustomer = await recordApi.load(customer.key);

        expect(updatedCustomer.partner.name).toBe(savedPartner.businessName);
    });

});