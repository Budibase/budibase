const {
    getApisWithFullAccess, 
    getApisForSession,
    getMasterApisWithFullAccess
} = require("./budibaseApi");
const getDatastore = require("./datastore");
const getDatabaseManager = require("./databaseManager");
const {$, splitKey} = require("@budibase/core").common;
const { keyBy, last, filter } = require("lodash/fp");
const { 
    masterAppPackage, 
    applictionVersionPackage,
    applictionVersionPublicPaths
 } = require("../utilities/createAppPackage");

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
    const loadApplications = async () => { 
        const apps = await bb.indexApi.listItems("/all_applications");
        applications = $(apps, [
            filter(a => !!a.defaultVersion.key),
            keyBy("name")
        ]);
    }
    await loadApplications();

    const getInstanceDatastore = (instanceDatastoreConfig) => 
        datastoreModule.getDatastore(instanceDatastoreConfig);

    const getCustomSessionId = (appname, sessionId) => 
        isMaster(appname)
        ? bb.recordApi.customId("mastersession", sessionId)
        : bb.recordApi.customId("session", sessionId);

    
    const getApplication = async (nameOrKey, isRetry=false) => {
        if(applications[nameOrKey]) 
            return applications[nameOrKey];

        for(let name in applications) {
            const a = applications[name];
            if(a.key === nameOrKey) return a;
            if(a.id === nameOrKey) return a;
        }

        if(isRetry) return;

        await loadApplications();

        return await getApplication(nameOrKey, true);
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
        
        const userInMaster = await getUser(app.id, username);
        if(!userInMaster) return null;
        
        const instance = await bb.recordApi.load(
            userInMaster.instance.key);
        
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
            const masterPkg = masterAppPackage(context);
            try {
                const session = await bb.recordApi.load(`/sessions/${customId}`);
                return ({
                    instance: await getApisForSession(
                                masterDatastore, 
                                masterAppPackage(context), 
                                session),
                    publicPath: masterPkg.mainUiPath,
                    sharedPath: masterPkg.sharedPath
                });


            } catch(_) {
                return ({
                    instance: null,
                    publicPath: masterPkg.unauthenticatedUiPath,
                    sharedPath: masterPkg.sharedPath
                });
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

                return ({
                    instance: await getApisForSession(
                                    instanceDatastore, 
                                    appPackage, 
                                    session),
                    publicPath: appPackage.mainUiPath,
                    sharedPath: appPackage.sharedPath
                });

            } catch(_) {
                const appPublicPaths = applictionVersionPublicPaths(
                    app.name,
                    app.defaultVersion.id);
                return ({
                    instance:null,
                    publicPath: appPublicPaths.unauthenticatedUiPath,
                    sharedPath: appPublicPaths.sharedPath
                });
            }
        }
    };

    const getUser = async (appId, username ) => {
        const userId = bb.recordApi.customId("user", username);
        try {
            return await bb.recordApi.load(
                    `/applications/${appId}/users/${userId}`);
        } catch(_) {
            //empty
            return;
        }
    }

    const getFullAccessInstanceApiForUsername = async (appname, username) => {

        if(isMaster(appname)) {
            return bb;
        }
        else {
            const app = await getApplication(appname);
            const user = await getUser(app.id, username);

            if(!user) return null;

            const dsConfig = JSON.parse(user.instance.datastoreconfig);
            const instanceDatastore = getInstanceDatastore(
                dsConfig
                );

            const versionId = $((await bb.recordApi.load(user.instance.key)).version.key, [
                splitKey,
                last
            ]);
    
            const appPackage = await applictionVersionPackage(
                context, appname, versionId, user.instance.key);
            
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
                    rangeStartParams:{username}, 
                    rangeEndParams:{username}, 
                    searchPhrase:`username:${username}`
                }
            );

            for(let session of sessions) {
                await bb.recordApi.delete(session.key);
            }
        }
    }

    const disableUser = async (app, username) => {
        await removeSessionsForUser(app.name, username);
        const userInMaster = await getUser(app.id, username);    
        userInMaster.active = false;
        await bb.recordApi.save(userInMaster);
    }

    const enableUser = async (app, username) => {
        const userInMaster = await getUser(app.id, username);    
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
        getUser,
        bbMaster:bb
    });

}