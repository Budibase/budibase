import { it, expect, describe, beforeEach, vi } from "vitest"
import { screenStore } from "@/stores/builder/screens"
import { get } from "svelte/store"
import {
  INITIAL_COMPONENTS_STATE,
  ComponentStore,
} from "@/stores/builder/components"
import { DatasourceStore } from "@/stores/builder/datasources"
import { QueryStore } from "@/stores/builder/queries"
import { API } from "@/api"
import {
  workspaceStore,
  screenStore as componentScreenStore,
  componentTreeNodesStore,
  tables,
} from "@/stores/builder"
import {
  componentDefinitionMap,
  getScreenFixture,
  pluginDefinitionMap,
  clientFeaturesResp,
  sampleTableDoc as untypedSampleTableDoc,
  internalTableDoc as untypedInternalTableDoc,
  userTableDoc as untypedUserTableDoc,
  externalTableDoc as untypedExternalTableDoc,
  componentsToNested,
} from "./fixtures"
import {
  DB_TYPE_INTERNAL,
  DB_TYPE_EXTERNAL,
  DEFAULT_BB_DATASOURCE_ID,
} from "@/constants/backend"
import { makePropSafe as safe } from "@budibase/string-templates"
import { Utils } from "@budibase/frontend-core"
import { Component as ComponentTemplate } from "@/templates/Component"
import type { Component, Table } from "@budibase/types"

const getComponentFixture = (type: string) => new ComponentTemplate(type)
let testStore: ComponentStore
const storeInstances = vi.hoisted(() => ({
  componentStore: undefined as ComponentStore | undefined,
  datasourcesStore: undefined as DatasourceStore | undefined,
  queryStore: undefined as QueryStore | undefined,
}))

// Could move to fixtures
const sampleTableDoc = untypedSampleTableDoc as Table

const internalTableDoc = untypedInternalTableDoc as Table

const userTableDoc = untypedUserTableDoc as Table

const externalTableDoc = untypedExternalTableDoc as Table

const COMP_PREFIX = "@budibase/standard-components"
const { mockGetDefaultLayoutPreference } = vi.hoisted(() => {
  return {
    mockGetDefaultLayoutPreference: vi.fn(() => "grid"),
  }
})

vi.mock("@/api", () => {
  return {
    API: {
      fetchComponentLibDefinitions: vi.fn(),
    },
  }
})

vi.mock("@/stores/preferences", () => {
  return {
    getDefaultLayoutPreference: mockGetDefaultLayoutPreference,
  }
})

vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")
  const mockWorkspaceStore = writable()
  const mockScreenComponentsList = writable([])
  const mockScreenStore = writable({ screens: [] })
  const workspaceStore = {
    subscribe: mockWorkspaceStore.subscribe,
    update: mockWorkspaceStore.update,
    set: mockWorkspaceStore.set,
    syncClientFeatures: vi.fn(),
    syncClientTypeSupportPresets: vi.fn(),
  }

  // 'Global' instance available in the test run and in other imports

  return {
    workspaceStore,
    tables: writable(),
    screenComponentsList: mockScreenComponentsList,
    componentTreeNodesStore: { makeNodeVisible: vi.fn() },
    screenStore: {
      subscribe: mockScreenStore.subscribe,
      set: mockScreenStore.set,
      patch: vi.fn(),
    },
    get datasources() {
      return storeInstances.datasourcesStore
    },
    get componentStore() {
      return storeInstances.componentStore
    },
    get queries() {
      return storeInstances.queryStore
    },
  }
})

// Simple base config for components and data sources
const baseInitialisation = () => {
  // Init components
  testStore.update(state => ({
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
  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetAllMocks()
    screenStore.reset()
    componentScreenStore.set({ screens: [] })
    mockGetDefaultLayoutPreference.mockReturnValue("grid")

    let componentStoreInstance = new ComponentStore()
    let datasourcesStoreInstance = new DatasourceStore()
    let queryStoreInstance = new QueryStore()

    testStore = componentStoreInstance

    // Store a copy of the test instance in the mock
    // May need a submodule if typescript complains
    storeInstances.componentStore = componentStoreInstance
    storeInstances.datasourcesStore = datasourcesStoreInstance
    storeInstances.queryStore = queryStoreInstance
  })

  it("Create base component store with defaults", () => {
    expect(get(testStore)).toStrictEqual(INITIAL_COMPONENTS_STATE)
  })

  it("Reset the component store to default", () => {
    const container = getComponentFixture(`${COMP_PREFIX}/container`)
    const pluginDefs = pluginDefinitionMap()

    testStore.update(state => ({
      ...state,
      components: {
        ...componentDefinitionMap(),
        ...pluginDefs,
      },
      customComponents: Object.keys(pluginDefs),
      componentToPaste: container.json(),
      selectedComponentId: container.json()._id,
    }))

    expect(get(testStore)).not.toStrictEqual(INITIAL_COMPONENTS_STATE)

    testStore.reset()

    expect(get(testStore)).toStrictEqual(INITIAL_COMPONENTS_STATE)
  })

  it.each([false, true])(
    "keeps drag moves atomic when save fails: %s",
    async fails => {
      const store = new ComponentStore()
      const component = getComponentFixture(`${COMP_PREFIX}/container`).json()
      const target = getComponentFixture(`${COMP_PREFIX}/container`).json()
      const sourceScreen = getScreenFixture()
        .addChild(component)
        .addChild(target)
        .json()
      sourceScreen._id = "screen_source"
      componentScreenStore.set({
        screens: [sourceScreen],
        selectedScreenId: sourceScreen._id,
      })
      vi.mocked(componentScreenStore.patch).mockImplementation(async patch => {
        const clone = JSON.parse(JSON.stringify(sourceScreen))
        patch(clone)
        if (fails) {
          throw new Error("Save failed")
        }
        componentScreenStore.set({
          screens: [clone],
          selectedScreenId: clone._id,
        })
        return clone
      })

      store.copy(component, true, false)
      const paste = store.paste(target, "below", sourceScreen)
      if (fails) {
        await expect(paste).rejects.toThrow("Save failed")
        expect(get(componentScreenStore).screens[0].props._children).toEqual([
          component,
          target,
        ])
        expect(get(store).componentToPaste?._id).toBe(component._id)
      } else {
        await paste
        expect(get(componentScreenStore).screens[0].props._children).toEqual([
          target,
          component,
        ])
        expect(get(store).componentToPaste).toBeUndefined()
      }
      expect(componentScreenStore.patch).toHaveBeenCalledTimes(1)
    }
  )

  it("pastes a cross-screen cut only once when saves overlap", async () => {
    const store = testStore
    const component = getComponentFixture(`${COMP_PREFIX}/container`).json()
    const target = getComponentFixture(`${COMP_PREFIX}/container`).json()
    const destination = getScreenFixture().addChild(target).json()
    destination._id = "screen_destination"
    store.update(state => ({
      ...state,
      componentToPaste: {
        ...component,
        isCut: true,
        screenId: "screen_source",
      },
    }))
    let finishSave!: () => void
    const pendingSave = new Promise<void>(resolve => {
      finishSave = resolve
    })
    componentScreenStore.set({ screens: [destination] })
    vi.mocked(componentScreenStore.patch).mockImplementation(
      Utils.sequential(async patch => {
        const clone = JSON.parse(
          JSON.stringify(get(componentScreenStore).screens[0])
        )
        patch(clone)
        await pendingSave
        componentScreenStore.set({ screens: [clone] })
        return clone
      })
    )

    const firstPaste = store.paste(target, "below", destination)
    const secondPaste = store.paste(target, "below", destination)
    finishSave()
    await Promise.all([firstPaste, secondPaste])

    expect(get(componentScreenStore).screens[0].props._children).toEqual([
      target,
      component,
    ])
    expect(get(store).componentToPaste).toBeUndefined()
  })

  it.each([
    { outcome: "saved", copyDuringSave: false },
    { outcome: "failed", copyDuringSave: false },
    { outcome: "skipped", copyDuringSave: false },
    { outcome: "saved", copyDuringSave: true },
    { outcome: "failed", copyDuringSave: true },
    { outcome: "skipped", copyDuringSave: true },
    { outcome: "failed", copyDuringSave: false, resetDuringSave: true },
    { outcome: "skipped", copyDuringSave: false, resetDuringSave: true },
    { outcome: "failed", copyDuringSave: true, resetDuringSave: true },
    { outcome: "skipped", copyDuringSave: true, resetDuringSave: true },
  ])(
    "handles cut clipboard consumption across copies and workspace resets: %j",
    async ({ outcome, copyDuringSave, resetDuringSave }) => {
      const store = new ComponentStore()
      const component = getComponentFixture(`${COMP_PREFIX}/container`).json()
      const target = getComponentFixture(`${COMP_PREFIX}/container`).json()
      const destination = getScreenFixture().addChild(target).json()
      destination._id = "screen_destination"
      componentScreenStore.set({ screens: [destination] })
      const clipboard = { ...component, isCut: true, screenId: "screen_source" }
      store.update(state => ({ ...state, componentToPaste: clipboard }))
      let finishSave!: () => void
      const pendingSave = new Promise<void>(resolve => {
        finishSave = resolve
      })
      vi.mocked(componentScreenStore.patch).mockImplementation(async patch => {
        const clone = JSON.parse(JSON.stringify(destination))
        await pendingSave
        if (outcome === "skipped") {
          clone.props._children = []
        }
        if (patch(clone) === false) {
          return
        }
        if (outcome === "failed") {
          throw new Error("Save failed")
        }
        componentScreenStore.set({ screens: [clone] })
        return clone
      })

      const paste = store.paste(target, "below", destination)
      let expectedClipboard: Component | undefined =
        outcome === "saved" ? undefined : clipboard
      if (resetDuringSave) {
        store.reset()
        expectedClipboard = undefined
      }
      if (copyDuringSave) {
        store.copy(target)
        expectedClipboard = get(store).componentToPaste
      }
      finishSave()
      if (outcome === "failed") {
        await expect(paste).rejects.toThrow("Save failed")
      } else {
        await paste
      }

      expect(get(store).componentToPaste).toEqual(expectedClipboard)
      expect(get(componentScreenStore).screens[0].props._children).toEqual(
        outcome === "saved" ? [target, component] : [target]
      )
    }
  )

  it.each([
    { cut: false, selectComponent: false },
    { cut: false, selectComponent: true },
    { cut: true, selectComponent: false },
    { cut: true, selectComponent: true },
  ])(
    "ignores paste selection and tree updates after a reset: %j",
    async ({ cut, selectComponent }) => {
      const store = new ComponentStore()
      const component = getComponentFixture(`${COMP_PREFIX}/container`).json()
      const target = getComponentFixture(`${COMP_PREFIX}/container`).json()
      const destination = getScreenFixture().addChild(target).json()
      store.update(state => ({
        ...state,
        componentToPaste: { ...component, isCut: cut },
      }))
      let finishSave!: () => void
      const pendingSave = new Promise<void>(resolve => {
        finishSave = resolve
      })
      vi.mocked(componentScreenStore.patch).mockImplementation(async patch => {
        const clone = JSON.parse(JSON.stringify(destination))
        patch(clone)
        await pendingSave
        return clone
      })

      const paste = store.paste(target, "below", destination, selectComponent)
      store.reset()
      const resetState = { ...get(store) }
      finishSave()
      await paste

      expect(get(store)).toEqual(resetState)
      expect(componentTreeNodesStore.makeNodeVisible).not.toHaveBeenCalled()
    }
  )

  it("Refresh the component definitions", async () => {
    const componentDefs = componentDefinitionMap()
    let mockAPIResponse = {
      layouts: [],
      screens: [],
      libraries: [],
      features: clientFeaturesResp,
      ...componentDefs,
    }
    const apiDefRequest = vi
      .spyOn(API, "fetchComponentLibDefinitions")
      .mockResolvedValue(mockAPIResponse)

    const fakeAppId = "abc123"
    const components = await testStore.refreshDefinitions(fakeAppId)

    expect(components).toStrictEqual(mockAPIResponse)
    expect(get(testStore).components).toStrictEqual(mockAPIResponse)

    expect(apiDefRequest).toBeCalled()
    expect(workspaceStore.syncClientFeatures).toBeCalledWith(clientFeaturesResp)
  })

  it("Refresh and sync component and plugin definitions", async () => {
    const componentDefs = componentDefinitionMap()
    const pluginDefs = pluginDefinitionMap()

    let mockAPIResponse = {
      layouts: [],
      screens: [],
      libraries: [],
      features: clientFeaturesResp,
      ...componentDefs,
      ...pluginDefs,
    }
    const apiDefRequest = vi
      .spyOn(API, "fetchComponentLibDefinitions")
      .mockResolvedValue(mockAPIResponse)

    const fakeAppId = "abc123"
    const components = await testStore.refreshDefinitions(fakeAppId)

    expect(components).toStrictEqual(mockAPIResponse)
    expect(get(testStore).components).toStrictEqual(mockAPIResponse)

    expect(apiDefRequest).toBeCalled()
    expect(workspaceStore.syncClientFeatures).toBeCalledWith(clientFeaturesResp)

    expect(get(testStore).customComponents).toStrictEqual(
      Object.keys(pluginDefs)
    )
  })

  it("Ignores definition sync if no appId is specified.", async () => {
    const apiDefRequest = vi.spyOn(API, "fetchComponentLibDefinitions")

    const components = await testStore.refreshDefinitions("")

    expect(components).toBeUndefined()

    expect(apiDefRequest).not.toBeCalled()
  })

  it("Retrieves component definitions by component type", () => {
    const pluginDefs = pluginDefinitionMap()
    const componentDefs = componentDefinitionMap()

    testStore.update(state => ({
      ...state,
      components: {
        ...componentDefs,
        ...pluginDefs,
      },
      customComponents: Object.keys(pluginDefs),
    }))

    const def = testStore.getDefinition(
      "@budibase/standard-components/container"
    )

    expect(def).toStrictEqual(
      componentDefs["@budibase/standard-components/container"]
    )

    const pluginDef = testStore.getDefinition("plugin/budi-video")

    expect(pluginDef).toStrictEqual(pluginDefs["plugin/budi-video"])
  })

  it("Handle missing or invalid component definition keys", () => {
    const pluginDefs = pluginDefinitionMap()
    const componentDefs = componentDefinitionMap()

    testStore.update(state => ({
      ...state,
      components: {
        ...componentDefs,
        ...pluginDefs,
      },
      customComponents: Object.keys(pluginDefs),
    }))

    const def = testStore.getDefinition("@budibase/standard-components/mystery")
    expect(def).toBeUndefined()

    const defEmpty = testStore.getDefinition("")
    expect(defEmpty).toBeNull()
  })

  it("sets container layout from the user preference when not provided", () => {
    baseInitialisation()
    const screen = getScreenFixture().json()
    screen._id = screen._id || "screen-default"
    screenStore.set({
      screens: [screen],
      selectedScreenId: screen._id,
    })
    mockGetDefaultLayoutPreference.mockReturnValue("flex")

    const instance = testStore.createInstance(`${COMP_PREFIX}/container`)

    expect(instance?.layout).toBe("flex")
  })

  it("does not override container layout when preset props include layout", () => {
    baseInitialisation()
    const screen = getScreenFixture().json()
    screen._id = screen._id || "screen-default"
    screenStore.set({
      screens: [screen],
      selectedScreenId: screen._id,
    })
    mockGetDefaultLayoutPreference.mockReturnValue("flex")

    const instance = testStore.createInstance(`${COMP_PREFIX}/container`, {
      layout: "grid",
    })

    expect(instance?.layout).toBe("grid")
  })

  it("Select an appropriate default datasource - Internal Table ", () => {
    tables.update(state => ({
      ...state,
      list: [sampleTableDoc, internalTableDoc, userTableDoc, externalTableDoc],
    }))

    const table = testStore.getDefaultDatasource()
    expect(table?.sourceType).toBe(DB_TYPE_INTERNAL)
    expect(table?.sourceId).not.toBe(DEFAULT_BB_DATASOURCE_ID)
  })

  it("Select an appropriate default datasource - Sample Table ", () => {
    tables.update(state => ({
      ...state,
      list: [sampleTableDoc, userTableDoc, externalTableDoc],
    }))

    const table = testStore.getDefaultDatasource()
    expect(table?.sourceType).toBe(DB_TYPE_INTERNAL)
    expect(table?.sourceId).toBe(DEFAULT_BB_DATASOURCE_ID)
  })

  it("Select an appropriate default datasource - External Table ", () => {
    tables.update(state => ({
      ...state,
      list: [userTableDoc, externalTableDoc],
    }))

    const table = testStore.getDefaultDatasource()
    expect(table?.sourceType).toBe(DB_TYPE_EXTERNAL)
  })

  it("Select an appropriate default datasource - No Table and ignore user table", () => {
    tables.update(state => ({
      ...state,
      list: [userTableDoc],
    }))

    const table = testStore.getDefaultDatasource()
    expect(table).toBeUndefined()
  })

  it("Apply no migrations if component is not a formblock", () => {
    const comp = getComponentFixture(`${COMP_PREFIX}/container`).json()
    const orig = { ...comp }
    const migrated = testStore.migrateSettings(orig)

    expect(migrated).toBe(false)
    expect(comp).toStrictEqual(orig)
  })

  it("Should initialise the buttons prop if it didnt exist", () => {
    const formBlock = getComponentFixture(`${COMP_PREFIX}/formblock`).json()
    const migrated = testStore.migrateSettings(formBlock)

    expect(migrated).toBe(true)
    expect(formBlock.buttons).toEqual([])
  })

  it("Should initialise the buttons prop if it was nullified/reset", () => {
    const formBlock = getComponentFixture(`${COMP_PREFIX}/formblock`).json()
    formBlock.buttons = null
    const migrated = testStore.migrateSettings(formBlock)

    expect(migrated).toBe(true)
    expect(formBlock.buttons).toEqual([])
  })

  it("Should initialise formblock button position when not set", () => {
    const formBlock = getComponentFixture(`${COMP_PREFIX}/formblock`).json()
    const migrated = testStore.migrateSettings(formBlock)

    expect(migrated).toBe(true)
    expect(formBlock.buttonPosition).toEqual("top")
  })

  it("Should ignore formblock migration if already initialised", () => {
    const formBlock = getComponentFixture(`${COMP_PREFIX}/formblock`).json()
    formBlock.buttonPosition = "bottom"
    formBlock.buttons = []
    const migrated = testStore.migrateSettings(formBlock)

    expect(migrated).toBe(false)
    expect(formBlock.buttonPosition).toEqual("bottom")
  })

  it("enrichEmptySettings - initialise multifield type with schema keys", async () => {
    const coreScreen = getScreenFixture()

    baseInitialisation()

    const settings = testStore.getComponentSettings(
      `${COMP_PREFIX}/rowexplorer`
    )

    const multiFieldSetting = settings.find(s => s.type === "multifield")

    const comp = getComponentFixture(`${COMP_PREFIX}/rowexplorer`).json()
    testStore.enrichEmptySettings(comp, {
      parent: undefined,
      screen: coreScreen.json(),
      useDefaultValues: true,
    })

    const multifieldOptions = comp[multiFieldSetting!.key]

    expect(multifieldOptions).toStrictEqual(
      Object.keys(internalTableDoc.schema)
    )
  })

  const enrichSettingsDS = (type: string) => {
    const coreScreen = getScreenFixture()

    baseInitialisation()

    const comp = getComponentFixture(`${COMP_PREFIX}/${type}`).json()
    testStore.enrichEmptySettings(comp, {
      parent: undefined,
      screen: coreScreen.json(),
      useDefaultValues: true,
    })

    const settings = testStore.getComponentSettings(`${COMP_PREFIX}/${type}`)

    // Could be table or dataSource
    const settingKey = settings.find(
      s => s.type === "dataSource" || s.type === "table"
    )!.key
    const settingValue = comp[settingKey]

    expect(settingValue).toStrictEqual({
      label: internalTableDoc.name,
      tableId: internalTableDoc._id,
      resourceId: internalTableDoc._id,
      type: "table",
    })

    return comp
  }

  it("enrichEmptySettings - initialise cards blocks with correct fields", async () => {
    const comp = enrichSettingsDS("cardsblock")
    const expectBinding = (setting: string, ...parts: string[]) => {
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

  it("enrichEmptySettings - set default datasource for 'table' setting type", async () => {
    enrichSettingsDS("formblock")
  })

  it("enrichEmptySettings - set default datasource for 'dataSource' setting type", async () => {
    enrichSettingsDS("dataprovider")
  })

  it("enrichEmptySettings - set default datasource for type dataprovider", () => {
    const coreScreen = getScreenFixture()

    baseInitialisation()

    const componentDefs = componentDefinitionMap()
    const targetCompDef = componentDefs[`${COMP_PREFIX}/table`]

    const providerOne = getComponentFixture(`${COMP_PREFIX}/dataprovider`)
    const tableOne = getComponentFixture(`${COMP_PREFIX}/table`)

    const components = Array(10)
      .fill(undefined)
      .map(() => getComponentFixture(`${COMP_PREFIX}/container`))

    components.splice(5, 0, providerOne)
    components.push(tableOne)

    let nested = componentsToNested(components)
    coreScreen.addChild(nested)

    const comp = tableOne.json()
    testStore.enrichEmptySettings(comp, {
      parent: undefined,
      screen: coreScreen.json(),
      useDefaultValues: true,
    })
    const settingKey = targetCompDef.settings![0].key
    const settingValue = comp[settingKey]

    expect(settingValue).toBe(`{{ literal [${providerOne.json()._id}] }}`)
  })

  it("enrichEmptySettings - set default datasource for type dataprovider - get closest provider", () => {
    const coreScreen = getScreenFixture()

    baseInitialisation()

    const componentDefs = componentDefinitionMap()
    const targetCompDef = componentDefs[`${COMP_PREFIX}/table`]

    const providerOne = getComponentFixture(`${COMP_PREFIX}/dataprovider`)
    const providerTwo = getComponentFixture(`${COMP_PREFIX}/dataprovider`)
    const tableOne = getComponentFixture(`${COMP_PREFIX}/table`)

    const components = Array(10)
      .fill(undefined)
      .map(() => getComponentFixture(`${COMP_PREFIX}/container`))

    components.unshift(providerOne)
    components.splice(5, 0, providerTwo)
    components.push(tableOne)

    let nested = componentsToNested(components)
    coreScreen.addChild(nested)

    const comp = tableOne.json()
    testStore.enrichEmptySettings(comp, {
      parent: undefined,
      screen: coreScreen.json(),
      useDefaultValues: true,
    })
    const settingKey = targetCompDef.settings![0].key
    const settingValue = comp[settingKey]

    // Get the closest data provider in the tree.
    expect(settingValue).toBe(`{{ literal [${providerTwo.json()._id}] }}`)
  })

  it("enrichEmptySettings - set default datasource for type dataprovider - no providers in tree", () => {
    const coreScreen = getScreenFixture()

    baseInitialisation()

    const componentDefs = componentDefinitionMap()
    const targetCompDef = componentDefs[`${COMP_PREFIX}/table`]

    const tableOne = getComponentFixture(`${COMP_PREFIX}/table`)
    const components = Array(10)
      .fill(undefined)
      .map(() => getComponentFixture(`${COMP_PREFIX}/container`))

    components.push(tableOne)

    let nested = componentsToNested(components)
    coreScreen.addChild(nested)

    const comp = tableOne.json()
    testStore.enrichEmptySettings(comp, {
      parent: undefined,
      screen: coreScreen.json(),
      useDefaultValues: true,
    })
    const settingKey = targetCompDef.settings![0].key
    const settingValue = comp[settingKey]

    // The value should remain unset
    expect(settingValue).toBeUndefined()
  })

  it("updateComponentSetting - skip the update if the request is invalid", () => {
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
    const update = testStore.updateComponentSetting("", {
      ...query,
      queryParams: { some_val: "4567" },
    })

    const updated = update(provider)

    // Update ignored as the name was invalid
    expect(updated).toBe(false)

    // Now attempt with no component.
    const updateNoComp = testStore.updateComponentSetting("dataSource", {
      ...query,
      queryParams: { some_val: "8910" },
    })

    const updated_NoComp = updateNoComp(undefined!)

    expect(updated_NoComp).toBe(false)

    // No change expected to the original component
    // The dataSource should still be unset
    expect(provider["dataSource"]).toBeUndefined()
  })

  it("updateComponentSetting - ignore 'resetOn' behaviour if query datasource is updated but not replaced", () => {
    // A unique scenario where simply altering the datasource and not replacing it
    // should not trigger a reset of related settings like filter.

    baseInitialisation()

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
    const update = testStore.updateComponentSetting("dataSource", {
      ...query,
      queryParams: { some_val: "4567" },
    })

    const updated = update(provider)
    expect(updated).toBe(true)

    // The update should have gone ahead
    expect(provider["dataSource"].queryParams.some_val).toBe("4567")

    // filter should remain intact
    expect(provider["filter"]).toStrictEqual(filter)
  })

  it("updateComponentSetting - resetOn should clear target setting if the datasource is replaced completely.", () => {
    baseInitialisation()

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
    const update = testStore.updateComponentSetting("dataSource", query2)

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
  it("updateComponentSetting - 'resetOn' multi-field config should trigger for all configured fields.", () => {
    baseInitialisation()

    // Base config for a formBlock
    const genConfig = (source: Table) => {
      return {
        buttons: [
          ...Utils.buildFormBlockButtonConfig({
            _id: formBlock._id,
            actionType: formBlock["actionType"],
            dataSource: {
              type: "table",
              label: internalTableDoc.name,
              tableId: internalTableDoc._id!,
              resourceId: internalTableDoc._id!,
            },
          })!,
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
    const update = testStore.updateComponentSetting(
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
    const update2 = testStore.updateComponentSetting("actionType", "Create")
    const updated2 = update2(formBlock2)
    expect(updated2).toBe(true)

    //Again, buttons should be clear
    expect(formBlock2["buttons"]).toBeNull()
    // fields should be unaffected
    expect(formBlock2["fields"]).not.toBeNull()
  })

  it("updateComponentSetting - should clear if the view name has changed. Legacy views", () => {
    // Legacy views don't have a discernable resource id beyond the name.

    baseInitialisation()

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

    const update = testStore.updateComponentSetting("dataSource", view2)
    const updated = update(provider)

    // Update ignored as the name was invalid
    expect(updated).toBe(true)

    expect(provider.dataSource.name).toBe("Sample Two")
    expect(provider.filter).toBeNull()
  })

  it("updateComponentSetting - should clear if the view name is exactly the same but is in another table. Legacy views", () => {
    baseInitialisation()

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

    const update = testStore.updateComponentSetting("dataSource", view2)
    const updated = update(provider)

    // Update ignored as the name was invalid
    expect(updated).toBe(true)

    expect(provider.dataSource.name).toBe("Sample")
    expect(provider.dataSource.tableId).toBe(externalTableDoc._id)
    expect(provider.filter).toBeNull()
  })

  it("updateComponentSetting - Should gracefully handle not having an initial dataSource", () => {
    // Unlikely due to enriching and migrations, but it should handle it.

    baseInitialisation()

    const providerOne = getComponentFixture(`${COMP_PREFIX}/dataprovider`)
    const provider = providerOne.json()

    const view2 = {
      name: "Sample",
      tableId: externalTableDoc._id,
      type: "view",
    }

    const update = testStore.updateComponentSetting("dataSource", view2)
    const updated = update(provider)

    // Update ignored as the name was invalid
    expect(updated).toBe(true)

    expect(provider.dataSource.name).toBe("Sample")
    expect(provider.dataSource.tableId).toBe(externalTableDoc._id)
  })
})
