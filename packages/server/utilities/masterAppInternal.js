const {
    getApisWithFullAccess, 
    getApisForSession,
    getMasterApisWithFullAccess
} = require("./budibaseApi");
const getDatastore = require("./datastore");
const getDatabaseManager = require("./databaseManager");
const {$, splitKey} = require("budibase-core").common;
const { keyBy, last } = require("lodash/fp");
const { masterAppPackage, applictionVersionPackage } = require("../utilities/createAppPackage");

const isMaster = appname => appname === "_master";

module.exports = async (context) => {

    const { config } = context; 
    const datastoreModule = getDatastore(config);

    const databaseManager = getDatabaseManager(
        datastoreModule,
        config.datastoreConfig);

    const masterDatastore = datastoreModule.getDatastore(
        databaseManager.masterDatastoreConfig);

    const bb = await getMasterApisWithFullAccess(context); 

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
            session.username = username;
            await bb.recordApi.save(session);   
            return session;
        }

        const app = await getApplication(appname);
        
        const userInMaster = await getUser(bb, app.id, username);
        if(!userInMaster) return null;
        
        const instance = await bb.recordApi.load(
            userInMaster.instanceKey);
        
        const versionId = $(instance.version.key, [
            splitKey,
            last
        ]);

        const dsConfig = JSON.parse(instance.datastoreconfig);
        const appPackage = await applictionVersionPackage(
            context, appname, versionId, instance.key);
        const bbInstance = await getApisWithFullAccess(
            datastoreModule.getDatastore(dsConfig),
            appPackage
        );

        const authUser = await bbInstance.authApi.authenticate(username, password);

        if(!authUser) {
            return null;
        }

        const session = bb.recordApi.getNew(`/applications/${app.id}/sessions`, "session");
        bb.recordApi.setCustomId(session, sessionId);
        session.user_json = JSON.stringify(authUser);
        session.instanceDatastoreConfig = instance.datastoreconfig;
        session.instanceKey = instance.key;
        session.username = username;
        session.instanceVersion = instance.version.key;
        await bb.recordApi.save(session);        
        return session;
    };

    const getInstanceApiForSession = async (appname, sessionId) => {
        if(isMaster(appname)) {
            const customId = bb.recordApi.customId("mastersession", sessionId);
            try {
                const session = await bb.recordApi.load(`/sessions/${customId}`);
                return await getApisForSession(
                    masterDatastore, 
                    masterAppPackage(context), 
                    session);

            } catch(_) {
                return null;
            }
        }
        else {
            const app = await getApplication(appname);
            const customId = bb.recordApi.customId("session", sessionId);
            try {
                const session = await bb.recordApi.load(`/applications/${app.id}/sessions/${customId}`);
                const dsConfig = JSON.parse(session.instanceDatastoreConfig);
                const instanceDatastore = getInstanceDatastore(dsConfig)
                const versionId = $(session.instanceVersion,[
                    splitKey,
                    last
                ]);

                const appPackage = await applictionVersionPackage(
                    context, appname, versionId, session.instanceKey);

                return await getApisForSession(
                    instanceDatastore, 
                    appPackage, 
                    session);
            } catch(_) {
                return null;
            }
        }
    };

    const getUser = async (bb, appId, username ) => {
        const matches = await bb.indexApi.listItems(
            `/applications/${appId}/user_name_lookup`,
            {
                rangeStartParams:{name:username}, 
                rangeEndParams:{name:username}, 
                searchPhrase:`name:${username}`
            }
        );
        if(matches.length !== 1) return;
        return matches[0];
    }

    const getFullAccessInstanceApiForUsername = async (appname, username) => {

        if(isMaster(appname)) {
            return bb;
        }
        else {
            const app = await getApplication(appname);
            const user = await getUser(bb, app.id, username);

            if(!user) return null;

            const dsConfig = JSON.parse(user.instanceDatastoreConfig);
            const instanceDatastore = getInstanceDatastore(
                dsConfig
                );

            const versionId = $((await bb.recordApi.load(user.instanceKey)).version.key, [
                splitKey,
                last
            ]);
    
            const appPackage = await applictionVersionPackage(
                context, appname, versionId, user.instanceKey);
            
            return await getApisWithFullAccess(
                instanceDatastore,
                appPackage);
        }

    };

    const removeSessionsForUser = async (appname, username) => {
        if(isMaster(appname)) {
            const sessions = await bb.indexApi.listItems(
                "/mastersessions_by_user",
                {
                    rangeStartParams:{username}, 
                    rangeEndParams:{username},
                    searchPhrase:`username:${username}`
                }
            );

            for(let session of sessions) {
                await bb.recordApi.delete(session.key);
            }
        }
        else {
            const app = await getApplication(appname);
            const sessions = await bb.indexApi.listItems(
                `/applications/${app.id}/sessions_by_user`,
                {
                    rangeStartParams:{name:username}, 
                    rangeEndParams:{name:username}, 
                    searchPhrase:`username:${username}`
                }
            );

            for(let session of sessions) {
                await bb.recordApi.delete(session.key);
            }
        }
    }

    const disableUser = async (app, username) => {
        await removeSessionsForUser(appName, username);
        const userInMaster = await getUser(bb, app.id, username);    
        userInMaster.active = false;
        await bb.recordApi.save(userInMaster);
    }

    const enableUser = async (app, username) => {
        const userInMaster = await getUser(bb, app.id, username);    
        userInMaster.active = true;
        await bb.recordApi.save(userInMaster);
    }

    return ({
        getApplication,
        getSession,
        deleteSession, 
        authenticate,
        getInstanceApiForSession,
        getFullAccessInstanceApiForUsername,
        removeSessionsForUser,
        disableUser,
        enableUser,
        bbMaster:bb
    });

}