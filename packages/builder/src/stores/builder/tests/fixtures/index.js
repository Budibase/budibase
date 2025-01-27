import { v4 } from "uuid"
import { Component } from "@/templates/Component"
import { Screen } from "@/templates/screenTemplating/Screen"
import { get } from "svelte/store"
import {
  BUDIBASE_INTERNAL_DB_ID,
  DB_TYPE_INTERNAL,
  DB_TYPE_EXTERNAL,
  DEFAULT_BB_DATASOURCE_ID,
} from "@/constants/backend"
import { FieldType } from "@budibase/types"

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

// Sample Definitions
export const COMPONENT_DEFINITIONS = {
  form: {
    name: "Form",
    hasChildren: true,
    illegalChildren: ["section", "form", "formblock"],
  },
  formblock: {
    name: "Form Block",
    block: true,
    settings: [
      {
        type: "table",
        key: "dataSource",
      },
    ],
  },
  cardsblock: {
    block: true,
    name: "Cards Block",
    settings: [
      {
        type: "dataSource",
        label: "Data",
        key: "dataSource",
        required: true,
      },
      {
        section: true,
        name: "Cards",
        settings: [
          {
            type: "text",
            key: "cardTitle",
            label: "Title",
            nested: true,
            resetOn: "dataSource",
          },
          {
            type: "text",
            key: "cardSubtitle",
            label: "Subtitle",
            nested: true,
            resetOn: "dataSource",
          },
          {
            type: "text",
            key: "cardDescription",
            label: "Description",
            nested: true,
            resetOn: "dataSource",
          },
          {
            type: "text",
            key: "cardImageURL",
            label: "Image URL",
            nested: true,
            resetOn: "dataSource",
          },
        ],
      },
    ],
  },
  container: {
    name: "Container",
  },
  rowexplorer: {
    name: "Row Explorer",
    settings: [
      {
        // combo unique to the row explorer
        type: "multifield",
        selectAllFields: true,
        key: "detailFields",
      },
    ],
  },
  dataprovider: {
    name: "Data Provider",
    settings: [
      {
        type: "dataSource",
      },
    ],
  },
  table: {
    name: "Table",
    settings: [
      {
        type: "dataProvider",
        key: "dataProvider",
      },
    ],
  },
  stringfield: {
    name: "Text Field",
    settings: [
      {
        type: "field/string",
        key: "field",
      },
    ],
  },
}

// Sample plugin definitions
export const PLUGIN_DEFINITIONS = {
  "budi-video": {
    component: "plugin/budi-video",
    description: "Embedded video component. ",
    friendlyName: "Budi Video",
    icon: "VideoOutline",
    name: "budi-video",
  },
}

// Take a component array and turn it into a deeply nested tree
export const componentsToNested = components => {
  let nested
  do {
    const current = components.pop()
    if (!nested) {
      nested = current
      continue
    }
    //review this for the empty
    current.addChild(nested)
    nested = current
  } while (components.length)
  return nested
}

export const getFakeScreenPatch = store => {
  return async (patchFn, screenId) => {
    const target = get(store).screens.find(screen => screen._id === screenId)

    patchFn(target)

    await store.replace(screenId, target)
  }
}

export const componentDefinitionMap = () => {
  return Object.keys(COMPONENT_DEFINITIONS).reduce((acc, key) => {
    const def = COMPONENT_DEFINITIONS[key]
    acc[`@budibase/standard-components/${key}`] = def
    return acc
  }, {})
}

export const pluginDefinitionMap = () => {
  return Object.keys(PLUGIN_DEFINITIONS).reduce((acc, key) => {
    const def = PLUGIN_DEFINITIONS[key]
    acc[`plugin/${key}`] = def
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

export const generateAppPackage = ({
  plugins = 0,
  version = "1.0.0",
  upgradableVersion,
  revertableVersion,
  appValidation = true,
  disableUserMetadata = true,
  name = "Test app",
  url = "/test-app",
}) => {
  const appId = "app_dev_" + getDocId()

  const fakePlugins = Array(plugins)
    .fill()
    .map(() => getPluginFixture())

  const features = {}
  features["componentValidation"] = appValidation

  if (disableUserMetadata) {
    features["disableUserMetadata"] = false
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

export const userTableDoc = {
  _id: "ta_users",
  type: "table",
  name: "Users",
  schema: {},
}

export const sampleTableDoc = {
  _id: "ta_bb_employee",
  type: "table",
  name: "Employees",
  sourceId: DEFAULT_BB_DATASOURCE_ID,
  sourceType: DB_TYPE_INTERNAL,
  primaryDisplay: "First Name",
  schema: {
    "First Name": {
      name: "First Name",
      type: "string",
    },
    "Last Name": {
      name: "Last Name",
      type: "string",
    },
  },
}

export const internalTableDoc = {
  _id: "ta_db5ac9e254da415899adcec21a025b3f",
  tableId: "ta_db5ac9e254da415899adcec21a025b3f",
  type: "table",
  name: "Media",
  sourceId: BUDIBASE_INTERNAL_DB_ID,
  sourceType: DB_TYPE_INTERNAL,
  primaryDisplay: "MediaTitle",
  schema: {
    MediaTitle: {
      name: "MediaTitle",
      type: FieldType.STRING,
    },
    MediaVersion: {
      name: "MediaVersion",
      type: FieldType.STRING,
    },
    MediaDescription: {
      name: "MediaDescription",
      type: FieldType.LONGFORM,
    },
    MediaImage: {
      name: "MediaImage",
      type: FieldType.ATTACHMENT_SINGLE,
    },
  },
}

export const externalTableDoc = {
  type: "table",
  _id: "datasource_plus_c5e6ae7fbe534da6917c44b284c54b45__Tester",
  name: "Tester",
  sourceId: "datasource_plus_c5e6ae7fbe534da6917c44b284c54b45",
  sourceType: DB_TYPE_EXTERNAL,
  sql: true,
}
