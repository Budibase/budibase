import getRecordApi from "./recordApi";
import getCollectionApi from "./collectionApi";
import getIndexApi from "./indexApi";
import getTemplateApi from "./templateApi";
import getAuthApi from "./authApi";
import getActionsApi from "./actionsApi";
import {setupDatastore, createEventAggregator} from "./appInitialise";
import {initialiseActions} from "./actionsApi/initialise"
import {isSomething} from "./common";
import {cleanup} from "./transactions/cleanup";
import {generateFullPermissions} from "./authApi/generateFullPermissions";
import {getApplicationDefinition} from "./templateApi/getApplicationDefinition";
import common from "./common";
import {getBehaviourSources} from "./templateApi/getBehaviourSources";
import hierarchy from "./templateApi/hierarchy";

export const getAppApis = async (store, behaviourSources = null, 
                                cleanupTransactions = null, 
                                getEpochTime = null,
                                crypto = null,
                                appDefinition = null) => {

    store = setupDatastore(store);

    if(!appDefinition)
        appDefinition = await getApplicationDefinition(store)();

    if(!behaviourSources)
        behaviourSources = await getBehaviourSources(store);

    const eventAggregator = createEventAggregator();

    const app = {
        datastore:store,
        crypto,
        publish:eventAggregator.publish,
        hierarchy:appDefinition.hierarchy,
        actions:appDefinition.actions
    };

    const templateApi = getTemplateApi(app);    

    app.cleanupTransactions = isSomething(cleanupTransactions) 
                              ? cleanupTransactions
                              : async () => await cleanup(app);

    app.getEpochTime = isSomething(getEpochTime)
                       ? getEpochTime
                       : async () => (new Date()).getTime();

    const recordApi = getRecordApi(app);
    const collectionApi = getCollectionApi(app);
    const indexApi = getIndexApi(app);
    const authApi = getAuthApi(app);
    const actionsApi = getActionsApi(app);

    const authenticateAs = async (username, password) => {
        app.user = await authApi.authenticate(username, password);
    };

    const withFullAccess = () => {
        app.user = {
            name: "app",
            permissions : generateFullPermissions(app),
            isUser:false,
            temp:false
        }
    };

    const asUser = (user) => {
        app.user = user
    };

    

    let apis = {
        recordApi, 
        templateApi,
        collectionApi,
        indexApi,
        authApi,
        actionsApi,
        subscribe: eventAggregator.subscribe,
        authenticateAs,
        withFullAccess,
        asUser
    };

    apis.actions = initialiseActions(
        eventAggregator.subscribe,
        behaviourSources,
        appDefinition.actions,
        appDefinition.triggers,
        apis);


    return apis;
};

export {events, eventsList} from "./common/events";
export {getTemplateApi} from "./templateApi";
export {getRecordApi} from "./recordApi";
export {getCollectionApi} from "./collectionApi";
export {getAuthApi} from "./authApi";
export {getIndexApi} from "./indexApi";
export {setupDatastore} from "./appInitialise";
export {getActionsApi} from "./actionsApi";
export {initialiseData} from "./appInitialise/initialiseData";
export {getDatabaseManager} from "./appInitialise/databaseManager";
export {hierarchy};
export {common};

export default getAppApis;