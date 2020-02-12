const createUser = require("./createUser")
const enableUser = require("./enableUser")
const disableUser = require("./disableUser")

module.exports = async (
  appPackage,
  masterAppInternal,
  appName,
  instanceKey
) => {
  const plugin = await constructPlugin(masterAppInternal, appName, instanceKey)

  appPackage.behaviourSources._injected = plugin

  createActions(appPackage)
  createTriggers(appPackage)
}

const createTriggers = appPackage => {
  const appDef = appPackage.appDefinition
  appDef.triggers.push({
    actionName: "createUser",
    eventName: "authApi:createUser:onComplete",
    optionsCreator: "return {user:context.result};",
    condition: "",
  })
  appDef.triggers.push({
    actionName: "enableUser",
    eventName: "authApi:enableUser:onComplete",
    optionsCreator: "return {username:context.username};",
    condition: "",
  })
  appDef.triggers.push({
    actionName: "disableUser",
    eventName: "authApi:disableUser:onComplete",
    optionsCreator: "return {username:context.username};",
    condition: "",
  })
}

const createActions = appPackage => {
  const appDef = appPackage.appDefinition
  appDef.actions.push({
    name: "createUser",
    behaviourSource: "_injected",
    behaviourName: "createUser",
    initialOptions: {},
  })
  appDef.actions.push({
    name: "enableUser",
    behaviourSource: "_injected",
    behaviourName: "enableUser",
    initialOptions: {},
  })
  appDef.actions.push({
    name: "disableUser",
    behaviourSource: "_injected",
    behaviourName: "disableUser",
    initialOptions: {},
  })
}

const constructPlugin = async (masterAppInternal, appName, instanceKey) => {
  const app = await masterAppInternal.getApplication(appName)
  const initialiseObj = {
    masterAppInternal,
    app,
    instanceKey,
  }

  return {
    createUser: createUser(initialiseObj),
    enableUser: enableUser(initialiseObj),
    disableUser: disableUser(initialiseObj),
  }
}
