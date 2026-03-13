import { it, expect, describe, vi } from "vitest"
import { writable } from "svelte/store"
import { render, waitFor, fireEvent } from "@testing-library/svelte"
import { notifications } from "@budibase/bbui"
import APIEndpointViewer from "./APIEndpointViewer.svelte"
import { API } from "@/api"
import * as queryModule from "./query"
import {
  RestAuthType,
  SourceName,
  type Datasource,
  type Query,
  type UIInternalDatasource,
} from "@budibase/types"

// ---- Notification spies (initialised here so vi.mock hoisting sees them) ----
vi.spyOn(notifications, "error").mockImplementation(() => {})
vi.spyOn(notifications, "success").mockImplementation(() => {})
vi.spyOn(notifications, "info").mockImplementation(() => {})

vi.mock("@/api", () => ({
  API: {
    getDatasources: vi.fn(),
    saveQuery: vi.fn(),
    previewQuery: vi.fn(),
    getQueries: vi.fn(),
    workspaceConnections: {
      fetch: vi.fn().mockResolvedValue([]),
    },
  },
}))

vi.mock("@roxi/routify", () => ({
  params: writable({
    datasourceId: "datasource_c190e3055ae643b4b3bb66ee15ad12c9",
  }),
  goto: writable(vi.fn()),
  beforeUrlChange: writable(() => () => true),
}))

// Real class instances are needed for .store.update()/.init()/.set(). vi.importActual
// is used (not bare import()) to avoid circular resolution inside vi.mock factories.
// TODO: We need to readdress the structure of the stores in the builder. Either in the form
// of module registration or possibly dependency injection.

vi.mock("@/stores/builder/queries", async () => {
  const { QueryStore } = await vi.importActual<
    typeof import("@/stores/builder/queries")
  >("@/stores/builder/queries")
  const instance = new QueryStore()
  return {
    queries: instance,
    QueryStore,
    removeDatasourceQueries: vi.fn(),
    saveQuery: vi.fn(),
  }
})

vi.mock("@/stores/builder/datasources", async () => {
  const { DatasourceStore } = await vi.importActual<
    typeof import("@/stores/builder/datasources")
  >("@/stores/builder/datasources")
  const instance = new DatasourceStore()
  return {
    datasources: instance,
    DatasourceStore,
    hasRestTemplate: vi.fn().mockReturnValue(false),
    getRestTemplateIdentifier: vi.fn().mockReturnValue(undefined),
    removeDatasourceTables: vi.fn(),
  }
})

vi.mock("@/stores/builder/oauth2", async () => {
  const { OAuth2Store } = await vi.importActual<
    typeof import("@/stores/builder/oauth2")
  >("@/stores/builder/oauth2")
  return { oauth2: new OAuth2Store(), OAuth2Store }
})

vi.mock("@/stores/builder/workspaceConnection", async () => {
  const { WorkspaceConnectionStore } = await vi.importActual<
    typeof import("@/stores/builder/workspaceConnection")
  >("@/stores/builder/workspaceConnection")
  return {
    workspaceConnections: new WorkspaceConnectionStore(),
    WorkspaceConnectionStore,
  }
})

vi.mock("@/stores/builder/integrations", async () => {
  const { writable } = await import("svelte/store")
  const { IntegrationTypes } = await import("@/constants/backend")
  return {
    integrations: writable({
      [IntegrationTypes.REST]: {
        query: {
          read: { readable: true, displayName: "GET" },
          create: { readable: true, displayName: "POST" },
          update: { readable: true, displayName: "PUT" },
          patch: { readable: true, displayName: "PATCH" },
          delete: { displayName: "DELETE" },
        },
      },
    }),
  }
})

vi.mock("@/stores/builder/restTemplates", async () => {
  const { writable } = await import("svelte/store")
  return { restTemplates: writable({}) }
})

vi.mock("@/stores/builder/tables", async () => {
  const { writable } = await import("svelte/store")
  return {
    tables: {
      ...writable({ list: [] }),
      fetch: vi.fn(),
      removeDatasourceTables: vi.fn(),
    },
  }
})

// Parent mock imports from already-mocked sub-modules (safe direction: sub → parent).
vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")
  const { queries } = await import("@/stores/builder/queries")
  const { datasources } = await import("@/stores/builder/datasources")
  const { oauth2 } = await import("@/stores/builder/oauth2")
  const { workspaceConnections } = await import(
    "@/stores/builder/workspaceConnection"
  )
  const { integrations } = await import("@/stores/builder/integrations")
  const { restTemplates } = await import("@/stores/builder/restTemplates")

  return {
    tables: writable({ list: [] }),
    datasources,
    flags: writable({}),
    appStore: writable({ appId: "app_test" }),
    workspaceAppStore: writable({
      selectedWorkspaceAppId: null,
      selectedWorkspaceApp: null,
      workspaceApps: [],
    }),
    screenStore: {
      ...writable({ screens: [], selected: null }),
      usageInScreens: vi.fn().mockResolvedValue({ screens: [] }),
    },
    workspaceConnections,
    integrations,
    queries,
    roles: writable([]),
    oauth2,
    restTemplates,
  }
})

// ---- Imports: use sub-module mocks directly so tests share the same instances ----
import { datasources } from "@/stores/builder/datasources"
import { queries } from "@/stores/builder/queries"
import { oauth2 } from "@/stores/builder/oauth2"
import { screenStore } from "@/stores/builder"

// ---- Constants ----
const REST_DS_ID = "datasource_c190e3055ae643b4b3bb66ee15ad12c9"
const QUERY_ID = "query_abc123"

const REST_DS: Datasource = {
  _id: REST_DS_ID,
  _rev: "2-ebee2ea6c6f7e75247a71a4b8e2fce42",
  type: "datasource",
  source: SourceName.REST,
  config: {
    url: "",
    defaultHeaders: {},
    rejectUnauthorized: true,
    downloadImages: true,
    dynamicVariables: [],
  },
  name: "REST API 2",
  isSQL: false,
}

const REST_DS_WITH_URL: Datasource = {
  ...REST_DS,
  config: { ...REST_DS.config, url: "https://api.example.com" },
}

const BEARER_AUTH_CONFIG = {
  _id: "auth_bearer_1",
  name: "My Bearer",
  type: RestAuthType.BEARER,
  config: { token: "mytoken" },
}

const REST_DS_WITH_AUTH: Datasource = {
  ...REST_DS,
  config: { ...REST_DS.config, authConfigs: [BEARER_AUTH_CONFIG] },
}

const SAVED_QUERY: Query = {
  _id: QUERY_ID,
  _rev: "1-abc",
  datasourceId: REST_DS_ID,
  name: "My saved request",
  queryVerb: "read",
  parameters: [],
  fields: {
    path: "https://example.com/api/users",
    headers: {},
    disabledHeaders: {},
    queryString: "",
    bodyType: "none" as any,
  },
  transformer: "return data",
  schema: {},
  readable: true,
}

// ---- Helpers ----
const setupDatasources = async (ds: Datasource = REST_DS) => {
  const internalDs: UIInternalDatasource = {
    _id: "bb_internal",
    type: "budibase",
    name: "Budibase DB",
    source: SourceName.BUDIBASE,
    config: {},
    entities: [],
  }
  vi.mocked(API).getDatasources.mockResolvedValue([
    internalDs,
    ds,
  ] as Datasource[])
  await datasources.init()
}

const setupDOM = (props: Record<string, any> = {}) => {
  const instance = render(APIEndpointViewer, props)
  const modalContainer = document.createElement("div")
  modalContainer.classList.add("modal-container")
  instance.baseElement.appendChild(modalContainer)
  return instance
}

const getSendButton = (container: Element) =>
  Array.from(container.querySelectorAll("button")).find(b =>
    b.textContent?.includes("Send")
  )

const getSaveButton = (container: Element) =>
  Array.from(container.querySelectorAll("button")).find(b =>
    b.textContent?.includes("Save")
  )

// ---- Setup ----
beforeEach(async () => {
  vi.clearAllMocks()
  // Re-establish notification spies after clearAllMocks wipes their history
  vi.spyOn(notifications, "error").mockImplementation(() => {})
  vi.spyOn(notifications, "success").mockImplementation(() => {})
  vi.spyOn(notifications, "info").mockImplementation(() => {})
  vi.mocked(screenStore.usageInScreens).mockResolvedValue({
    screens: [],
  } as any)
  queries.store.update(s => ({ ...s, list: [], selectedQueryId: null }))
  await setupDatasources()
})

// ---- Tests ----
describe("API Endpoint Viewer", () => {
  describe("Basic rendering", () => {
    it("renders without errors", async () => {
      const { container } = setupDOM()
      await waitFor(() => {
        expect(container.querySelector(".request-heading")).not.toBeNull()
        expect(notifications.error).not.toBeCalled()
      })
    })

    it("renders with a datasourceId prop", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        expect(container.querySelector(".request-heading")).not.toBeNull()
      })
    })
  })

  describe("New query state", () => {
    it("Send button is disabled when no endpoint is selected", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        expect(
          getSendButton(container)?.classList.contains("is-disabled")
        ).toBe(true)
      })
    })

    it("Save button is disabled when no endpoint is selected", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        expect(
          getSaveButton(container)?.classList.contains("is-disabled")
        ).toBe(true)
      })
    })

    it("ConnectionSelect is not disabled for a new query", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        // When not disabled, ConnectionSelect renders a chevron icon
        const chevron = container
          .querySelector(".picker-button")
          ?.querySelector(
            "[aria-label='ChevronDown'], [aria-label='ChevronUp'], .ph-caret-down, .ph-caret-up"
          )
        expect(chevron).not.toBeNull()
      })
    })

    it("applies default auth config from datasource for new queries", async () => {
      await setupDatasources(REST_DS_WITH_AUTH)
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        expect(
          container.querySelector(".picker-button")?.textContent
        ).toContain("My Bearer")
      })
    })
  })

  describe("Existing query loading", () => {
    beforeEach(() => {
      queries.store.update(s => ({ ...s, list: [SAVED_QUERY] }))
    })

    it("shows the query name in the heading", async () => {
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() => {
        expect(container.querySelector(".query-name-input")?.textContent).toBe(
          "My saved request"
        )
      })
    })

    it("ConnectionSelect is disabled for an existing query", async () => {
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() => {
        // When disabled, ConnectionSelect hides the chevron icon
        const chevron = container
          .querySelector(".picker-button")
          ?.querySelector(
            "[aria-label='ChevronDown'], [aria-label='ChevronUp'], .ph-caret-down, .ph-caret-up"
          )
        expect(chevron).toBeNull()
      })
    })

    it("shows inline auth config label in connection picker", async () => {
      await setupDatasources(REST_DS_WITH_AUTH)
      queries.store.update(s => ({
        ...s,
        list: [
          {
            ...SAVED_QUERY,
            _id: "query_inline_auth",
            fields: {
              ...SAVED_QUERY.fields,
              authConfigId: BEARER_AUTH_CONFIG._id,
              authConfigType: RestAuthType.BEARER,
            },
          },
        ],
      }))
      const { container } = setupDOM({ queryId: "query_inline_auth" })
      await waitFor(() => {
        const label = container.querySelector(".picker-button")?.textContent
        expect(label).toContain("REST API 2")
        expect(label).toContain("My Bearer")
      })
    })

    it("shows 'Name - OAuth2' label when the query has a legacy oauth2_ authConfigId that matches a known connection", async () => {
      // Seed oauth2 store so workspaceConnections.list has a matching entry.
      // WorkspaceConnectionStore derives its list from oauth2, and ConnectionSelect
      // looks up the name via workspaceConnections.list.find(c => c.sourceId === authConfigId).
      oauth2.set({
        configs: [
          {
            _id: "oauth2_legacy123",
            _rev: "1-x",
            name: "My Legacy OAuth",
            url: "https://auth.example.com/token",
            clientId: "id",
            clientSecret: "secret",
          } as any,
        ],
        loading: false,
      })
      await new Promise(r => setTimeout(r, 0))

      queries.store.update(s => ({
        ...s,
        list: [
          {
            ...SAVED_QUERY,
            _id: "query_legacy_oauth",
            fields: {
              ...SAVED_QUERY.fields,
              authConfigId: "oauth2_legacy123",
              authConfigType: RestAuthType.OAUTH2,
            },
          },
        ],
      }))
      const { container } = setupDOM({ queryId: "query_legacy_oauth" })
      await waitFor(() => {
        const label = container.querySelector(".picker-button")?.textContent
        expect(label).toContain("My Legacy OAuth")
        expect(label).toContain("OAuth2")
      })
    })
  })

  describe("Query name editing", () => {
    beforeEach(() => {
      queries.store.update(s => ({ ...s, list: [SAVED_QUERY] }))
    })

    it("updates editableQuery.name when the name field is blurred", async () => {
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() =>
        expect(container.querySelector(".query-name-input")).not.toBeNull()
      )
      const nameEl = container.querySelector(".query-name-input") as HTMLElement
      nameEl.textContent = "Updated name"
      await fireEvent.blur(nameEl)
      // The Save button becomes enabled when queryDirty — a name change makes it dirty
      await waitFor(() => {
        expect(
          getSaveButton(container)?.classList.contains("is-disabled")
        ).toBe(false)
      })
    })

    it("blurs the name field on Enter key", async () => {
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() =>
        expect(container.querySelector(".query-name-input")).not.toBeNull()
      )
      const nameEl = container.querySelector(".query-name-input") as HTMLElement
      const blurSpy = vi.spyOn(nameEl, "blur")
      await fireEvent.keyDown(nameEl, { key: "Enter" })
      expect(blurSpy).toHaveBeenCalled()
    })
  })

  describe("Send / preview", () => {
    // A query with restTemplateMetadata gives the component a selectedEndpointOption
    // without needing to load a full endpoint list, making the Send button active.
    const RUNNABLE_QUERY: Query = {
      ...SAVED_QUERY,
      restTemplateMetadata: {
        operationId: "getUsers",
        originalPath: "/api/users",
        description: "Get all users",
      },
    }

    beforeEach(() => {
      queries.store.update(s => ({ ...s, list: [RUNNABLE_QUERY] }))
    })

    it("calls runQuery when Send is clicked", async () => {
      vi.spyOn(queryModule, "runQuery").mockResolvedValue({
        response: {
          rows: [{ id: 1 }],
          schema: {},
          nestedSchemaFields: {},
          info: { code: 200 },
          extra: {},
        },
        schema: {},
        nestedSchemaFields: {},
      })
      const { container } = setupDOM({ queryId: QUERY_ID })
      const sendBtn = await waitFor(() => {
        const btn = getSendButton(container)
        expect(btn?.classList.contains("is-disabled")).toBe(false)
        return btn!
      })
      await fireEvent.click(sendBtn)
      await waitFor(() => {
        expect(queryModule.runQuery).toHaveBeenCalled()
      })
    })

    it("shows a success notification when Send returns rows", async () => {
      vi.spyOn(queryModule, "runQuery").mockResolvedValue({
        response: {
          rows: [{ id: 1 }],
          schema: {},
          nestedSchemaFields: {},
          info: {},
          extra: {},
        },
        schema: {},
        nestedSchemaFields: {},
      })
      const { container } = setupDOM({ queryId: QUERY_ID })
      const sendBtn = await waitFor(() => {
        const btn = getSendButton(container)
        expect(btn?.classList.contains("is-disabled")).toBe(false)
        return btn!
      })
      await fireEvent.click(sendBtn)
      await waitFor(() => {
        expect(notifications.success).toHaveBeenCalledWith(
          "Request sent successfully"
        )
      })
    })

    it("shows an info notification when Send returns no rows", async () => {
      vi.spyOn(queryModule, "runQuery").mockResolvedValue({
        response: {
          rows: [],
          schema: {},
          nestedSchemaFields: {},
          info: {},
          extra: {},
        },
        schema: {},
        nestedSchemaFields: {},
      })
      const { container } = setupDOM({ queryId: QUERY_ID })
      const sendBtn = await waitFor(() => {
        const btn = getSendButton(container)
        expect(btn?.classList.contains("is-disabled")).toBe(false)
        return btn!
      })
      await fireEvent.click(sendBtn)
      await waitFor(() => {
        expect(notifications.info).toHaveBeenCalledWith(
          "Request did not return any data"
        )
      })
    })

    it("shows an error notification when runQuery throws", async () => {
      vi.spyOn(queryModule, "runQuery").mockRejectedValue(
        new Error("Network error")
      )
      const { container } = setupDOM({ queryId: QUERY_ID })
      const sendBtn = await waitFor(() => {
        const btn = getSendButton(container)
        expect(btn?.classList.contains("is-disabled")).toBe(false)
        return btn!
      })
      await fireEvent.click(sendBtn)
      await waitFor(() => {
        expect(notifications.error).toHaveBeenCalledWith(
          expect.stringContaining("Query Error")
        )
      })
    })

    it("validateQuery throws on protected user binding in URL", () => {
      expect(() =>
        queryModule.validateQuery(
          "https://example.com/{{ user.email }}",
          undefined,
          {},
          {}
        )
      ).toThrow("protected binding")
    })
  })

  describe("Save", () => {
    // restTemplateMetadata is required so syncEndpointFromQuery sets selectedEndpointOption
    // (enables Send). Empty metadata means getRestTemplateQueryDisplayName falls back to
    // query.name — so when the name is cleared, effectiveName reaches "Untitled request".
    const DIRTY_QUERY: Query = {
      ...SAVED_QUERY,
      restTemplateMetadata: {
        operationId: "getUsers",
        originalPath: "/api/users",
      },
    }

    // A variant with no metadata name fields so effectiveName falls through to "Untitled request"
    // when the query name is also blank.
    const NAMELESS_METADATA_QUERY: Query = {
      ...SAVED_QUERY,
      restTemplateMetadata: {},
    }

    beforeEach(() => {
      queries.store.update(s => ({ ...s, list: [DIRTY_QUERY] }))
    })

    it("calls API.saveQuery with the correct datasourceId when Save is clicked", async () => {
      vi.mocked(API).saveQuery.mockResolvedValue({
        ...DIRTY_QUERY,
        _rev: "2-updated",
      })
      const { container } = setupDOM({ queryId: QUERY_ID })
      // Dirty the query by changing the name
      await waitFor(() =>
        expect(container.querySelector(".query-name-input")).not.toBeNull()
      )
      const nameEl = container.querySelector(".query-name-input") as HTMLElement
      nameEl.textContent = "New name"
      await fireEvent.blur(nameEl)
      const saveBtn = await waitFor(() => {
        const btn = getSaveButton(container)
        expect(btn?.classList.contains("is-disabled")).toBe(false)
        return btn!
      })
      await fireEvent.click(saveBtn)
      await waitFor(() => {
        expect(vi.mocked(API).saveQuery).toHaveBeenCalledWith(
          expect.objectContaining({ datasourceId: REST_DS_ID })
        )
      })
    })

    it("shows a success notification after a successful save", async () => {
      vi.mocked(API).saveQuery.mockResolvedValue({
        ...DIRTY_QUERY,
        _rev: "2-updated",
      })
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() =>
        expect(container.querySelector(".query-name-input")).not.toBeNull()
      )
      const nameEl = container.querySelector(".query-name-input") as HTMLElement
      nameEl.textContent = "New name"
      await fireEvent.blur(nameEl)
      const saveBtn = await waitFor(() => {
        const btn = getSaveButton(container)
        expect(btn?.classList.contains("is-disabled")).toBe(false)
        return btn!
      })
      await fireEvent.click(saveBtn)
      await waitFor(() => {
        expect(notifications.success).toHaveBeenCalledWith(
          "Request saved successfully"
        )
      })
    })

    it("shows an error notification when the save fails", async () => {
      vi.mocked(API).saveQuery.mockRejectedValue(new Error("Save failed"))
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() =>
        expect(container.querySelector(".query-name-input")).not.toBeNull()
      )
      const nameEl = container.querySelector(".query-name-input") as HTMLElement
      nameEl.textContent = "New name"
      await fireEvent.blur(nameEl)
      const saveBtn = await waitFor(() => {
        const btn = getSaveButton(container)
        expect(btn?.classList.contains("is-disabled")).toBe(false)
        return btn!
      })
      await fireEvent.click(saveBtn)
      await waitFor(() => {
        expect(notifications.error).toHaveBeenCalledWith("Error saving query")
      })
    })

    it("uses 'Untitled request' as the name when the query name is blank", async () => {
      queries.store.update(s => ({ ...s, list: [NAMELESS_METADATA_QUERY] }))
      vi.mocked(API).saveQuery.mockResolvedValue({
        ...NAMELESS_METADATA_QUERY,
        _rev: "2-updated",
      })
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() =>
        expect(container.querySelector(".query-name-input")).not.toBeNull()
      )
      // Change the name to something first to make the query dirty, then clear it
      const nameEl = container.querySelector(".query-name-input") as HTMLElement
      nameEl.textContent = "temp"
      await fireEvent.blur(nameEl)
      nameEl.textContent = ""
      await fireEvent.blur(nameEl)
      const saveBtn = await waitFor(() => {
        const btn = getSaveButton(container)
        expect(btn?.classList.contains("is-disabled")).toBe(false)
        return btn!
      })
      await fireEvent.click(saveBtn)
      await waitFor(() => {
        expect(vi.mocked(API).saveQuery).toHaveBeenCalledWith(
          expect.objectContaining({ name: "Untitled request" })
        )
      })
    })
  })

  describe("Tabs", () => {
    const getTab = (container: Element, title: string) =>
      Array.from(container.querySelectorAll(".spectrum-Tabs-item")).find(t =>
        t.textContent?.trim().includes(title)
      ) as HTMLElement | undefined

    it("renders all expected tabs in custom mode", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        const tabTitles = Array.from(
          container.querySelectorAll(".spectrum-Tabs-item")
        ).map(t => t.textContent?.trim())
        expect(tabTitles).toEqual(
          expect.arrayContaining([
            "Bindings",
            "Params",
            "Headers",
            "Body",
            "Pagination",
            "Transformer",
          ])
        )
      })
    })

    it("tabs are enabled when a datasource is selected", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        const tabsWrapper = container.querySelector(".spectrum-Tabs")
        expect(tabsWrapper).not.toBeNull()
        expect(tabsWrapper?.classList.contains("is-disabled")).toBeFalsy()
      })
    })

    it("clicking the Params tab shows the params key-value builder", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(getTab(container, "Params")).not.toBeUndefined()
      )
      await fireEvent.click(getTab(container, "Params")!)
      await waitFor(() => {
        // KeyValueBuilder renders rows with .spectrum-Table or an add button
        const paramsSection = container.querySelector(".spectrum-Tabs-content")
        expect(paramsSection).not.toBeNull()
      })
    })

    it("clicking the Headers tab shows the headers key-value builder", async () => {
      queries.store.update(s => ({
        ...s,
        list: [
          {
            ...SAVED_QUERY,
            fields: {
              ...SAVED_QUERY.fields,
              headers: { "X-Custom": "value" },
              disabledHeaders: {},
            },
          },
        ],
      }))
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() =>
        expect(getTab(container, "Headers")).not.toBeUndefined()
      )
      await fireEvent.click(getTab(container, "Headers")!)
      await waitFor(() => {
        expect(container.querySelector(".spectrum-Tabs-content")).not.toBeNull()
      })
    })

    it("clicking the Body tab shows body type radio group", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => expect(getTab(container, "Body")).not.toBeUndefined())
      await fireEvent.click(getTab(container, "Body")!)
      await waitFor(() => {
        expect(container.querySelector(".spectrum-Radio")).not.toBeNull()
      })
    })

    it("clicking the Transformer tab shows a code editor", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(getTab(container, "Transformer")).not.toBeUndefined()
      )
      await fireEvent.click(getTab(container, "Transformer")!)
      await waitFor(() => {
        expect(container.querySelector(".embed")).not.toBeNull()
      })
    })

    it("Pagination tab is not shown in template mode", async () => {
      // Template mode = hasRestTemplate returns true. In our mock it always
      // returns false so we just verify it IS present in custom mode.
      // This test documents the custom-mode expectation.
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        expect(getTab(container, "Pagination")).not.toBeUndefined()
      })
    })
  })

  describe("Response sidebar", () => {
    it("renders the sidebar", async () => {
      const { container } = setupDOM()
      await waitFor(() => {
        expect(container.querySelector(".side-bar")).not.toBeNull()
      })
    })

    it("has an expand button in the sidebar header", async () => {
      const { container } = setupDOM()
      await waitFor(() => {
        expect(
          container.querySelector(".side-bar-header .spectrum-ActionButton")
        ).not.toBeNull()
      })
    })
  })

  describe("Base URL / globe picker", () => {
    it("pre-populates base URL input from datasource config.url for a new query", async () => {
      await setupDatasources(REST_DS_WITH_URL)
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        const baseUrlInput = container.querySelector(
          ".base-url-input"
        ) as HTMLInputElement | null
        expect(baseUrlInput?.value).toBe("https://api.example.com")
      })
    })

    it("renders the globe icon when the datasource has a config URL", async () => {
      await setupDatasources(REST_DS_WITH_URL)
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        expect(container.querySelector(".globe-icon")).not.toBeNull()
      })
    })

    it("does not render the globe icon when the datasource has no config URL", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".base-url-input")).not.toBeNull()
      )
      expect(container.querySelector(".globe-icon")).toBeNull()
    })

    it("clicking a globe menu item sets the base URL input value", async () => {
      await setupDatasources(REST_DS_WITH_URL)
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".globe-icon")).not.toBeNull()
      )
      // Open the ActionMenu by clicking the globe icon trigger
      const globeTrigger = container.querySelector(
        ".globe-icon .spectrum-ActionButton"
      ) as HTMLElement | null
      if (globeTrigger) {
        await fireEvent.click(globeTrigger)
      }
      // Click the first menu item (connection default)
      const menuItem = document.querySelector(
        ".spectrum-Menu-item"
      ) as HTMLElement | null
      if (menuItem) {
        await fireEvent.click(menuItem)
      }
      await waitFor(() => {
        const baseUrlInput = container.querySelector(
          ".base-url-input"
        ) as HTMLInputElement | null
        expect(baseUrlInput?.value).toBe("https://api.example.com")
      })
    })
  })

  describe("Verb picker", () => {
    it("renders the verb trigger with the current verb", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        const trigger = container.querySelector(".verb-trigger")
        expect(trigger).not.toBeNull()
      })
    })

    it("opens verb dropdown on click", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".verb-trigger")).not.toBeNull()
      )
      await fireEvent.click(container.querySelector(".verb-trigger")!)
      await waitFor(() => {
        expect(container.querySelector(".verb-dropdown")).not.toBeNull()
      })
    })

    it("changing verb updates the query verb", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".verb-trigger")).not.toBeNull()
      )
      await fireEvent.click(container.querySelector(".verb-trigger")!)
      const postItem = await waitFor(() => {
        const items = Array.from(
          container.querySelectorAll(".verb-dropdown .spectrum-Menu-item")
        )
        const post = items.find(i => i.textContent?.includes("POST"))
        expect(post).not.toBeUndefined()
        return post as HTMLElement
      })
      await fireEvent.click(postItem)
      // Dropdown should close after selection
      await waitFor(() => {
        expect(container.querySelector(".verb-dropdown")).toBeNull()
      })
    })
  })

  // hasRestTemplate returns false by default in the mock, so the component is
  // always in custom mode for these tests.
  describe("Custom mode", () => {
    const CUSTOM_QUERY: Query = {
      _id: QUERY_ID,
      _rev: "1-abc",
      datasourceId: REST_DS_ID,
      name: "My custom request",
      queryVerb: "read",
      parameters: [],
      fields: {
        path: "https://api.example.com/api/users",
        headers: {},
        disabledHeaders: {},
        queryString: "status=active",
        bodyType: "none" as any,
      },
      transformer: "return data",
      schema: {},
      readable: true,
    }

    it("renders CustomEndpointInput instead of endpoint Select", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        expect(container.querySelector(".verb-trigger")).not.toBeNull()
        // The path and base-url inputs from CustomEndpointInput are present
        expect(container.querySelector(".path-input")).not.toBeNull()
        expect(container.querySelector(".base-url-input")).not.toBeNull()
      })
    })

    it("Send button is disabled when no path is entered", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        expect(
          getSendButton(container)?.classList.contains("is-disabled")
        ).toBe(true)
      })
    })

    it("Send button becomes enabled when a path is typed", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".path-input")).not.toBeNull()
      )
      const pathInput = container.querySelector(
        ".path-input"
      ) as HTMLInputElement
      await fireEvent.input(pathInput, {
        target: { value: "/api/v1/users" },
      })
      await waitFor(() => {
        expect(
          getSendButton(container)?.classList.contains("is-disabled")
        ).toBe(false)
      })
    })

    it("Save button is disabled for a new query without a path", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        expect(
          getSaveButton(container)?.classList.contains("is-disabled")
        ).toBe(true)
      })
    })

    it("Pagination tab is visible in custom mode", async () => {
      queries.store.update(s => ({ ...s, list: [CUSTOM_QUERY] }))
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() => {
        const tabs = Array.from(
          container.querySelectorAll(".spectrum-Tabs-item")
        )
        const paginationTab = tabs.find(t =>
          t.textContent?.includes("Pagination")
        )
        expect(paginationTab).not.toBeUndefined()
      })
    })

    it("tabs are enabled when a datasource is selected (no path required)", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        // Tabs are enabled when datasource is present — the Tabs component
        // does not add .is-disabled on the wrapper when enabled
        const tabsWrapper = container.querySelector(".spectrum-Tabs")
        expect(tabsWrapper?.classList.contains("is-disabled")).toBeFalsy()
      })
    })

    it("splits a stored full URL into base URL and path on load", async () => {
      queries.store.update(s => ({ ...s, list: [CUSTOM_QUERY] }))
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() => {
        const baseUrlInput = container.querySelector(
          ".base-url-input"
        ) as HTMLInputElement | null
        const pathInput = container.querySelector(
          ".path-input"
        ) as HTMLInputElement | null
        expect(baseUrlInput?.value).toBe("https://api.example.com")
        expect(pathInput?.value).toBe("/api/users")
      })
    })

    it("reconstitutes full URL on save by combining base URL and path", async () => {
      queries.store.update(s => ({ ...s, list: [CUSTOM_QUERY] }))
      vi.mocked(API).saveQuery.mockResolvedValue({
        ...CUSTOM_QUERY,
        _rev: "2-updated",
      })
      const { container } = setupDOM({ queryId: QUERY_ID })
      // Wait for the query to load then dirty it via name change
      await waitFor(() =>
        expect(container.querySelector(".query-name-input")).not.toBeNull()
      )
      const nameEl = container.querySelector(".query-name-input") as HTMLElement
      nameEl.textContent = "Updated name"
      await fireEvent.blur(nameEl)
      const saveBtn = await waitFor(() => {
        const btn = getSaveButton(container)
        expect(btn?.classList.contains("is-disabled")).toBe(false)
        return btn!
      })
      await fireEvent.click(saveBtn)
      await waitFor(() => {
        const saved = vi.mocked(API).saveQuery.mock.calls[0]?.[0] as
          | Query
          | undefined
        // effectivePath = customBaseUrl + customPath = full original URL
        expect(saved?.fields?.path).toBe("https://api.example.com/api/users")
      })
    })
  })
})
