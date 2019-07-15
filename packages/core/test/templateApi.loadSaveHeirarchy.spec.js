import {getMemoryTemplateApi} from "./specHelpers";
import {permission} from "../src/authApi/permissions";
const saveThreeLevelHierarchy = async () => {
    const {templateApi, app} = await getMemoryTemplateApi();
    const root = templateApi.getNewRootLevel();
    const record = templateApi.getNewRecordTemplate(root);
    record.name = "customer";
    const surname = templateApi.getNewField("string");
    surname.name = "surname";
    surname.label = "surname";
    templateApi.addField(record, surname);

    await templateApi.saveApplicationHierarchy(root);
    return {templateApi, root, record, app};
};

describe("Load & Save App Hierarchy", () => {

    it("should rehydrate json objects with pathRegx methods", async () => {

        const {templateApi} = await saveThreeLevelHierarchy();
        const {hierarchy} = await templateApi.getApplicationDefinition();

        expect(hierarchy.pathRegx).toBeDefined();
        expect(hierarchy.children[0].pathRegx).toBeDefined();

    });

    it("should rehydrate json objects with parent methods", async () => {

        const {templateApi} = await saveThreeLevelHierarchy();
        const {hierarchy} = await templateApi.getApplicationDefinition();

        expect(hierarchy.parent).toBeDefined();
        expect(hierarchy.children[0].parent).toBeDefined();

    });


    it("should throw error when validation fails", async () => {

        const {templateApi, record, root} = await saveThreeLevelHierarchy();
        record.name = "";
        
        let err;
        try {
            await templateApi.saveApplicationHierarchy(root);
        } catch(e) {
            err = e;
        }
        expect(err).toBeDefined();
        
    });

    it("should load hierarchy with exactly the same members - balls deep", async () => {

        const {templateApi, root} = await saveThreeLevelHierarchy();
        const {hierarchy} = await templateApi.getApplicationDefinition();

        expect(JSON.stringify(hierarchy))
        .toEqual(JSON.stringify(root));
    });

    it("should throw an error when app definition does not exist", async () => {
        let ex;
        try{
            await templateApi.getApplicationDefinition()
        }
        catch(e) {
            ex = e;
        }
        expect(ex).toBeDefined();
    });

    it("should create .config folder on first save ", async () => {
        const {templateApi} = await saveThreeLevelHierarchy();
        expect(await templateApi._storeHandle.exists("/.config")).toBeTruthy();
    });

    it("should throw error when user user does not have permission", async () => {
        const {templateApi, app, root} = await saveThreeLevelHierarchy();
        app.removePermission(permission.writeTemplates.get());
        expect(templateApi.saveApplicationHierarchy(root)).rejects.toThrow(/Unauthorized/);
    });

    it("should not depend on having any other permissions", async () => {
        const {templateApi, app, root} = await saveThreeLevelHierarchy();
        app.withOnlyThisPermission(permission.writeTemplates.get());
        await templateApi.saveApplicationHierarchy(root);
    });

});

describe("save load actions", () => {

    const appDefinitionWithTriggersAndActions = async () => {
        const {templateApi, app} = await saveThreeLevelHierarchy();
        
        const logAction = templateApi.createAction();
        logAction.behaviourName = "log";
        logAction.behaviourSource = "test";
        logAction.name = "log_something";

        const logOnErrorTrigger = templateApi.createTrigger();
        logOnErrorTrigger.actionName = "log_something";
        logOnErrorTrigger.eventName = "recordApi:save:onError";

        return ({
            templateApi, 
            actions:[logAction],
            triggers:[logOnErrorTrigger],
            app
        });

    }

    it("should load actions with exactly the same members", async () => {

        const {templateApi, actions, triggers} = 
            await appDefinitionWithTriggersAndActions();
        
        await templateApi.saveActionsAndTriggers(actions, triggers);

        const appDef = await templateApi.getApplicationDefinition();

        expect(appDef.actions).toEqual(actions);
        expect(appDef.triggers).toEqual(triggers);
    });

    it("should throw error when actions are invalid", async () => {
        const {templateApi, actions, triggers} = 
            await appDefinitionWithTriggersAndActions();
        
        actions[0].name = "";

        let err;
        try {
            await templateApi.saveActionsAndTriggers(actions, triggers);
        } catch (e) {
            err = e;
        }

        expect(err).toBeDefined();
    });

    it("should throw error when triggers are invalid", async () => {
        const {templateApi, actions, triggers} = 
            await appDefinitionWithTriggersAndActions();
        
        triggers[0].eventName = "";

        let err;
        try {
            await templateApi.saveActionsAndTriggers(actions, triggers);
        } catch (e) {
            err = e;
        }

        expect(err).toBeDefined();
    });

    it("should throw error when user user does not have permission", async () => {
        const {templateApi, actions, triggers, app} = 
            await appDefinitionWithTriggersAndActions();
        app.removePermission(permission.writeTemplates.get());
        expect(templateApi.saveActionsAndTriggers(actions, triggers)).rejects.toThrow(/Unauthorized/);
    });

    it("should not depend on having any other permissions", async () => {
        const {templateApi, actions, triggers, app} = 
            await appDefinitionWithTriggersAndActions();
        app.withOnlyThisPermission(permission.writeTemplates.get());
        await templateApi.saveActionsAndTriggers(actions, triggers);
    });

});