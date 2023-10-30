import { v4 } from "uuid"
import { Component } from "builder/store/screenTemplates/utils/Component"
import { Screen } from "builder/store/screenTemplates/utils/Screen"
import { get } from "svelte/store"

const getDocId = () => {
  return v4().replace(/-/g, "")
}

export const getScreenDocId = () => {
  return `screen_${getDocId()}`
}

export const getScreenFixture = () => {
  return new Screen()
}

export const getComponentFixture = type => {
  if (!type) {
    return null
  }
  return new Component(type)
}

export const COMPONENT_DEFINITIONS = {
  form: {
    name: "Form",
    icon: "Form",
    hasChildren: true,
    illegalChildren: ["section", "form", "formblock"],
  },
  formblock: {
    name: "Form Block",
    block: true,
  },
  container: {
    name: "Container",
  },
}

export const getFakeScreenPatch = store => {
  return async (patchFn, screenId) => {
    const target = get(store).screens.find(screen => screen._id === screenId)

    patchFn(target)

    await store.replace(screenId, target)
  }
}

export const componentMap = () => {
  return Object.keys(COMPONENT_DEFINITIONS).reduce((acc, key) => {
    const def = COMPONENT_DEFINITIONS[key]
    acc[`@budibase/standard-components/${key}`] = def
    return acc
  }, {})
}

export const getPluginFixture = pluginName => {
  const fakeName = pluginName || v4().replace(/-/g, "")
  return {
    _id: `plg_${fakeName}`,
    name: fakeName,
    version: "1.0.0",
    hash: v4().replace(/-/g, ""),
    jsUrl: `/files/signed/plugins/${fakeName}/plugin.min.js`,
  }
}

export const generateFakeRoutes = screens => {
  return {
    routes: screens.reduce((acc, screen, idx) => {
      let routing = screen.routing
      let route = routing.route || "/screen_" + idx
      acc[route] = {
        subpaths: {
          [route]: {
            screens: {
              [routing.roleId]: screen._id,
            },
          },
        },
      }
      return acc
    }, {}),
  }
}

// Context
// export const screenStoreFixture = test.extend({
//   screamStore: createScreenStore(),
// })

export const generateAppPackage = ({
  plugins = 0,
  version = "1.0.0",
  upgradableVersion,
  revertableVersion,
  appValidation = true,
  name = "Test app",
  url = "/test-app",
}) => {
  const appId = "app_dev_" + getDocId()

  const fakePlugins = Array(plugins)
    .fill()
    .map(() => getPluginFixture())

  const features = {}
  if (appValidation) {
    features["componentValidation"] = true
  }

  return {
    application: {
      appId,
      version,
      upgradableVersion,
      revertableVersion,
      componentLibraries: ["@budibase/standard-components"],
      usedPlugins: [...fakePlugins],
      name,
      url,
      instance: {
        _id: appId,
      },
      features,
      icon: {},
      type: "app",
    },
    clientLibPath: `https://cdn.budibase.net/${appId}/budibase-client.js?v=${version}`,
    hasLock: true,
  }
}

export const clientFeaturesResp = {
  spectrumThemes: true,
  intelligentLoading: true,
  deviceAwareness: true,
  state: true,
  customThemes: true,
  devicePreview: true,
  messagePassing: true,
  rowSelection: true,
  continueIfAction: true,
  showNotificationAction: true,
  sidePanel: true,
}

export const fetchDefinitionsResp = {
  "@budibase/standard-components/text": {
    component: "@budibase/standard-components/text",
  },
  "plugin/budi-video": {
    component: "plugin/budi-video",
  },
  "plugin/budi-audio": {
    component: "plugin/budi-audio",
  },
  features: clientFeaturesResp,
}
