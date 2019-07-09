const createUser = require("./createUser");
const enableUser = require("./enableUser");
const disableUser = require("./disableUser");

module.exports = async (appPackage, masterAppInternal, instanceKey, appName) => {

    const plugin = await constructPlugin(
        masterAppInternal, 
        appName,
        instanceKey
    );

    appPackage.behaviourSources._injected = plugin;

    createActions(appPackage);
    createTriggers(appPackage);
}

const createTriggers = (appPackage) => {
    const appDef = appPackage.appDefinition;
    appDef.triggers.push({
        actionName: 'createUser',
        eventName: 'authApi:createUser:onComplete',
        optionsCreator: 'return {user:context.user};',
        condition: ''
    });
    appDef.triggers.push({
        actionName: 'enableUser',
        eventName: 'authApi:enableUser:onComplete',
        optionsCreator: 'return {username:context.username};',
        condition: ''
    });
    appDef.triggers.push({
        actionName: 'disableUser',
        eventName: 'authApi:disableUser:onComplete',
        optionsCreator: 'return {username:context.username};',
        condition: ''
    });
}

const createActions = (appPackage) => {
    const appDef = appPackage.appDefinition;
    appDef.actions.createUser = {
        name: "createUser",
        behaviourSource: '_injected',
        behaviourName: 'createUser',
        initialOptions: {}
    };
    appDef.actions.createUser = {
        name: "enableUser",
        behaviourSource: '_injected',
        behaviourName: 'enableUser',
        initialOptions: {}
    };
    appDef.actions.createUser = {
        name: "disableUser",
        behaviourSource: '_injected',
        behaviourName: 'disableUser',
        initialOptions: {}
    };
}


const constructPlugin = async (masterAppInternal, appName, instanceKey) => {

    const app = await masterAppInternal.getApplication(appName);
    const initialiseObj = {
        masterAppInternal, app, instanceKey
    };

    return ({
        createUser:createUser(initialiseObj),
        enableUser:enableUser(initialiseObj),
        disableUser:disableUser(initialiseObj)
    });

}