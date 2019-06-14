const {getApisWithFullAccess, getApisForSession} = require("./budibaseApi");
const getDatastore = require("./datastore");
const getDatabaseManager = require("./databaseManager");
const {$} = require("budibase-core").common;
const {keyBy} = require("lodash/fp");
const {unauthorized} = require("./exceptions");

const isMaster = appname => appname === "_master";

module.exports = async (config) => {

    const datastoreModule = getDatastore(config);

    const databaseManager = getDatabaseManager(
        datastoreModule,
        config.datastoreConfig);


    const masterDatastore = datastoreModule.getDatastore(
        databaseManager.masterDatastoreConfig);

    const bb = await getApisWithFullAccess(masterDatastore); 

    let applications;
    const loadApplications = async () => 
        applications = $(await bb.indexApi.listItems("/all_applications"), [
            keyBy("name")
        ]);
    await loadApplications();

    const getInstanceDatastore = (instanceDatastoreConfig) => 
        datastoreModule.getDatastore(instanceDatastoreConfig);

    const getCustomSessionId = (appname, sessionId) => 
        isMaster(appname)
        ? bb.recordApi.customId("mastersession", sessionId)
        : bb.recordApi.customId("session", sessionId);

    
    const getApplication = async (name) => {
        if(applications[name]) 
            return applications[name];

        await loadApplications();

        return applications[name];
    };

    const getSession = async (sessionId, appname) => {
        const customSessionId = getCustomSessionId(appname, sessionId);
        if(isMaster(appname)) {
            return await bb.recordApi.load(`/sessions/${customSessionId}`);
        } 
        else {
            const app = await getApplication(appname);
            return await bb.recordApi.load(`/applications/${app.id}/sessions/${customSessionId}`);
        }
    };

    const deleteSession = async (sessionId, appname) => {
        const customSessionId = getCustomSessionId(appname, sessionId);
        if(isMaster(appname)) {
            return await bb.recordApi.delete(`/sessions/${customSessionId}`);
        } 
        else {
            const app = await getApplication(appname);
            return await bb.recordApi.delete(`/applications/${app.id}/sessions/${customSessionId}`);
        }
    };

    const authenticate = async (sessionId, appname, username, password, instanceName="default") => {

        if(isMaster(appname)) {
            const authUser = await bb.authApi.authenticate(username, password);
            if(!authUser) {
                return null;
            }

            const session = bb.recordApi.getNew("/sessions", "mastersession");
            bb.recordApi.setCustomId(session, sessionId);
            session.user_json = JSON.stringify(authUser);
            await bb.recordApi.save(session);   
            return session;
        }

        const app = await getApplication(appname);
        
        const userInMaster = await bb.indexApi.listItems(
            `/applications/${app.id}/users_by_name`,
            {name:username}
        ).find(u => u.name === username);
        
        const instance = await bb.recordApi.load(
            userInMaster.instance.key);
        
        const bbInstance = await getApisWithFullAccess(
            datastoreModule.getDatastore(instance.datastoreconfig));

        const authUser = await bbInstance.authApi.authenticate(username, password);

        if(!authUser) {
            return null;
        }

        const session = bb.recordApi.getNew(`/applications/${app.id}/sessions`, "session");
        bb.recordApi.setCustomId(session, sessionId);
        session.user_json = JSON.stringify(authUser);
        session.instanceDatastoreConfig = instance.datastoreconfig;
        await bb.recordApi.save(session);        
        return session;
    };

    const getInstanceApiForSession = async (appname, sessionId) => {
        if(isMaster(appname)) {
            const customId = bb.recordApi.customId("mastersession", sessionId);
            const session = await bb.recordApi.load(`/sessions/${customId}`);
            return await getApisForSession(masterDatastore, session);
        }
        else {
            const app = await getApplication(appname);
            const customId = bb.recordApi.customId("session", sessionId);
            const session = await bb.recordApi.load(`/applications/${app.id}/sessions/${customId}`);
            const instanceDatastore = getInstanceDatastore(session.instanceDatastoreConfig)
            return await getApisForSession(instanceDatastore, session);
        }
    }

    return ({
        getApplication,
        getSession,
        deleteSession, 
        authenticate,
        getInstanceApiForSession
    });

}