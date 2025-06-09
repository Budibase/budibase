import { it, expect, describe, beforeEach, vi } from "vitest"
import { get, writable } from "svelte/store"
import {
  INITIAL_COMPONENTS_STATE,
  ComponentStore,
} from "@/stores/builder/components"
import { DatasourceStore } from "@/stores/builder/datasources"
import { QueryStore } from "@/stores/builder/queries"
import { API } from "@/api"
import {
  appStore,
  tables,
  setComponentStore,
  setDatasourcesStore,
  setQueryStore,
} from "@/stores/builder"
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
import { Utils } from "@budibase/frontend-core"

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

  // 'Global' instance available in the test run and in other imports
  let componentStore
  let datasourcesStore
  let queryStore

  return {
    appStore,
    tables: writable(),
    get datasources() {
      return datasourcesStore
    },
    get componentStore() {
      return componentStore
    },
    get queries() {
      return queryStore
    },
    setComponentStore(store) {
      componentStore = store
    },
    setDatasourcesStore(store) {
      datasourcesStore = store
    },
    setQueryStore(store) {
      queryStore = store
    },
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
  beforeEach(async ctx => {
    vi.clearAllMocks()
    vi.resetAllMocks()

    let componentStoreInstance = new ComponentStore()
    let datasourcesStoreInstance = new DatasourceStore()
    let queryStoreInstance = new QueryStore()

    ctx.test = {}
    ctx.test = {
      get store() {
        return get(componentStoreInstance)
      },
      get $store() {
        return get(componentStoreInstance)
      },
      componentStore: componentStoreInstance,
    }

    // Store a copy of the test instance in the mock
    // May need a submodule if typescript complains
    setComponentStore(componentStoreInstance)
    setDatasourcesStore(datasourcesStoreInstance)
    setQueryStore(queryStoreInstance)
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
    const components =
      await ctx.test.componentStore.refreshDefinitions(fakeAppId)

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
    const components =
      await ctx.test.componentStore.refreshDefinitions(fakeAppId)

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

    const settings = ctx.test.componentStore.getComponentSettings(
      `${COMP_PREFIX}/rowexplorer`
    )

    const multiFieldSetting = settings.find(s => s.type === "multifield")

    const comp = getComponentFixture(`${COMP_PREFIX}/rowexplorer`).json()
    ctx.test.componentStore.enrichEmptySettings(comp, {
      parent: null,
      screen: coreScreen.json(),
      useDefaultValues: true,
    })

    const multifieldOptions = comp[multiFieldSetting.key]

    expect(multifieldOptions).toStrictEqual(
      Object.keys(internalTableDoc.schema)
    )
  })

  const enrichSettingsDS = (type, ctx) => {
    const coreScreen = getScreenFixture()

    baseInitialisation(ctx)

    const comp = getComponentFixture(`${COMP_PREFIX}/${type}`).json()
    ctx.test.componentStore.enrichEmptySettings(comp, {
      parent: null,
      screen: coreScreen.json(),
      useDefaultValues: true,
    })

    const settings = ctx.test.componentStore.getComponentSettings(
      `${COMP_PREFIX}/${type}`
    )

    // Could be table or dataSource
    const settingKey = settings.find(
      s => s.type === "dataSource" || s.type === "table"
    ).key
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

  it("updateComponentSetting - skip the update if the request is invalid", ctx => {
    const query = {
      name: "Sample",
      queryParams: { some_val: "2342" },
      _id: "some_query_123",
      datasourceId: externalTableDoc._id,
      type: "query",
    }

    const providerOne = getComponentFixture(`${COMP_PREFIX}/dataprovider`)
    const provider = providerOne.json()

    // Pass null as a name and ensure it does nothing.
    const update = ctx.test.componentStore.updateComponentSetting(null, {
      ...query,
      queryParams: { some_val: "4567" },
    })

    const updated = update(provider)

    // Update ignored as the name was invalid
    expect(updated).toBe(false)

    // Now attempt with no component.
    const updateNoComp = ctx.test.componentStore.updateComponentSetting(
      "dataSource",
      {
        ...query,
        queryParams: { some_val: "8910" },
      }
    )

    const updated_NoComp = updateNoComp()

    expect(updated_NoComp).toBe(false)

    // No change expected to the original component
    // The dataSource should still be unset
    expect(provider["dataSource"]).toBeUndefined()
  })

  it("updateComponentSetting - ignore 'resetOn' behaviour if query datasource is updated but not replaced", ctx => {
    // A unique scenario where simply altering the datasource and not replacing it
    // should not trigger a reset of related settings like filter.

    baseInitialisation(ctx)

    // Non REST query
    const query = {
      name: "Untitled query",
      queryParams: { some_val: "2342" },
      _id: "some_query_123",
      datasourceId: externalTableDoc._id,
      type: "query",
    }

    // Sample Filter
    const filter = {
      logicalOperator: "all",
      onEmptyFilter: "none",
      groups: [
        {
          logicalOperator: "any",
          filters: [
            {
              valueType: "Value",
              field: "name",
              type: "string",
              operator: "equal",
              noValue: false,
              value: "test",
            },
          ],
        },
      ],
    }

    const providerOne = getComponentFixture(`${COMP_PREFIX}/dataprovider`)
    const provider = providerOne.json()

    provider["dataSource"] = query
    provider["filter"] = filter

    // Alter the query params only. This should trigger the resetOn
    // behaviour but it should leave the filter intact as the source is unchanged
    const update = ctx.test.componentStore.updateComponentSetting(
      "dataSource",
      {
        ...query,
        queryParams: { some_val: "4567" },
      }
    )

    const updated = update(provider)
    expect(updated).toBe(true)

    // The update should have gone ahead
    expect(provider["dataSource"].queryParams.some_val).toBe("4567")

    // filter should remain intact
    expect(provider["filter"]).toStrictEqual(filter)
  })

  it("updateComponentSetting - resetOn should clear target setting if the datasource is replaced completely.", ctx => {
    baseInitialisation(ctx)

    // Non REST
    const query = {
      name: "Query",
      queryParams: { some_val: "2342" },
      _id: "some_query_123",
      datasourceId: externalTableDoc._id,
      type: "query",
    }

    // New Query
    const query2 = {
      name: "Query 2",
      _id: "some_query_456",
      datasourceId: externalTableDoc._id,
      type: "query",
    }

    // Sample Filter
    const filter = {
      logicalOperator: "all",
      onEmptyFilter: "none",
      groups: [
        {
          logicalOperator: "any",
          filters: [
            {
              valueType: "Value",
              field: "name",
              type: "string",
              operator: "equal",
              noValue: false,
              value: "test",
            },
          ],
        },
      ],
    }

    const providerOne = getComponentFixture(`${COMP_PREFIX}/dataprovider`)
    const provider = providerOne.json()
    provider["dataSource"] = query
    provider["filter"] = filter

    // Replace the entire query
    const update = ctx.test.componentStore.updateComponentSetting(
      "dataSource",
      query2
    )

    const updated = update(provider)
    expect(updated).toBe(true)

    // Datasource should have been replaced.
    expect(provider["dataSource"]._id).toBe(query2._id)

    // The resetOn behaviour should have kicked in and cleared the filter.
    expect(provider["filter"]).toBeNull()
  })

  /**
   * Check that button configuration resets if either "actionType" or "dataSource" are changed
   */
  it("updateComponentSetting - 'resetOn' multi-field config should trigger for all configured fields.", ctx => {
    baseInitialisation(ctx)

    // Base config for a formBlock
    const genConfig = source => {
      return {
        buttons: [
          ...Utils.buildFormBlockButtonConfig({
            _id: formBlock._id,
            actionType: formBlock["actionType"],
            dataSource: internalTableDoc,
          }),
          getComponentFixture(`${COMP_PREFIX}/button`).json(),
        ],
        dataSource: source,
        fields: Object.keys(source.schema).map(key => ({
          name: key,
          active: true,
        })),
      }
    }

    const formBlockFx = getComponentFixture(`${COMP_PREFIX}/formblock`)
    let formBlock = formBlockFx.json()
    formBlock["actionType"] = "Update"
    formBlock = {
      ...formBlock,
      ...genConfig(internalTableDoc),
    }

    // Switch datasource to a new one.
    const update = ctx.test.componentStore.updateComponentSetting(
      "dataSource",
      externalTableDoc
    )

    const updated = update(formBlock)
    expect(updated).toBe(true)

    // formBlock.buttons 'resetOn' prop depends on either actionType OR dataSource
    expect(formBlock["buttons"]).toBeNull()
    // Fields has a single 'resetOn' that also depends on dataSource
    expect(formBlock["fields"]).toBeNull()

    // Now check that altering the actionType has the same effect on buttons.
    let formBlock2 = formBlockFx.json()
    formBlock2["actionType"] = "Update"
    formBlock2 = {
      ...formBlock2,
      ...genConfig(externalTableDoc),
    }

    // Switch actionType to a new one.
    const update2 = ctx.test.componentStore.updateComponentSetting(
      "actionType",
      "Create"
    )
    const updated2 = update2(formBlock2)
    expect(updated2).toBe(true)

    //Again, buttons should be clear
    expect(formBlock2["buttons"]).toBeNull()
    // fields should be unaffected
    expect(formBlock2["fields"]).not.toBeNull()
  })

  it("updateComponentSetting - should clear if the view name has changed. Legacy views", ctx => {
    // Legacy views don't have a discernable resource id beyond the name.

    baseInitialisation(ctx)

    const view = {
      name: "Sample",
      tableId: internalTableDoc._id,
      type: "view",
    }

    const filter = {
      logicalOperator: "all",
      onEmptyFilter: "none",
      groups: [
        {
          logicalOperator: "any",
          filters: [
            {
              valueType: "Value",
              field: "name",
              type: "string",
              operator: "equal",
              noValue: false,
              value: "test",
            },
          ],
        },
      ],
    }

    const providerOne = getComponentFixture(`${COMP_PREFIX}/dataprovider`)
    const provider = providerOne.json()
    provider["dataSource"] = view
    provider["filter"] = filter

    const view2 = {
      name: "Sample Two",
      tableId: internalTableDoc._id,
      type: "view",
    }

    const update = ctx.test.componentStore.updateComponentSetting(
      "dataSource",
      view2
    )
    const updated = update(provider)

    // Update ignored as the name was invalid
    expect(updated).toBe(true)

    expect(provider.dataSource.name).toBe("Sample Two")
    expect(provider.filter).toBeNull()
  })

  it("updateComponentSetting - should clear if the view name is exactly the same but is in another table. Legacy views", ctx => {
    baseInitialisation(ctx)

    const view = {
      name: "Sample",
      tableId: internalTableDoc._id,
      type: "view",
    }

    const filter = {
      logicalOperator: "all",
      onEmptyFilter: "none",
      groups: [
        {
          logicalOperator: "any",
          filters: [
            {
              valueType: "Value",
              field: "name",
              type: "string",
              operator: "equal",
              noValue: false,
              value: "test",
            },
          ],
        },
      ],
    }

    const providerOne = getComponentFixture(`${COMP_PREFIX}/dataprovider`)
    const provider = providerOne.json()
    provider["dataSource"] = view
    provider["filter"] = filter

    const view2 = {
      name: "Sample",
      tableId: externalTableDoc._id,
      type: "view",
    }

    const update = ctx.test.componentStore.updateComponentSetting(
      "dataSource",
      view2
    )
    const updated = update(provider)

    // Update ignored as the name was invalid
    expect(updated).toBe(true)

    expect(provider.dataSource.name).toBe("Sample")
    expect(provider.dataSource.tableId).toBe(externalTableDoc._id)
    expect(provider.filter).toBeNull()
  })

  it("updateComponentSetting - Should gracefully handle not having an initial dataSource", ctx => {
    // Unlikely due to enriching and migrations, but it should handle it.

    baseInitialisation(ctx)

    const providerOne = getComponentFixture(`${COMP_PREFIX}/dataprovider`)
    const provider = providerOne.json()

    const view2 = {
      name: "Sample",
      tableId: externalTableDoc._id,
      type: "view",
    }

    const update = ctx.test.componentStore.updateComponentSetting(
      "dataSource",
      view2
    )
    const updated = update(provider)

    // Update ignored as the name was invalid
    expect(updated).toBe(true)

    expect(provider.dataSource.name).toBe("Sample")
    expect(provider.dataSource.tableId).toBe(externalTableDoc._id)
  })
})
