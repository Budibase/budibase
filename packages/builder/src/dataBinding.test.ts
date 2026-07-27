import { expect, describe, it, vi } from "vitest"
import {
  buildFormSchema,
  getActionBindings,
  getActionProviders,
  getAllAssets,
  getAllComponentContexts,
  getAllStateVariables,
  getAuthBindings,
  getBindableProperties,
  getComponentBindableProperties,
  getDatasourceForProvider,
  getEnvironmentBindings,
  getEventContextBindings,
  getRestBindings,
  getSchemaForDatasourcePlus,
  getSettingBindings,
  runtimeToReadableBinding,
  readableToRuntimeBinding,
  updateReferencesInObject,
  migrateReferencesInObject,
  removeBindings,
  getSchemaForDatasource,
  makeReadableKeyPropSafe,
  makeStateBinding,
  readableToRuntimeMap,
  runtimeToReadableMap,
  extractLiteralHandlebarsID,
  toBindingsArray,
} from "@/dataBinding"
import { JSONUtils } from "@budibase/frontend-core"
import { CalculationType } from "@budibase/types"
import type { Component, ComponentDefinition } from "@budibase/types"

interface MockStore<T> {
  subscribe: (run: (value: T) => void) => () => void
  set: (newValue: T) => void
  update: (updater: (value: T) => T) => void
  _value: () => T
}

function createMockStore<T>(initialValue: T): MockStore<T> {
  let value = initialValue
  return {
    subscribe: run => {
      run(value)
      return () => {}
    },
    set: newValue => {
      value = newValue
    },
    update: updater => {
      value = updater(value)
    },
    _value: () => value,
  }
}

interface MockComponentStore {
  definitions: Record<string, ComponentDefinition>
  settings: Record<
    string,
    Array<{ key: string; type: string } & Record<string, unknown>>
  >
  getDefinition: (component: string | undefined) => ComponentDefinition | null
  getComponentSettings: (
    component: string | undefined
  ) => Array<{ key: string; type: string } & Record<string, unknown>>
  setDefinition: (component: string, definition: ComponentDefinition) => void
  setSettings: (
    component: string,
    settings: Array<{ key: string; type: string } & Record<string, unknown>>
  ) => void
  reset: () => void
  subscribe: (
    run: (value: { components: Record<string, ComponentDefinition> }) => void
  ) => () => void
}

const makeComponent = (
  component: Pick<Component, "_component" | "_instanceName"> &
    Partial<Component>
): Component => ({
  _styles: {},
  ...component,
})

const makeComponentDefinition = (
  definition: Partial<ComponentDefinition> = {}
): ComponentDefinition => ({
  component: "component",
  name: "Component",
  legalDirectChildren: [],
  illegalChildren: [],
  ...definition,
})

function createBuilderStores() {
  const workspaceAppStore = {}
  const tables = createMockStore({ list: [] })
  const queries = createMockStore({ list: [] })
  const roles = createMockStore({ list: [] })
  const screenStore = createMockStore({ screens: [] })
  const appStore = createMockStore({})
  const layoutStore = createMockStore({})
  const selectedScreen = createMockStore(null)
  const componentStore: MockComponentStore = {
    definitions: {},
    settings: {},
    getDefinition(component) {
      return component ? this.definitions[component] || null : null
    },
    getComponentSettings(component) {
      return component ? this.settings[component] || [] : []
    },
    setDefinition(component, definition) {
      this.definitions[component] = definition
    },
    setSettings(component, settings) {
      this.settings[component] = settings
    },
    reset() {
      this.definitions = {}
      this.settings = {}
    },
    subscribe(run) {
      run({ components: this.definitions })
      return () => {}
    },
  }

  return {
    module: {
      workspaceAppStore,
      tables,
      queries,
      roles,
      screenStore,
      appStore,
      layoutStore,
      selectedScreen,
      componentStore,
    },
    appStore,
    layoutStore,
    roles,
    screenStore,
    selectedScreen,
    componentStore,
    tables,
    queries,
  }
}

vi.mock("@/stores/builder", () => createBuilderStores().module)

function createPortalStores() {
  return {
    module: {
      environment: createMockStore({ variables: [] }),
      licensing: createMockStore({ environmentVariablesEnabled: false }),
    },
  }
}

vi.mock("@/stores/portal", () => createPortalStores().module)

import {
  appStore,
  componentStore,
  layoutStore,
  roles as rolesStore,
  screenStore,
  selectedScreen,
  tables as tablesStore,
  queries as queriesStore,
} from "@/stores/builder"
import { environment, licensing } from "@/stores/portal"

const getTablesStore = () =>
  tablesStore as unknown as MockStore<{ list: unknown[] }>
const getQueriesStore = () =>
  queriesStore as unknown as MockStore<{ list: unknown[] }>
const getAppStore = () =>
  appStore as unknown as MockStore<Record<string, unknown>>
const getLayoutStore = () =>
  layoutStore as unknown as MockStore<Record<string, unknown>>
const getRolesStore = () => rolesStore as unknown as MockStore<unknown[]>
const getScreenStore = () =>
  screenStore as unknown as MockStore<Record<string, unknown>>
const getSelectedScreenStore = () =>
  selectedScreen as unknown as MockStore<unknown>
const getComponentStore = () => componentStore as unknown as MockComponentStore
const getEnvironmentStore = () =>
  environment as unknown as MockStore<{ variables: Array<{ name: string }> }>
const getLicensingStore = () =>
  licensing as unknown as MockStore<{ environmentVariablesEnabled: boolean }>

describe("Builder dataBinding", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getTablesStore().set({ list: [] })
    getQueriesStore().set({ list: [] })
    getAppStore().set({})
    getLayoutStore().set({})
    getRolesStore().set([])
    getScreenStore().set({ screens: [] })
    getSelectedScreenStore().set(null)
    getComponentStore().reset()
    getEnvironmentStore().set({ variables: [] })
    getLicensingStore().set({ environmentVariablesEnabled: false })
  })

  describe("makeReadableKeyPropSafe", () => {
    it("wraps readable binding segments containing spaces", () => {
      expect(makeReadableKeyPropSafe("Query rows")).toBe("[Query rows]")
    })

    it("preserves readable binding segments without spaces", () => {
      expect(makeReadableKeyPropSafe("rows")).toBe("rows")
    })

    it("preserves already wrapped readable binding segments", () => {
      expect(makeReadableKeyPropSafe("[Query rows]")).toBe("[Query rows]")
    })
  })

  describe("runtimeToReadableBinding", () => {
    const bindableProperties = [
      {
        category: "Current User",
        icon: "user",
        providerId: "user",
        readableBinding: "Current User.firstName",
        runtimeBinding: "[user].[firstName]",
        type: "context",
      },
      {
        category: "Bindings",
        icon: "brackets-angle",
        readableBinding: "Binding.count",
        runtimeBinding: "count",
        type: "context",
      },
      {
        category: "Current User",
        icon: "user",
        providerId: "user",
        readableBinding: "Current User.fullName",
        runtimeBinding: "[user].[fullName]",
        type: "context",
      },
    ]
    it("should convert a runtime binding to a readable one", () => {
      const textWithBindings = `Hello {{ [user].[firstName] }}! The count is {{ count }}.`
      expect(
        runtimeToReadableBinding(bindableProperties, textWithBindings)
      ).toEqual(
        `Hello {{ Current User.firstName }}! The count is {{ Binding.count }}.`
      )
    })

    it("should not convert to readable binding if it is already readable", () => {
      const textWithBindings = `Hello {{ [user].[firstName] }}! The count is {{ Binding.count }}.`
      expect(
        runtimeToReadableBinding(bindableProperties, textWithBindings)
      ).toEqual(
        `Hello {{ Current User.firstName }}! The count is {{ Binding.count }}.`
      )
    })

    it("should convert fullName user bindings to readable format", () => {
      const textWithBindings = `Hello {{ [user].[fullName] }}`
      expect(
        runtimeToReadableBinding(bindableProperties, textWithBindings)
      ).toEqual(`Hello {{ Current User.fullName }}`)
    })
  })

  describe("readableToRuntimeBinding", () => {
    const bindableProperties = [
      {
        category: "Current User",
        icon: "user",
        providerId: "user",
        readableBinding: "Current User.firstName",
        runtimeBinding: "[user].[firstName]",
        type: "context",
      },
      {
        category: "Bindings",
        icon: "brackets-angle",
        readableBinding: "Binding.count",
        runtimeBinding: "count",
        type: "context",
      },
      {
        category: "Bindings",
        icon: "brackets-angle",
        readableBinding: "location",
        runtimeBinding: "[location]",
        type: "context",
      },
      {
        category: "Bindings",
        icon: "brackets-angle",
        readableBinding: "foo.[bar]",
        runtimeBinding: "[foo].[qwe]",
        type: "context",
      },
      {
        category: "Bindings",
        icon: "brackets-angle",
        readableBinding: "foo.baz",
        runtimeBinding: "[foo].[baz]",
        type: "context",
      },
      {
        category: "Current User",
        icon: "user",
        providerId: "user",
        readableBinding: "Current User.fullName",
        runtimeBinding: "[user].[fullName]",
        type: "context",
      },
    ]
    it("should convert a readable binding to a runtime one", () => {
      const textWithBindings = `Hello {{ Current User.firstName }}! The count is {{ Binding.count }}.`
      expect(
        readableToRuntimeBinding(bindableProperties, textWithBindings)
      ).toEqual(`Hello {{ [user].[firstName] }}! The count is {{ count }}.`)
    })
    it("should not convert a partial match", () => {
      const textWithBindings = `location {{ _location Zlocation location locationZ _location_ }}`
      expect(
        readableToRuntimeBinding(bindableProperties, textWithBindings)
      ).toEqual(
        `location {{ _location Zlocation [location] locationZ _location_ }}`
      )
    })
    it("should handle special characters in the readable binding", () => {
      const textWithBindings = `{{ foo.baz }}`
      expect(
        readableToRuntimeBinding(bindableProperties, textWithBindings)
      ).toEqual(`{{ [foo].[baz] }}`)
    })

    it("should convert fullName user bindings to runtime format", () => {
      const textWithBindings = `{{ Current User.fullName }}`
      expect(
        readableToRuntimeBinding(bindableProperties, textWithBindings)
      ).toEqual(`{{ [user].[fullName] }}`)
    })
  })

  describe("binding maps", () => {
    const bindableProperties = [
      {
        readableBinding: "Current User.firstName",
        runtimeBinding: "[user].[firstName]",
      },
      {
        readableBinding: "Binding.count",
        runtimeBinding: "count",
      },
    ]

    it("converts each readable value in a map to runtime binding syntax", () => {
      expect(
        readableToRuntimeMap(bindableProperties, {
          greeting: "Hello {{ Current User.firstName }}",
          count: "{{ Binding.count }}",
        })
      ).toEqual({
        greeting: "Hello {{ [user].[firstName] }}",
        count: "{{ count }}",
      })
    })

    it("converts each runtime value in a map to readable binding syntax", () => {
      expect(
        runtimeToReadableMap(bindableProperties, {
          greeting: "Hello {{ [user].[firstName] }}",
          count: "{{ count }}",
        })
      ).toEqual({
        greeting: "Hello {{ Current User.firstName }}",
        count: "{{ Binding.count }}",
      })
    })
  })

  describe("binding list helpers", () => {
    it("converts value maps into binding arrays and skips empty keys", () => {
      expect(
        toBindingsArray({ first: true, "": true }, "Prefix", "Category")
      ).toEqual([
        {
          type: "context",
          runtimeBinding: "first",
          readableBinding: "Prefix.first",
          icon: "brackets-angle",
          category: "Category",
        },
      ])
    })

    it("returns an empty binding map when inputs are missing", () => {
      expect(readableToRuntimeMap([], undefined)).toEqual({})
      expect(runtimeToReadableMap([], undefined)).toEqual({})
      expect(toBindingsArray(undefined, "Prefix")).toEqual([])
    })

    it("builds auth, environment, rest, setting, and state bindings", () => {
      getEnvironmentStore().set({
        variables: [{ name: "API Key" }, { name: "region" }],
      })
      getLicensingStore().set({ environmentVariablesEnabled: true })

      expect(getAuthBindings()).toMatchObject([
        {
          runtimeBinding: "[user].[oauth2].[accessToken]",
          readableBinding: "Current User.OAuthToken",
          category: "Current User",
        },
      ])
      expect(getEnvironmentBindings()).toMatchObject([
        {
          runtimeBinding: "env.[API Key]",
          readableBinding: "env.API Key",
          category: "Environment",
        },
        {
          runtimeBinding: "env.[region]",
          readableBinding: "env.region",
          category: "Environment",
        },
      ])
      expect(getRestBindings().map(binding => binding.readableBinding)).toEqual(
        [
          "Current User.fullName",
          "Current User.globalId",
          "Current User.OAuthToken",
          "env.API Key",
          "env.region",
        ]
      )
      expect(
        getSettingBindings().map(binding => binding.runtimeBinding)
      ).toEqual([
        "[settings].[url]",
        "[settings].[logo]",
        "[settings].[company]",
      ])
      expect(makeStateBinding("filter value")).toMatchObject({
        runtimeBinding: "[state].[filter value]",
        readableBinding: "State.filter value",
        category: "State",
      })
    })
  })

  describe("action and event context bindings", () => {
    it("returns action context bindings for preceding actions", () => {
      expect(
        getActionBindings(
          [
            { id: "save", "##eventHandlerType": "Save Row" },
            { id: "query", "##eventHandlerType": "Execute Query" },
            { id: "notification", "##eventHandlerType": "Show Notification" },
          ],
          "notification"
        )
      ).toMatchObject([
        {
          readableBinding: "Action 1.Saved row",
          runtimeBinding: "actions.0.row",
          category: "Actions",
        },
        {
          readableBinding: "Action 2.Query result",
          runtimeBinding: "actions.1.result",
          category: "Actions",
        },
      ])
    })

    it("returns no action context bindings when the action is not found", () => {
      expect(getActionBindings([{ id: "save" }], "missing")).toEqual([])
    })

    it("builds bindings from component event setting context", () => {
      const componentInstance = makeComponent({
        _id: "button_1",
        _component: "button",
        _instanceName: "Save Button",
      })

      getComponentStore().setSettings("button", [
        {
          key: "onClick",
          type: "event",
          context: [{ key: "row.id", label: "Clicked Row ID" }],
        },
      ])

      expect(
        getEventContextBindings({
          settingKey: "onClick",
          componentInstance,
          componentDefinition: makeComponentDefinition({ icon: "cursor" }),
        })
      ).toEqual([
        {
          readableBinding: "Clicked Row ID",
          runtimeBinding: "[eventContext].[row.id]",
          category: "Save Button",
          icon: "cursor",
          display: {
            name: "Clicked Row ID",
          },
        },
      ])
    })
  })

  describe("extractLiteralHandlebarsID", () => {
    it("extracts component ids from literal handlebars bindings", () => {
      expect(extractLiteralHandlebarsID("{{ literal [component-id] }}")).toBe(
        "component-id"
      )
    })

    it("returns null when the value is not a literal handlebars binding", () => {
      expect(extractLiteralHandlebarsID("{{ actions.0.row }}")).toBeNull()
      expect(extractLiteralHandlebarsID(null)).toBeNull()
    })
  })

  describe("datasource providers and form schemas", () => {
    it("resolves string and object datasource settings from provider components", () => {
      getComponentStore().setSettings("provider", [
        { key: "dataSource", type: "dataSource" },
      ])

      expect(
        getDatasourceForProvider(
          null,
          makeComponent({
            _id: "provider_1",
            _component: "provider",
            _instanceName: "Provider",
            dataSource: "table_1",
          })
        )
      ).toEqual({
        type: "table",
        tableId: "table_1",
      })

      expect(
        getDatasourceForProvider(
          null,
          makeComponent({
            _id: "provider_2",
            _component: "provider",
            _instanceName: "Provider",
            dataSource: { type: "query", _id: "query_1" },
          })
        )
      ).toEqual({
        type: "query",
        _id: "query_1",
      })
    })

    it("follows dataProvider settings to another component", () => {
      getComponentStore().setSettings("consumer", [
        { key: "provider", type: "dataProvider" },
      ])
      getComponentStore().setSettings("provider", [
        { key: "dataSource", type: "dataSource" },
      ])

      const consumer = makeComponent({
        _id: "consumer_1",
        _component: "consumer",
        _instanceName: "Consumer",
        provider: "{{ literal [provider_1] }}",
      })
      const provider = makeComponent({
        _id: "provider_1",
        _component: "provider",
        _instanceName: "Provider",
        dataSource: { type: "table", tableId: "table_1" },
      })
      const asset = {
        props: makeComponent({
          _id: "root",
          _component: "root",
          _instanceName: "Root",
          _children: [consumer, provider],
        }),
      }

      expect(getDatasourceForProvider(asset, consumer)).toEqual({
        type: "table",
        tableId: "table_1",
      })
    })

    it("builds form schemas from field components", () => {
      getComponentStore().setSettings("textField", [
        { key: "field", type: "field/string" },
      ])
      getComponentStore().setSettings("numberField", [
        { key: "field", type: "field/number" },
      ])

      expect(
        buildFormSchema(
          makeComponent({
            _id: "form",
            _component: "form",
            _instanceName: "Form",
            _children: [
              makeComponent({
                _id: "name",
                _component: "textField",
                _instanceName: "Name Field",
                field: "name",
              }),
              makeComponent({
                _id: "age",
                _component: "numberField",
                _instanceName: "Age",
              }),
            ],
          })
        )
      ).toEqual({
        name: { type: "string" },
        Age: { type: "number" },
      })
    })

    it("builds formblock schemas from active configured fields", () => {
      getComponentStore().setSettings("formblock", [
        { key: "dataSource", type: "dataSource" },
      ])
      getTablesStore().set({
        list: [
          {
            _id: "table_1",
            schema: {
              name: { type: "string", name: "name" },
              age: { type: "number", name: "age" },
            },
          },
        ],
      })

      expect(
        buildFormSchema(
          makeComponent({
            _id: "formblock_1",
            _component: "formblock",
            _instanceName: "Form block",
            dataSource: { type: "table", tableId: "table_1" },
            fields: [
              { field: "name", active: true },
              { field: "age", active: false },
            ],
          }),
          {}
        )
      ).toEqual({
        name: { type: "string" },
      })
    })
  })

  describe("component context bindings", () => {
    const createContextAsset = () => {
      const provider = makeComponent({
        _id: "provider_1",
        _component: "staticProvider",
        _instanceName: "Provider",
      })
      const target = makeComponent({
        _id: "target_1",
        _component: "button",
        _instanceName: "Target",
      })
      return {
        provider,
        target,
        asset: {
          routing: {
            route: "/customers/:customerId/details/:tab?",
          },
          props: makeComponent({
            _id: "root",
            _component: "container",
            _instanceName: "Root",
            _children: [provider, target],
          }),
        },
      }
    }

    beforeEach(() => {
      getComponentStore().setDefinition(
        "staticProvider",
        makeComponentDefinition({
          component: "staticProvider",
          name: "Static Provider",
          icon: "database",
          context: {
            type: "static",
            values: [
              { key: "total", label: "Total Count", type: "number" },
              { key: "status", label: "Status", type: "string" },
            ],
          },
          actions: [{ type: "refresh", suffix: "reload" }],
        })
      )
      getComponentStore().setDefinition(
        "button",
        makeComponentDefinition({
          component: "button",
          name: "Button",
          icon: "cursor",
        })
      )
    })

    it("builds bindable properties exposed by a component context", () => {
      const { asset } = createContextAsset()

      expect(getComponentBindableProperties(asset, "provider_1")).toMatchObject(
        [
          {
            runtimeBinding: "[provider_1].[status]",
            readableBinding: "Provider.Status",
            providerId: "provider_1",
            category: "Provider",
            icon: "database",
            display: {
              name: "Status",
              type: "string",
            },
          },
          {
            runtimeBinding: "[provider_1].[total]",
            readableBinding: "Provider.[Total Count]",
            providerId: "provider_1",
            category: "Provider",
            icon: "database",
            display: {
              name: "Total Count",
              type: "number",
            },
          },
        ]
      )
    })

    it("discovers global contexts available to another component", () => {
      const { asset } = createContextAsset()

      expect(getAllComponentContexts(asset, "target_1")).toMatchObject([
        {
          component: {
            _id: "provider_1",
            _instanceName: "Provider",
          },
          contexts: [
            {
              type: "static",
            },
            {
              type: "action",
            },
          ],
        },
      ])
    })

    it("returns action providers matching an action type", () => {
      const { asset } = createContextAsset()

      expect(getActionProviders(asset, "target_1", "refresh")).toEqual([
        {
          readableBinding: "Provider",
          runtimeBinding: "provider_1-reload",
        },
      ])
      expect(getActionProviders(asset, "target_1", "missing")).toEqual([])
    })

    it("combines context, URL, role, state, device, and embed bindings", () => {
      const { asset } = createContextAsset()

      getAppStore().set({
        clientFeatures: {
          deviceAwareness: true,
          rowSelection: true,
          state: true,
        },
      })
      getRolesStore().set([
        {
          _id: "role_1",
          name: "Admin",
          uiMetadata: {
            displayName: "Administrator",
          },
        },
      ])
      getScreenStore().set({
        screens: [
          {
            props: asset.props,
            onLoad: [
              {
                "##eventHandlerType": "Update State",
                parameters: {
                  type: "set",
                  key: "loaded",
                  value: "yes",
                },
              },
            ],
          },
        ],
      })

      const bindings = getBindableProperties(asset, "target_1")

      expect(bindings.map(binding => binding.readableBinding)).toEqual(
        expect.arrayContaining([
          "Provider.Status",
          "Provider.[Total Count]",
          "URL.customerId",
          "URL.tab",
          "Query params",
          "State.loaded",
          "Device.Mobile",
          "Device.Tablet",
          "App.Theme",
          "Role.Administrator",
          "ParentWindow",
        ])
      )
    })
  })

  describe("assets and state variables", () => {
    it("combines layouts and screens into all assets", () => {
      getLayoutStore().set({
        layouts: [{ _id: "layout_1" }],
      })
      getScreenStore().set({
        screens: [{ _id: "screen_1" }],
      })

      expect(getAllAssets()).toEqual([{ _id: "layout_1" }, { _id: "screen_1" }])
    })

    it("extracts state variables from component events and screen onLoad", () => {
      getComponentStore().setSettings("button", [
        { key: "onClick", type: "event" },
        { key: "menuItems", type: "componentConfiguration" },
      ])
      getComponentStore().setSettings("menuItem", [
        { key: "onSelect", type: "event" },
      ])

      const screen = {
        props: {
          _id: "root",
          _component: "container",
          _instanceName: "Root",
          _children: [
            {
              _id: "button_1",
              _component: "button",
              _instanceName: "Button",
              onClick: [
                {
                  "##eventHandlerType": "Update State",
                  parameters: {
                    type: "set",
                    key: "clicked",
                    value: "yes",
                  },
                },
              ],
              menuItems: [
                {
                  _component: "menuItem",
                  onSelect: [
                    {
                      "##eventHandlerType": "Update State",
                      parameters: {
                        type: "set",
                        key: "selected",
                        value: "yes",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        onLoad: [
          {
            "##eventHandlerType": "Update State",
            parameters: {
              type: "set",
              key: "loaded",
              value: "yes",
            },
          },
        ],
      }

      getScreenStore().set({
        screens: [screen],
      })

      expect(getAllStateVariables().sort()).toEqual([
        "clicked",
        "loaded",
        "selected",
      ])
      expect(getAllStateVariables(screen).sort()).toEqual([
        "clicked",
        "loaded",
        "selected",
      ])
    })

    it("ignores update state actions without set values", () => {
      expect(
        getAllStateVariables({
          props: {
            _id: "root",
            _component: "container",
            _instanceName: "Root",
          },
          onLoad: [
            {
              "##eventHandlerType": "Update State",
              parameters: {
                type: "delete",
                key: "ignored",
                value: "yes",
              },
            },
            {
              "##eventHandlerType": "Update State",
              parameters: {
                type: "set",
                key: "empty",
                value: "",
              },
            },
          ],
        })
      ).toEqual([])
    })
  })

  describe("getSchemaForDatasource", () => {
    const tableId = "table_1"
    const fieldName = "jsonColumn"

    beforeEach(() => {
      getTablesStore().set({ list: [] })
      getQueriesStore().set({ list: [] })
    })

    it("uses json field schema when it contains a nested schema", () => {
      const tablesStore = getTablesStore()
      const jsonFieldSchema = {
        type: "json",
        name: fieldName,
        schema: {
          first: { type: "string", name: "first" },
          nested: {
            type: "json",
            name: "nested",
            schema: {
              deep: { type: "number", name: "deep" },
            },
          },
        },
      }

      tablesStore.set({
        list: [
          {
            _id: tableId,
            schema: {
              [fieldName]: jsonFieldSchema,
            },
          },
        ],
      })

      const jsonArraySpy = vi.spyOn(JSONUtils, "getJSONArrayDatasourceSchema")

      const datasource = {
        type: "jsonarray",
        tableId,
        fieldName,
        label: `${tableId}.${fieldName}`,
      }

      const { schema } = getSchemaForDatasource(null, datasource)

      expect(jsonArraySpy).not.toHaveBeenCalled()
      expect(schema.first).toMatchObject({ type: "string", name: "first" })
      expect(schema.nested).toMatchObject({ type: "json", name: "nested" })
      expect(schema["nested.deep"]).toMatchObject({
        type: "number",
        name: "nested.deep",
      })

      schema.first.type = "boolean"
      expect(jsonFieldSchema.schema.first.type).toBe("string")

      jsonArraySpy.mockRestore()
    })

    it("builds schemas for internal table datasources", () => {
      getTablesStore().set({
        list: [
          {
            _id: tableId,
            name: "Customers",
            sourceType: "internal",
            schema: {
              name: { type: "string", name: "name" },
              age: { type: "number", name: "age" },
            },
          },
        ],
      })

      const { schema, table } = getSchemaForDatasource(null, {
        type: "table",
        tableId,
      })

      expect(table).toMatchObject({ _id: tableId, name: "Customers" })
      expect(schema).toMatchObject({
        _id: { type: "string", name: "_id" },
        _rev: { type: "string", name: "_rev" },
        name: { type: "string", name: "name" },
        age: { type: "number", name: "age" },
      })
    })

    it("omits generated id fields from form schemas", () => {
      getTablesStore().set({
        list: [
          {
            _id: tableId,
            sourceType: "internal",
            schema: {
              name: { type: "string", name: "name" },
            },
          },
        ],
      })

      const { schema } = getSchemaForDatasource(
        null,
        {
          type: "table",
          tableId,
        },
        { formSchema: true }
      )

      expect(schema).toEqual({
        name: {
          type: "string",
          name: "name",
          display: {
            name: "name",
            type: "Text",
          },
        },
      })
    })

    it("only exposes visible fields for viewV2 datasources", () => {
      getTablesStore().set({
        list: [
          {
            _id: tableId,
            sourceType: "external",
            views: {
              view: {
                id: "view_1",
                name: "Active customers",
                schema: {
                  visible: { type: "string", name: "visible", visible: true },
                  hidden: { type: "string", name: "hidden", visible: false },
                },
              },
            },
          },
        ],
      })

      const { schema } = getSchemaForDatasource(null, {
        type: "viewV2",
        id: "view_1",
        tableId,
      })

      expect(schema.visible).toMatchObject({ name: "visible" })
      expect(schema.hidden).toBeUndefined()
      expect(schema._id).toMatchObject({ name: "_id" })
    })

    it("includes calculation fields for viewV2 datasources", () => {
      getTablesStore().set({
        list: [
          {
            _id: tableId,
            sourceType: "external",
            views: {
              view: {
                id: "view_1",
                name: "Active customers",
                schema: {
                  sum: {
                    visible: true,
                    calculationType: CalculationType.SUM,
                    field: "Price",
                  },
                },
              },
            },
          },
        ],
      })

      const { schema } = getSchemaForDatasource(null, {
        type: "viewV2",
        id: "view_1",
        tableId,
      })

      expect(schema.sum).toMatchObject({
        name: "sum",
        calculationType: CalculationType.SUM,
        field: "Price",
        type: "number",
      })
    })

    it("builds schemas for field datasources", () => {
      expect(
        getSchemaForDatasource(null, {
          type: "field",
          fieldName: "attachments",
          fieldType: "attachment",
        }).schema
      ).toMatchObject({
        url: { type: "string", name: "url" },
        name: { type: "string", name: "name" },
      })

      expect(
        getSchemaForDatasource(null, {
          type: "field",
          fieldName: "tags",
          fieldType: "array",
        }).schema
      ).toMatchObject({
        value: { type: "string", name: "value" },
      })
    })

    it("falls back to the JSON utility when no nested schema is provided", () => {
      const tablesStore = getTablesStore()
      const tableSchema = {
        [fieldName]: {
          type: "json",
          name: fieldName,
        },
      }

      tablesStore.set({
        list: [
          {
            _id: tableId,
            schema: tableSchema,
          },
        ],
      })

      const jsonArraySpy = vi
        .spyOn(JSONUtils, "getJSONArrayDatasourceSchema")
        .mockReturnValue({
          value: { type: "string", name: "value", prefixKeys: "" },
        })

      const datasource = {
        type: "jsonarray",
        tableId,
        fieldName,
        label: `${tableId}.${fieldName}`,
      }

      const { schema } = getSchemaForDatasource(null, datasource)

      expect(jsonArraySpy).toHaveBeenCalledWith(tableSchema, datasource)
      expect(schema.value).toMatchObject({ type: "string", name: "value" })
      expect(typeof schema.value.display?.type).toBe("string")

      jsonArraySpy.mockRestore()
    })

    it("uses query parameters as the form schema for query datasources", () => {
      const queryId = "query_1"

      getQueriesStore().set({
        list: [
          {
            _id: queryId,
            schema: {
              ignored: { type: "string", name: "ignored" },
            },
            parameters: [
              { name: "search", default: "active" },
              { name: "invalidDefault", default: null },
              { name: null, default: "active" },
            ],
          },
        ],
      })

      const { schema } = getSchemaForDatasource(
        null,
        {
          type: "query",
          _id: queryId,
        },
        { formSchema: true }
      )

      expect(schema).toEqual({
        search: {
          name: "search",
          default: "active",
          type: "string",
          display: {
            name: "search",
            type: "Text",
          },
        },
      })
    })

    it("uses query schema when query datasources are not form/search schemas", () => {
      const queryId = "query_1"

      getQueriesStore().set({
        list: [
          {
            _id: queryId,
            schema: {
              result: { type: "string", name: "result" },
            },
            parameters: [{ name: "ignored", default: "" }],
          },
        ],
      })

      const { schema } = getSchemaForDatasource(null, {
        type: "query",
        _id: queryId,
      })

      expect(schema).toMatchObject({
        result: { type: "string", name: "result" },
      })
      expect(schema.ignored).toBeUndefined()
    })

    it("builds queryarray schemas from query nested schemas", () => {
      const queryArraySpy = vi
        .spyOn(JSONUtils, "generateQueryArraySchemas")
        .mockReturnValue({
          rows: { type: "json", name: "rows" },
        })
      const jsonArraySpy = vi
        .spyOn(JSONUtils, "getJSONArrayDatasourceSchema")
        .mockReturnValue({
          value: { type: "string", name: "value", prefixKeys: "" },
        })

      getQueriesStore().set({
        list: [
          {
            _id: "query_1",
            schema: {
              rows: { type: "json", name: "rows" },
            },
            nestedSchemaFields: {
              rows: {
                value: { type: "string", name: "value" },
              },
            },
          },
        ],
      })

      const datasource = {
        type: "queryarray",
        tableId: "query_1",
        fieldName: "rows",
      }
      const { schema } = getSchemaForDatasource(null, datasource)

      expect(queryArraySpy).toHaveBeenCalled()
      expect(jsonArraySpy).toHaveBeenCalledWith(
        {
          rows: expect.objectContaining({ name: "rows" }),
        },
        datasource
      )
      expect(schema.value).toMatchObject({ type: "string", name: "value" })

      queryArraySpy.mockRestore()
      jsonArraySpy.mockRestore()
    })

    it("routes datasource plus lookups to table and view datasources", () => {
      getTablesStore().set({
        list: [
          {
            _id: tableId,
            schema: {
              title: { type: "string", name: "title" },
            },
          },
          {
            _id: "ta_view",
            views: {
              view: {
                id: "view_ta_view_active",
                name: "Active",
                schema: {
                  status: { type: "string", name: "status", visible: true },
                },
              },
            },
          },
        ],
      })

      expect(getSchemaForDatasourcePlus(tableId).schema.title).toMatchObject({
        name: "title",
      })
      expect(
        getSchemaForDatasourcePlus("view_ta_view_active").schema.status
      ).toMatchObject({
        name: "status",
      })
      expect(getSchemaForDatasourcePlus(undefined).schema).toEqual({})
    })
  })

  describe("updateReferencesInObject", () => {
    it("should increment steps in sequence on 'add'", () => {
      let obj = [
        {
          id: "a0",
          parameters: {
            text: "Alpha",
          },
        },
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.1.row }}",
          },
        },
        {
          id: "c3",
          parameters: {
            text: "Carrot {{ actions.1.row }}",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.3.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.4.row }}",
          },
        },
      ]
      updateReferencesInObject({
        obj,
        modifiedIndex: 0,
        action: "add",
        label: "actions",
      })

      expect(obj).toEqual([
        {
          id: "a0",
          parameters: {
            text: "Alpha",
          },
        },
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.2.row }}",
          },
        },
        {
          id: "c3",
          parameters: {
            text: "Carrot {{ actions.2.row }}",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.4.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.5.row }}",
          },
        },
      ])
    })

    it("should decrement steps in sequence on 'delete'", () => {
      let obj = [
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.1.row }}",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.3.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.4.row }}",
          },
        },
      ]
      updateReferencesInObject({
        obj,
        modifiedIndex: 2,
        action: "delete",
        label: "actions",
      })

      expect(obj).toEqual([
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.1.row }}",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.2.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.3.row }}",
          },
        },
      ])
    })

    it("should handle on 'move' to a lower index", () => {
      let obj = [
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.0.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.3.row }}",
          },
        },
        {
          id: "c3",
          parameters: {
            text: "Carrot {{ actions.0.row }}",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.2.row }}",
          },
        },
      ]
      updateReferencesInObject({
        obj,
        modifiedIndex: 2,
        action: "move",
        label: "actions",
        originalIndex: 4,
      })

      expect(obj).toEqual([
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.0.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.4.row }}",
          },
        },
        {
          id: "c3",
          parameters: {
            text: "Carrot {{ actions.0.row }}",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.3.row }}",
          },
        },
      ])
    })

    it("should not decrement references that sit before the moved action", () => {
      let obj = [
        {
          id: "queryAction",
          parameters: {
            text: "{{ actions.0.result }}",
          },
        },
        {
          id: "notification",
          parameters: {
            text: "{{ actions.0.result }}",
          },
        },
        {
          id: "prompt",
          parameters: {
            text: "Prompt",
          },
        },
      ]

      updateReferencesInObject({
        obj,
        modifiedIndex: 2,
        action: "move",
        label: "actions",
        originalIndex: 1,
      })

      expect(obj[1].parameters.text).toEqual("{{ actions.0.result }}")
    })

    it("should skip move updates when the original index is invalid", () => {
      let obj = [
        {
          id: "queryAction",
          parameters: {
            text: "{{ actions.0.result }}",
          },
        },
      ]

      updateReferencesInObject({
        obj,
        modifiedIndex: 0,
        action: "move",
        label: "actions",
        originalIndex: -1,
      })

      expect(obj[0].parameters.text).toEqual("{{ actions.0.result }}")
    })

    it("updates references nested inside arrays", () => {
      let obj = {
        parameters: {
          rows: [
            {
              value: "{{ actions.1.row }}",
            },
          ],
        },
      }

      updateReferencesInObject({
        obj,
        modifiedIndex: 0,
        action: "add",
        label: "actions",
      })

      expect(obj.parameters.rows[0].value).toEqual("{{ actions.2.row }}")
    })

    it("should handle on 'move' to a higher index", () => {
      let obj = [
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.0.row }}",
          },
        },
        {
          id: "c3",
          parameters: {
            text: "Carrot {{ actions.0.row }}",
          },
        },
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.2.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.3.row }}",
          },
        },
      ]
      updateReferencesInObject({
        obj,
        modifiedIndex: 2,
        action: "move",
        label: "actions",
        originalIndex: 0,
      })

      expect(obj).toEqual([
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.2.row }}",
          },
        },
        {
          id: "c3",
          parameters: {
            text: "Carrot {{ actions.2.row }}",
          },
        },
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.1.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.3.row }}",
          },
        },
      ])
    })

    it("should handle on 'move' of action being referenced, dragged to a higher index", () => {
      let obj = [
        {
          "##eventHandlerType": "Validate Form",
          id: "cCD0Dwcnq",
        },
        {
          "##eventHandlerType": "Close Screen Modal",
          id: "3fbbIOfN0H",
        },
        {
          "##eventHandlerType": "Save Row",
          parameters: {
            tableId: "ta_bb_employee",
          },
          id: "aehg5cTmhR",
        },
        {
          "##eventHandlerType": "Close Side Panel",
          id: "mzkpf86cxo",
        },
        {
          "##eventHandlerType": "Navigate To",
          id: "h0uDFeJa8A",
        },
        {
          parameters: {
            autoDismiss: true,
            type: "success",
            message: "{{ actions.1.row }}",
          },
          "##eventHandlerType": "Show Notification",
          id: "JEI5lAyJZ",
        },
      ]
      updateReferencesInObject({
        obj,
        modifiedIndex: 2,
        action: "move",
        label: "actions",
        originalIndex: 1,
      })

      expect(obj).toEqual([
        {
          "##eventHandlerType": "Validate Form",
          id: "cCD0Dwcnq",
        },
        {
          "##eventHandlerType": "Close Screen Modal",
          id: "3fbbIOfN0H",
        },
        {
          "##eventHandlerType": "Save Row",
          parameters: {
            tableId: "ta_bb_employee",
          },
          id: "aehg5cTmhR",
        },
        {
          "##eventHandlerType": "Close Side Panel",
          id: "mzkpf86cxo",
        },
        {
          "##eventHandlerType": "Navigate To",
          id: "h0uDFeJa8A",
        },
        {
          parameters: {
            autoDismiss: true,
            type: "success",
            message: "{{ actions.2.row }}",
          },
          "##eventHandlerType": "Show Notification",
          id: "JEI5lAyJZ",
        },
      ])
    })

    it("should handle on 'move' of action being referenced, dragged to a lower index", () => {
      let obj = [
        {
          "##eventHandlerType": "Save Row",
          parameters: {
            tableId: "ta_bb_employee",
          },
          id: "aehg5cTmhR",
        },
        {
          "##eventHandlerType": "Validate Form",
          id: "cCD0Dwcnq",
        },
        {
          "##eventHandlerType": "Close Screen Modal",
          id: "3fbbIOfN0H",
        },
        {
          "##eventHandlerType": "Close Side Panel",
          id: "mzkpf86cxo",
        },
        {
          "##eventHandlerType": "Navigate To",
          id: "h0uDFeJa8A",
        },
        {
          parameters: {
            autoDismiss: true,
            type: "success",
            message: "{{ actions.4.row }}",
          },
          "##eventHandlerType": "Show Notification",
          id: "JEI5lAyJZ",
        },
      ]
      updateReferencesInObject({
        obj,
        modifiedIndex: 0,
        action: "move",
        label: "actions",
        originalIndex: 4,
      })

      expect(obj).toEqual([
        {
          "##eventHandlerType": "Save Row",
          parameters: {
            tableId: "ta_bb_employee",
          },
          id: "aehg5cTmhR",
        },
        {
          "##eventHandlerType": "Validate Form",
          id: "cCD0Dwcnq",
        },
        {
          "##eventHandlerType": "Close Screen Modal",
          id: "3fbbIOfN0H",
        },
        {
          "##eventHandlerType": "Close Side Panel",
          id: "mzkpf86cxo",
        },
        {
          "##eventHandlerType": "Navigate To",
          id: "h0uDFeJa8A",
        },
        {
          parameters: {
            autoDismiss: true,
            type: "success",
            message: "{{ actions.0.row }}",
          },
          "##eventHandlerType": "Show Notification",
          id: "JEI5lAyJZ",
        },
      ])
    })
  })

  describe("migrateReferencesInObject", () => {
    it("migrates references nested inside arrays", () => {
      let obj = {
        parameters: {
          rows: [
            {
              value: "{{ actions.1.row }}",
            },
          ],
        },
      }

      migrateReferencesInObject({
        obj,
        label: "actions",
        steps: [{ id: "first" }, { id: "second" }],
      })

      expect(obj.parameters.rows[0].value).toEqual("{{ actions.second.row }}")
    })
  })

  describe("removeBindings", () => {
    it("removes bindings nested inside arrays", () => {
      let obj = {
        parameters: {
          rows: [
            {
              value: "Result: {{ actions.1.row }}",
            },
          ],
        },
      }

      removeBindings(obj)

      expect(obj.parameters.rows[0].value).toEqual("Result: Invalid binding")
    })
  })
})
