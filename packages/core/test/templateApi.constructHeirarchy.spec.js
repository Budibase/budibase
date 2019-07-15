import {getMemoryTemplateApi} from "./specHelpers";
import {errors} from "../src/templateApi";

describe("hierarchy node creation", () => {

    it("> getNewRootLevel > should be initialised with correct members", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        expect(root.name).toBe("root");
        expect(root.type).toBe("root");
        expect(root.children).toEqual([]);
        expect(root.pathRegx).toBeDefined();
        expect(root.pathRegx()).toBe("/");
        expect(root.parent).toBeDefined();
        expect(root.isRoot()).toBeTruthy();
        expect(root.indexes).toEqual([]);
    });

    it("> getNewRecordTemplate > should be initialise with correct members", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        const record  = templateApi.getNewRecordTemplate(root);
        record.name = "child";
        expect(record.type).toBe("record");
        expect(record.children).toEqual([]);
        expect(record.validationRules).toEqual([]);
        expect(record.indexes).toEqual([]);
        expect(record.parent()).toBe(root);
        expect(record.collectionName).toBe("");
        expect(record.allidsShardFactor).toBe(64);
        expect(record.isSingle).toBe(false);

        record.collectionName = "records";
        expect(record.collectionNodeKey()).toBe("/records");
        expect(record.collectionPathRegx()).toBe("/records");
        expect(record.nodeKey()).toBe(`/records/${record.nodeId}-{id}`);
        expect(record.pathRegx()).toBe(`/records/${record.nodeId}-[a-zA-Z0-9_\-]+`);
    });

    it("> getNewSingleRecordTemplate > should set isSingle = true", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        const record  = templateApi.getNewSingleRecordTemplate(root);
        expect(record.isSingle).toBe(true);
    });

    it("> getNewrecordTemplate > should have static pathRegx if is singlerecord", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        const record  = templateApi.getNewSingleRecordTemplate(root);
        record.name = "child";
        expect(record.pathRegx()).toBe("/child");
    });
    

    it("> getNewrecordTemplate > should add itself to parent records's children", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        const parentRecord = templateApi.getNewRecordTemplate(root);
        const record  = templateApi.getNewRecordTemplate(parentRecord);
        expect(parentRecord.children.length).toBe(1);
        expect(parentRecord.children[0]).toBe(record);
    });

    it("> getNewrecordTemplate > should add itself to parents's default index allowedNodeIds", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        const parentRecord = templateApi.getNewRecordTemplate(root);
        const record  = templateApi.getNewRecordTemplate(parentRecord);
        expect(root.indexes[0].allowedRecordNodeIds).toEqual([parentRecord.nodeId]);
        expect(parentRecord.indexes[0].allowedRecordNodeIds).toEqual([record.nodeId]);
    });

    it("> getNewrecordTemplate > should add itself to root's children", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        const record  = templateApi.getNewRecordTemplate(root);
        expect(root.children.length).toBe(1);
        expect(root.children[0]).toBe(record);
    });

    it("> getNewrecordTemplate > should have dynamic pathRegx if parent is record", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        const parent = templateApi.getNewRecordTemplate(root);
        parent.collectionName = "customers"
        const record  = templateApi.getNewRecordTemplate(parent);
        record.name = "child";
        expect(record.pathRegx().startsWith("/customers")).toBe(true);
        expect(record.pathRegx().includes("[")).toBe(true);
    });

    it("> getNewrecordTemplate > should add default index", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        const record = templateApi.getNewRecordTemplate(root, "rec");
        expect(root.indexes.length).toBe(1);
        expect(root.indexes[0].name).toBe("rec_index");
    });

    it("> getNewIndexTemplate > should initialise with correct members", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        const index = templateApi.getNewIndexTemplate(root);
        expect(index.type).toBe("index");
        expect(index.name).toBeDefined();
        expect(index.map).toBeDefined();
        expect(index.filter).toBeDefined();
        expect(index.children).toBeUndefined();
        expect(index.indexType).toBe("ancestor");
        expect(index.getShardName).toBeDefined();
        index.name = "naughty-customers";
        expect(index.pathRegx()).toBe("/naughty-customers");
        expect(index.parent()).toBe(root);
        expect(index.aggregateGroups).toEqual([]);
    });

    it("> getNewIndexTemplate > should add itself to roots indexes", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        const index = templateApi.getNewIndexTemplate(root);
        expect(root.indexes.length).toBe(1);
        expect(root.indexes[0]).toBe(index);
    });

    it("> getNewIndexTemplate > should add itself to record indexes", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        const record = templateApi.getNewRecordTemplate(root);
        const index = templateApi.getNewIndexTemplate(record);
        expect(record.indexes.length).toBe(1);
        expect(record.indexes[0]).toBe(index);
        expect(index.parent()).toBe(record);
    });

    it("should throw exception when no parent supplied, for non root node", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        expect(() => templateApi.getNewIndexTemplate())
        .toThrow(errors.allNonRootNodesMustHaveParent);
        expect(() => templateApi.getNewRecordTemplate())
        .toThrow(errors.allNonRootNodesMustHaveParent);
    });

    it("> adding node > should just add one (bugfix)", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        const parent = templateApi.getNewRecordTemplate(root);
        templateApi.getNewRecordTemplate(parent);

        expect(root.children.length).toBe(1);
        expect(parent.children.length).toBe(1);
    });

    it("> getNewAggregateGroupTemplate > should throw exception when non index supplied as parent", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        expect(() => templateApi.getNewAggregateGroupTemplate(root))
        .toThrow();
    });

    it("> getNewAggregateGroupTemplate > should add itself to index aggregateGroups", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const root = templateApi.getNewRootLevel();
        const record = templateApi.getNewRecordTemplate(root);
        const index = templateApi.getNewIndexTemplate(record);
        const aggregateGroup = templateApi.getNewAggregateGroupTemplate(index);
        expect(index.aggregateGroups.length).toBe(1);
        expect(index.aggregateGroups[0]).toBe(aggregateGroup);
        expect(aggregateGroup.parent()).toBe(index);
    });
});