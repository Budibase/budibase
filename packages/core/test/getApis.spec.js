import {getAppApis} from "../src";
import {getMemoryTemplateApi, 
    createAppDefinitionWithActionsAndTriggers} from "./specHelpers";
import {isFunction} from "lodash";

describe("getAppApis", () => {

    const getMemoryAppApis = async () => {
        const {templateApi} = getMemoryTemplateApi();
        const rootNode = templateApi.getNewRootLevel();
        await templateApi.saveApplicationHierarchy(rootNode);

        return await getAppApis(templateApi._storeHandle, {});
    }

    it("should return api factory functions", async () => {
        const apis = await getMemoryAppApis();
        expect(apis.recordApi).toBeDefined();
        expect(apis.templateApi).toBeDefined();
        expect(apis.collectionApi).toBeDefined();
        expect(apis.indexApi).toBeDefined();
        expect(apis.subscribe).toBeDefined();
        expect(apis.authApi).toBeDefined();
    });

});


describe("getAppApis > initialiseActions", () => {

    it("should expose actions when all sources and behvaviours are present", async () => {
        const {logs, emails, 
            call_timers, behaviourSources,
            templateApi} = await createAppDefinitionWithActionsAndTriggers();
        const {actions} = await getAppApis(
            templateApi._storeHandle, behaviourSources);

        actions.sendEmail("email");
        actions.measureCallTime("calltime");
        actions.logMessage("message");

        expect(isFunction(actions.sendEmail)).toBeTruthy();
        expect(isFunction(actions.measureCallTime)).toBeTruthy();
        expect(isFunction(actions.logMessage)).toBeTruthy();

    });

    it("should throw exception when behaviour source is missing", async () => {
        const {behaviourSources, templateApi} = await createAppDefinitionWithActionsAndTriggers();
        delete behaviourSources["my-custom-lib"];
        
        let ex;

        try {
            await getAppApis(
                templateApi._storeHandle, behaviourSources);
        }
        catch (e) {
            ex = e;
            expect(e.message).toContain("behaviour");
        }

        expect(ex).toBeDefined();
        
    });

    it("should throw exception when behaviour is missing", async () => {
        const {behaviourSources, templateApi} = await createAppDefinitionWithActionsAndTriggers();
        delete behaviourSources["my-custom-lib"]["send_email"];
        
        let ex;

        try {
            await getAppApis(
                templateApi._storeHandle, behaviourSources);
        }
        catch (e) {
            expect(e.message).toContain("behaviour");
            ex = e;
        }

        expect(ex).toBeDefined();
        
    });

});