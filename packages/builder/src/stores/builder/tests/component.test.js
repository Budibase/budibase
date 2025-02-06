import { it, expect, describe, beforeEach, vi } from "vitest"
import { get, writable } from "svelte/store"
import {
  INITIAL_COMPONENTS_STATE,
  ComponentStore,
} from "@/stores/builder/components"
import { API } from "@/api"
import { appStore, tables } from "@/stores/builder"
import {
  componentDefinitionMap,
  getComponentFixture,
  getScreenFixture,
  pluginDefinitionMap,
  clientFeaturesResp,
  sampleTableDoc,
  internalTableDoc,
  userTableDoc,
  externalTableDoc,
  componentsToNested,
} from "./fixtures"
import {
  DB_TYPE_INTERNAL,
  DB_TYPE_EXTERNAL,
  DEFAULT_BB_DATASOURCE_ID,
} from "@/constants/backend"
import { makePropSafe as safe } from "@budibase/string-templates"

// Could move to fixtures
const COMP_PREFIX = "@budibase/standard-components"

vi.mock("@/api", () => {
  return {
    API: {
      fetchComponentLibDefinitions: vi.fn(),
    },
  }
})

vi.mock("@/stores/builder", async () => {
  const mockAppStore = writable()
  const appStore = {
    subscribe: mockAppStore.subscribe,
    update: mockAppStore.update,
    set: mockAppStore.set,
    syncClientFeatures: vi.fn(),
    syncClientTypeSupportPresets: vi.fn(),
  }
  const mockTableStore = writable()
  const tables = {
    subscribe: mockTableStore.subscribe,
    update: mockTableStore.update,
    set: mockTableStore.set,
  }
  return {
    appStore,
    tables,
  }
})

// Simple base config for components and data sources
const baseInitialisation = ctx => {
  // Init components
  ctx.test.componentStore.update(state => ({
    ...state,
    components: {
      ...componentDefinitionMap(),
    },
  }))

  // Add datasources
  tables.update(state => ({
    ...state,
    list: [sampleTableDoc, internalTableDoc, userTableDoc, externalTableDoc],
  }))
}

describe("Component store", () => {
  beforeEach(ctx => {
    vi.clearAllMocks()
    vi.resetAllMocks()

    const componentStore = new ComponentStore()
    ctx.test = {}
    ctx.test = {
      get store() {
        return get(componentStore)
      },
      get $store() {
        return get(componentStore) //store and $store
      },
      componentStore,
    }
  })

  it("Create base component store with defaults", ctx => {
    expect(ctx.test.store).toStrictEqual(INITIAL_COMPONENTS_STATE)
  })

  it("Reset the component store to default", ctx => {
    const container = getComponentFixture(`${COMP_PREFIX}/container`)
    const pluginDefs = pluginDefinitionMap()

    ctx.test.componentStore.update(state => ({
      ...state,
      components: {
        ...componentDefinitionMap(),
        ...pluginDefs,
      },
      customComponents: Object.keys(pluginDefs),
      componentToPaste: container.json(),
      selectedComponentId: container._id,
    }))

    expect(ctx.test.store).not.toStrictEqual(INITIAL_COMPONENTS_STATE)

    ctx.test.componentStore.reset()

    expect(ctx.test.store).toStrictEqual(INITIAL_COMPONENTS_STATE)
  })

  it("Refresh the component definitions", async ctx => {
    const componentDefs = componentDefinitionMap()
    let mockAPIResponse = {
      features: clientFeaturesResp,
      ...componentDefs,
    }
    const apiDefRequest = vi
      .spyOn(API, "fetchComponentLibDefinitions")
      .mockResolvedValue(mockAPIResponse)

    const fakeAppId = "abc123"
    const components = await ctx.test.componentStore.refreshDefinitions(
      fakeAppId
    )

    expect(components).toStrictEqual(mockAPIResponse)
    expect(ctx.test.store.components).toStrictEqual(mockAPIResponse)

    expect(apiDefRequest).toBeCalled()
    expect(appStore.syncClientFeatures).toBeCalledWith(clientFeaturesResp)
  })

  it("Refresh and sync component and plugin definitions", async ctx => {
    const componentDefs = componentDefinitionMap()
    const pluginDefs = pluginDefinitionMap()

    let mockAPIResponse = {
      features: clientFeaturesResp,
      ...componentDefs,
      ...pluginDefs,
    }
    const apiDefRequest = vi
      .spyOn(API, "fetchComponentLibDefinitions")
      .mockResolvedValue(mockAPIResponse)

    const fakeAppId = "abc123"
    const components = await ctx.test.componentStore.refreshDefinitions(
      fakeAppId
    )

    expect(components).toStrictEqual(mockAPIResponse)
    expect(ctx.test.store.components).toStrictEqual(mockAPIResponse)

    expect(apiDefRequest).toBeCalled()
    expect(appStore.syncClientFeatures).toBeCalledWith(clientFeaturesResp)

    expect(ctx.test.store.customComponents).toStrictEqual(
      Object.keys(pluginDefs)
    )
  })

  it("Ignores definition sync if no appId is specified.", async ctx => {
    const apiDefRequest = vi.spyOn(API, "fetchComponentLibDefinitions")

    const components = await ctx.test.componentStore.refreshDefinitions()

    expect(components).toBeUndefined()

    expect(apiDefRequest).not.toBeCalled()
  })

  it("Retrieves component definitions by component type", ctx => {
    const pluginDefs = pluginDefinitionMap()
    const componentDefs = componentDefinitionMap()

    ctx.test.componentStore.update(state => ({
      ...state,
      components: {
        ...componentDefs,
        ...pluginDefs,
      },
      customComponents: Object.keys(pluginDefs),
    }))

    const def = ctx.test.componentStore.getDefinition(
      "@budibase/standard-components/container"
    )

    expect(def).toStrictEqual(
      componentDefs["@budibase/standard-components/container"]
    )

    const pluginDef = ctx.test.componentStore.getDefinition("plugin/budi-video")

    expect(pluginDef).toStrictEqual(pluginDefs["plugin/budi-video"])
  })

  it("Handle missing or invalid component definition keys", ctx => {
    const pluginDefs = pluginDefinitionMap()
    const componentDefs = componentDefinitionMap()

    ctx.test.componentStore.update(state => ({
      ...state,
      components: {
        ...componentDefs,
        ...pluginDefs,
      },
      customComponents: Object.keys(pluginDefs),
    }))

    const def = ctx.test.componentStore.getDefinition(
      "@budibase/standard-components/mystery"
    )
    expect(def).toBeUndefined()

    const defEmpty = ctx.test.componentStore.getDefinition()
    expect(defEmpty).toBeNull()
  })

  it("Select an appropriate default datasource - Internal Table ", ctx => {
    tables.update(state => ({
      ...state,
      list: [sampleTableDoc, internalTableDoc, userTableDoc, externalTableDoc],
    }))

    const table = ctx.test.componentStore.getDefaultDatasource()
    expect(table.sourceType).toBe(DB_TYPE_INTERNAL)
    expect(table.sourceId).not.toBe(DEFAULT_BB_DATASOURCE_ID)
  })

  it("Select an appropriate default datasource - Sample Table ", ctx => {
    tables.update(state => ({
      ...state,
      list: [sampleTableDoc, userTableDoc, externalTableDoc],
    }))

    const table = ctx.test.componentStore.getDefaultDatasource()
    expect(table.sourceType).toBe(DB_TYPE_INTERNAL)
    expect(table.sourceId).toBe(DEFAULT_BB_DATASOURCE_ID)
  })

  it("Select an appropriate default datasource - External Table ", ctx => {
    tables.update(state => ({
      ...state,
      list: [userTableDoc, externalTableDoc],
    }))

    const table = ctx.test.componentStore.getDefaultDatasource()
    expect(table.sourceType).toBe(DB_TYPE_EXTERNAL)
  })

  it("Select an appropriate default datasource - No Table and ignore user table", ctx => {
    tables.update(state => ({
      ...state,
      list: [userTableDoc],
    }))

    const table = ctx.test.componentStore.getDefaultDatasource()
    expect(table).toBeUndefined()
  })

  it("Apply no migrations if component is not a formblock", ctx => {
    const comp = getComponentFixture(`${COMP_PREFIX}/container`).json()
    const orig = { ...comp }
    const migrated = ctx.test.componentStore.migrateSettings(orig)

    expect(migrated).toBe(false)
    expect(comp).toStrictEqual(orig)
  })

  it("Should initialise the buttons prop if it didnt exist", ctx => {
    const formBlock = getComponentFixture(`${COMP_PREFIX}/formblock`).json()
    const migrated = ctx.test.componentStore.migrateSettings(formBlock)

    expect(migrated).toBe(true)
    expect(formBlock.buttons).toEqual([])
  })

  it("Should initialise the buttons prop if it was nullified/reset", ctx => {
    const formBlock = getComponentFixture(`${COMP_PREFIX}/formblock`).json()
    formBlock.buttons = null
    const migrated = ctx.test.componentStore.migrateSettings(formBlock)

    expect(migrated).toBe(true)
    expect(formBlock.buttons).toEqual([])
  })

  it("Should initialise formblock button position when not set", ctx => {
    const formBlock = getComponentFixture(`${COMP_PREFIX}/formblock`).json()
    const migrated = ctx.test.componentStore.migrateSettings(formBlock)

    expect(migrated).toBe(true)
    expect(formBlock.buttonPosition).toEqual("top")
  })

  it("Should ignore formblock migration if already initialised", ctx => {
    const formBlock = getComponentFixture(`${COMP_PREFIX}/formblock`).json()
    formBlock.buttonPosition = "bottom"
    formBlock.buttons = []
    const migrated = ctx.test.componentStore.migrateSettings(formBlock)

    expect(migrated).toBe(false)
    expect(formBlock.buttonPosition).toEqual("bottom")
  })

  it("enrichEmptySettings - initialise multifield type with schema keys", async ctx => {
    const coreScreen = getScreenFixture()

    baseInitialisation(ctx)

    const componentDefs = componentDefinitionMap()
    const targetCompDef =
      componentDefs["@budibase/standard-components/rowexplorer"]

    const comp = getComponentFixture(`${COMP_PREFIX}/rowexplorer`).json()
    ctx.test.componentStore.enrichEmptySettings(comp, {
      parent: null,
      screen: coreScreen.json(),
      useDefaultValues: true,
    })

    const multifieldKey = targetCompDef.settings[0].key
    const multifieldOptions = comp[multifieldKey]

    expect(multifieldOptions).toStrictEqual(
      Object.keys(internalTableDoc.schema)
    )
  })

  const enrichSettingsDS = (type, ctx) => {
    const coreScreen = getScreenFixture()

    baseInitialisation(ctx)

    const componentDefs = componentDefinitionMap()
    const targetCompDef = componentDefs[`${COMP_PREFIX}/${type}`]

    const comp = getComponentFixture(`${COMP_PREFIX}/${type}`).json()
    ctx.test.componentStore.enrichEmptySettings(comp, {
      parent: null,
      screen: coreScreen.json(),
      useDefaultValues: true,
    })

    const settingKey = targetCompDef.settings[0].key
    const settingValue = comp[settingKey]

    expect(settingValue).toStrictEqual({
      label: internalTableDoc.name,
      tableId: internalTableDoc._id,
      resourceId: internalTableDoc._id,
      type: "table",
    })

    return comp
  }

  it("enrichEmptySettings - initialise cards blocks with correct fields", async ctx => {
    const comp = enrichSettingsDS("cardsblock", ctx)
    const expectBinding = (setting, ...parts) => {
      expect(comp[setting]).toStrictEqual(
        `{{ ${safe(`${comp._id}-repeater`)}.${parts.map(safe).join(".")} }}`
      )
    }
    expectBinding("cardTitle", internalTableDoc.schema.MediaTitle.name)
    expectBinding("cardSubtitle", internalTableDoc.schema.MediaVersion.name)
    expectBinding(
      "cardDescription",
      internalTableDoc.schema.MediaDescription.name
    )
    expectBinding(
      "cardImageURL",
      internalTableDoc.schema.MediaImage.name,
      "url"
    )
  })

  it("enrichEmptySettings - set default datasource for 'table' setting type", async ctx => {
    enrichSettingsDS("formblock", ctx)
  })

  it("enrichEmptySettings - set default datasource for 'dataSource' setting type", async ctx => {
    enrichSettingsDS("dataprovider", ctx)
  })

  it("enrichEmptySettings - set default datasource for type dataprovider", ctx => {
    const coreScreen = getScreenFixture()

    baseInitialisation(ctx)

    const componentDefs = componentDefinitionMap()
    const targetCompDef = componentDefs[`${COMP_PREFIX}/table`]

    const providerOne = getComponentFixture(`${COMP_PREFIX}/dataprovider`)
    const tableOne = getComponentFixture(`${COMP_PREFIX}/table`)

    const components = Array(10)
      .fill()
      .map(() => getComponentFixture(`${COMP_PREFIX}/container`))

    components.splice(5, 0, providerOne)
    components.push(tableOne)

    let nested = componentsToNested(components)
    coreScreen.addChild(nested)

    const comp = tableOne.json()
    ctx.test.componentStore.enrichEmptySettings(comp, {
      parent: null,
      screen: coreScreen.json(),
      useDefaultValues: true,
    })
    const settingKey = targetCompDef.settings[0].key
    const settingValue = comp[settingKey]

    expect(settingValue).toBe(`{{ literal [${providerOne.json()._id}] }}`)
  })

  it("enrichEmptySettings - set default datasource for type dataprovider - get closest provider", ctx => {
    const coreScreen = getScreenFixture()

    baseInitialisation(ctx)

    const componentDefs = componentDefinitionMap()
    const targetCompDef = componentDefs[`${COMP_PREFIX}/table`]

    const providerOne = getComponentFixture(`${COMP_PREFIX}/dataprovider`)
    const providerTwo = getComponentFixture(`${COMP_PREFIX}/dataprovider`)
    const tableOne = getComponentFixture(`${COMP_PREFIX}/table`)

    const components = Array(10)
      .fill()
      .map(() => getComponentFixture(`${COMP_PREFIX}/container`))

    components.unshift(providerOne)
    components.splice(5, 0, providerTwo)
    components.push(tableOne)

    let nested = componentsToNested(components)
    coreScreen.addChild(nested)

    const comp = tableOne.json()
    ctx.test.componentStore.enrichEmptySettings(comp, {
      parent: null,
      screen: coreScreen.json(),
      useDefaultValues: true,
    })
    const settingKey = targetCompDef.settings[0].key
    const settingValue = comp[settingKey]

    // Get the closest data provider in the tree.
    expect(settingValue).toBe(`{{ literal [${providerTwo.json()._id}] }}`)
  })

  it("enrichEmptySettings - set default datasource for type dataprovider - no providers in tree", ctx => {
    const coreScreen = getScreenFixture()

    baseInitialisation(ctx)

    const componentDefs = componentDefinitionMap()
    const targetCompDef = componentDefs[`${COMP_PREFIX}/table`]

    const tableOne = getComponentFixture(`${COMP_PREFIX}/table`)
    const components = Array(10)
      .fill()
      .map(() => getComponentFixture(`${COMP_PREFIX}/container`))

    components.push(tableOne)

    let nested = componentsToNested(components)
    coreScreen.addChild(nested)

    const comp = tableOne.json()
    ctx.test.componentStore.enrichEmptySettings(comp, {
      parent: null,
      screen: coreScreen.json(),
      useDefaultValues: true,
    })
    const settingKey = targetCompDef.settings[0].key
    const settingValue = comp[settingKey]

    // The value should remain unset
    expect(settingValue).toBeUndefined()
  })
})
