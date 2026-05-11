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

// ! These could be moved to vitest.setup.js to apply globally across all specs.
if (!Element.prototype.animate) {
  Element.prototype.animate = () =>
    ({ onfinish: null, cancel: () => {}, finished: Promise.resolve() }) as any
}

// bbui Popover mounts its content into .spectrum via svelte-portal.
// Ensure the element exists before each test so portal renders don't throw.
beforeEach(() => {
  if (!document.querySelector(".spectrum")) {
    const el = document.createElement("div")
    el.classList.add("spectrum")
    document.body.appendChild(el)
  }
})

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

vi.mock("@/helpers", async () => {
  const actual = await vi.importActual<typeof import("@/helpers")>("@/helpers")
  return { ...actual, confirm: vi.fn().mockResolvedValue(true) }
})

let navGuard: (() => Promise<boolean>) | null = null
let gotoFn = vi.fn()

vi.mock("@roxi/routify", () => ({
  params: writable({
    datasourceId: "datasource_c190e3055ae643b4b3bb66ee15ad12c9",
  }),
  goto: writable((...args: any[]) => gotoFn(...args)),
  beforeUrlChange: writable((handler: () => Promise<boolean>) => {
    navGuard = handler
    return () => true
  }),
}))

// Simulates routify navigation: runs the registered beforeUrlChange guard then calls goto.
const navigateTo = async (path: string) => {
  if (navGuard) {
    const allowed = await navGuard()
    if (!allowed) return false
  }
  gotoFn(path)
  return true
}

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
    consumeSkipUnsavedPrompt: vi.fn().mockReturnValue(false),
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
  return {
    restTemplates: {
      ...writable({}),
      get: vi.fn().mockReturnValue(undefined),
      flatTemplates: [],
    },
    featuredTemplates: [],
  }
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
    automationStore: writable({ automations: [] }),
    workspaceConnections,
    integrations,
    queries,
    roles: writable([]),
    oauth2,
    restTemplates,
  }
})

import {
  datasources,
  hasRestTemplate,
  getRestTemplateIdentifier,
} from "@/stores/builder/datasources"
import { restTemplates } from "@/stores/builder/restTemplates"
import { queries } from "@/stores/builder/queries"
import { oauth2 } from "@/stores/builder/oauth2"
import { screenStore } from "@/stores/builder"
import { workspaceConnections } from "@/stores/builder/workspaceConnection"
import { confirm } from "@/helpers"

const REST_DS_ID = "datasource_c190e3055ae643b4b3bb66ee15ad12c9"
const REST_DS_ID_2 = "datasource_aaaabbbbccccdddd1111222233334444"
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

const REST_DS_2_WITH_URL: Datasource = {
  _id: REST_DS_ID_2,
  _rev: "1-abcdef0123456789abcdef0123456789",
  type: "datasource",
  source: SourceName.REST,
  config: {
    url: "https://other.example.com",
    defaultHeaders: {},
    rejectUnauthorized: true,
    downloadImages: true,
    dynamicVariables: [],
  },
  name: "Other REST API",
  isSQL: false,
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
const setupTwoDatasources = async (
  ds1: Datasource = REST_DS,
  ds2: Datasource = REST_DS_2_WITH_URL
) => {
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
    ds1,
    ds2,
  ] as Datasource[])
  await datasources.init()
}

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
  // bbui Popover mounts into .spectrum via svelte-portal
  if (!document.querySelector(".spectrum")) {
    const spectrumContainer = document.createElement("div")
    spectrumContainer.classList.add("spectrum")
    instance.baseElement.appendChild(spectrumContainer)
  }
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

describe("API Endpoint Viewer", () => {
  it("renders without errors", async () => {
    const { container } = setupDOM()
    await waitFor(() => {
      expect(container.querySelector(".request-heading")).not.toBeNull()
      expect(notifications.error).not.toBeCalled()
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

    it("saves with authConfigId set when connection is changed on a new query", async () => {
      await setupDatasources(REST_DS_WITH_AUTH)
      vi.mocked(API).saveQuery.mockResolvedValue({
        _id: "new_query_id",
        _rev: "1-new",
        datasourceId: REST_DS_ID,
        name: "Untitled request",
        queryVerb: "read",
        parameters: [],
        fields: { path: "https://example.com/api" },
        transformer: "return data",
        schema: {},
        readable: true,
      })
      const { container } = setupDOM({ datasourceId: REST_DS_ID })

      await waitFor(() =>
        expect(container.querySelector(".url-input")).not.toBeNull()
      )

      // Simulate the ConnectionSelect dispatching a change event with auth
      const pickerRoot = container.querySelector(".picker-button")
        ?.parentElement as HTMLElement
      await fireEvent(
        pickerRoot,
        new CustomEvent("change", {
          detail: {
            authConfigId: BEARER_AUTH_CONFIG._id,
            authConfigType: RestAuthType.BEARER,
            datasourceId: REST_DS_ID,
          },
          bubbles: true,
        })
      )

      // Enter a URL to make the query saveable
      const urlInput = container.querySelector(".url-input") as HTMLInputElement
      await fireEvent.input(urlInput, {
        target: { value: "https://example.com/api" },
      })

      const saveBtn = await waitFor(() => {
        const btn = getSaveButton(container)
        expect(btn?.classList.contains("is-disabled")).toBe(false)
        return btn!
      })
      await fireEvent.click(saveBtn)

      await waitFor(() => {
        const saved = vi.mocked(API).saveQuery.mock.calls[0]?.[0] as Query
        expect(saved.fields.authConfigId).toBe(BEARER_AUTH_CONFIG._id)
        expect(saved.fields.authConfigType).toBe(RestAuthType.BEARER)
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
        expect(
          (container.querySelector(".query-name-input") as HTMLInputElement)
            ?.value
        ).toBe("My saved request")
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

    it("loads the stored path into the URL input (queryString is separate from path)", async () => {
      // When an existing query has a queryString field, the URL input only shows
      // the path — the queryString is stored separately and populates the Params tab.
      const QUERY_WITH_QS: Query = {
        _id: QUERY_ID,
        _rev: "1-abc",
        datasourceId: REST_DS_ID,
        name: "Request with params",
        queryVerb: "read",
        parameters: [],
        fields: {
          path: "https://api.example.com/search",
          headers: {},
          disabledHeaders: {},
          queryString: "q=hello&lang=en",
          bodyType: "none" as any,
        },
        transformer: "return data",
        schema: {},
        readable: true,
      }

      queries.store.update(s => ({ ...s, list: [QUERY_WITH_QS] }))
      const { container } = setupDOM({ queryId: QUERY_ID })

      // The URL input should show only the path, not the queryString
      await waitFor(() => {
        const urlInput = container.querySelector(
          ".url-input"
        ) as HTMLInputElement | null
        expect(urlInput?.value).toBe("https://api.example.com/search")
      })
    })

    it("saves with authConfigId set when datasource has a default auth and saved query had none", async () => {
      await setupDatasources(REST_DS_WITH_AUTH)
      queries.store.update(s => ({ ...s, list: [SAVED_QUERY] }))
      vi.mocked(API).saveQuery.mockResolvedValue({
        ...SAVED_QUERY,
        _rev: "2-updated",
      })
      const { container } = setupDOM({ queryId: QUERY_ID })

      await waitFor(() =>
        expect(container.querySelector(".query-name-input")).not.toBeNull()
      )
      const nameEl = container.querySelector(
        ".query-name-input"
      ) as HTMLInputElement
      await fireEvent.input(nameEl, { target: { value: "Updated" } })
      await fireEvent.blur(nameEl)

      const saveBtn = await waitFor(() => {
        const btn = getSaveButton(container)
        expect(btn?.classList.contains("is-disabled")).toBe(false)
        return btn!
      })
      await fireEvent.click(saveBtn)

      await waitFor(() => {
        const saved = vi.mocked(API).saveQuery.mock.calls[0]?.[0] as Query
        expect(saved.fields.authConfigId).toBe(BEARER_AUTH_CONFIG._id)
        expect(saved.fields.authConfigType).toBe(RestAuthType.BEARER)
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
      const nameEl = container.querySelector(
        ".query-name-input"
      ) as HTMLInputElement
      await fireEvent.input(nameEl, { target: { value: "Updated name" } })
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
      const nameEl = container.querySelector(
        ".query-name-input"
      ) as HTMLInputElement
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
      const nameEl = container.querySelector(
        ".query-name-input"
      ) as HTMLInputElement
      await fireEvent.input(nameEl, { target: { value: "New name" } })
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
      const nameEl = container.querySelector(
        ".query-name-input"
      ) as HTMLInputElement
      await fireEvent.input(nameEl, { target: { value: "New name" } })
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
      const nameEl = container.querySelector(
        ".query-name-input"
      ) as HTMLInputElement
      await fireEvent.input(nameEl, { target: { value: "New name" } })
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
      const nameEl = container.querySelector(
        ".query-name-input"
      ) as HTMLInputElement
      await fireEvent.input(nameEl, { target: { value: "temp" } })
      await fireEvent.blur(nameEl)
      await fireEvent.input(nameEl, { target: { value: "" } })
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

    it("Params tab shows parsed query params after committing a URL with a query string", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".url-input")).not.toBeNull()
      )
      const urlInput = container.querySelector(".url-input") as HTMLInputElement
      await fireEvent.input(urlInput, {
        target: { value: "https://api.example.com/users?page=1&limit=20" },
      })
      await fireEvent.blur(urlInput)

      await waitFor(() =>
        expect(getTab(container, "Params")).not.toBeUndefined()
      )
      await fireEvent.click(getTab(container, "Params")!)

      await waitFor(() => {
        const inputs = Array.from(
          container.querySelectorAll(".spectrum-Tabs-content input")
        ).map(i => (i as HTMLInputElement).value)
        expect(inputs).toContain("page")
        expect(inputs).toContain("limit")
      })
    })

    it("Headers tab shows existing header keys from a saved query", async () => {
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
        const inputs = Array.from(
          container.querySelectorAll(".spectrum-Tabs-content input")
        ).map(i => (i as HTMLInputElement).value)
        expect(inputs).toContain("X-Custom")
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

    it("persists form-data body parameters when switching tabs", async () => {
      queries.store.update(s => ({
        ...s,
        list: [
          {
            ...SAVED_QUERY,
            queryVerb: "create",
            fields: {
              ...SAVED_QUERY.fields,
              bodyType: "form" as any,
              requestBody: {},
            },
          },
        ],
      }))
      const { container } = setupDOM({ queryId: QUERY_ID })
      const getBodyTextInputs = () =>
        Array.from(
          container.querySelectorAll(".spectrum-Tabs-content input")
        ).filter(
          input => (input as HTMLInputElement).type !== "radio"
        ) as HTMLInputElement[]

      await waitFor(() => expect(getTab(container, "Body")).not.toBeUndefined())
      await fireEvent.click(getTab(container, "Body")!)

      const addParamButton = await waitFor(() => {
        const button = Array.from(container.querySelectorAll("button")).find(
          btn => btn.textContent?.trim().includes("Add param")
        )
        expect(button).not.toBeUndefined()
        return button as HTMLButtonElement
      })
      await fireEvent.click(addParamButton)

      await waitFor(() => {
        expect(getBodyTextInputs().length).toBeGreaterThanOrEqual(2)
      })
      const [keyInput, valueInput] = getBodyTextInputs()

      await fireEvent.input(keyInput, { target: { value: "username" } })
      await fireEvent.blur(keyInput)
      await fireEvent.input(valueInput, { target: { value: "alice" } })
      await fireEvent.blur(valueInput)

      await fireEvent.click(getTab(container, "Bindings")!)
      await fireEvent.click(getTab(container, "Body")!)

      await waitFor(() => {
        const values = getBodyTextInputs().map(input => input.value)
        expect(values).toContain("username")
        expect(values).toContain("alice")
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

    const getAddBindingButton = (container: HTMLElement) =>
      Array.from(container.querySelectorAll("button")).find(b =>
        b.textContent?.trim().includes("Add binding")
      )

    it("Add binding button is disabled in custom mode when no datasource is selected", async () => {
      const { container } = setupDOM()
      await waitFor(() =>
        expect(getAddBindingButton(container)).not.toBeUndefined()
      )
      expect(getAddBindingButton(container)).toBeDisabled()
    })

    it("Add binding button is enabled in custom mode when a datasource is selected", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        expect(getAddBindingButton(container)).not.toBeDisabled()
      })
    })
  })

  describe("Base URL / globe picker", () => {
    it("pre-populates base URL input from datasource config.url for a new query", async () => {
      await setupDatasources(REST_DS_WITH_URL)
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        const urlInput = container.querySelector(
          ".url-input"
        ) as HTMLInputElement | null
        expect(urlInput?.value).toBe("https://api.example.com")
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
        expect(container.querySelector(".url-input")).not.toBeNull()
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
        const urlInput = container.querySelector(
          ".url-input"
        ) as HTMLInputElement | null
        expect(urlInput?.value).toBe("https://api.example.com")
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
        expect(container.querySelector(".url-input")).not.toBeNull()
      })
    })

    it("CustomEndpointInput is disabled when no datasource is selected", async () => {
      const { container } = setupDOM()
      await waitFor(() => {
        expect(
          container
            .querySelector(".input-wrap")
            ?.classList.contains("is-disabled")
        ).toBe(true)
      })
    })

    it("CustomEndpointInput is enabled when a datasource is selected", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        expect(
          container
            .querySelector(".input-wrap")
            ?.classList.contains("is-disabled")
        ).toBe(false)
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
        expect(container.querySelector(".url-input")).not.toBeNull()
      )
      const urlInput = container.querySelector(".url-input") as HTMLInputElement
      await fireEvent.input(urlInput, {
        target: { value: "https://api.example.com/api/v1/users" },
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

    it("Save button is enabled when the URL contains an HBS binding", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".url-input")).not.toBeNull()
      )
      const urlInput = container.querySelector(".url-input") as HTMLInputElement
      await fireEvent.input(urlInput, {
        target: { value: "{{env.API_URL}}/api/health" },
      })
      await waitFor(() => {
        expect(
          getSaveButton(container)?.classList.contains("is-disabled")
        ).toBe(false)
      })
    })

    it("loads the stored full URL into the URL input", async () => {
      queries.store.update(s => ({ ...s, list: [CUSTOM_QUERY] }))
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() => {
        const urlInput = container.querySelector(
          ".url-input"
        ) as HTMLInputElement | null
        expect(urlInput?.value).toBe("https://api.example.com/api/users")
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
      const nameEl = container.querySelector(
        ".query-name-input"
      ) as HTMLInputElement
      await fireEvent.input(nameEl, { target: { value: "Updated name" } })
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

  describe("Template mode", () => {
    const TEMPLATE_QUERY: Query = {
      ...SAVED_QUERY,
      restTemplateMetadata: {
        operationId: "getUsers",
        originalPath: "/api/users",
        description: "Get all users",
      },
    }

    const TEMPLATE_QUERY_NO_ENDPOINT: Query = {
      ...SAVED_QUERY,
    }

    beforeEach(() => {
      vi.mocked(hasRestTemplate).mockReturnValue(true)
      queries.store.update(s => ({ ...s, list: [TEMPLATE_QUERY] }))
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    afterEach(() => {
      vi.mocked(hasRestTemplate).mockReturnValue(false)
    })

    it("renders endpoint Select instead of CustomEndpointInput", async () => {
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() => {
        expect(container.querySelector(".url-input")).toBeNull()
        expect(container.querySelector(".picker-button")).not.toBeNull()
      })
    })

    it("Send button is disabled when no endpoint is selected", async () => {
      queries.store.update(s => ({
        ...s,
        list: [TEMPLATE_QUERY_NO_ENDPOINT],
      }))
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() => {
        expect(
          getSendButton(container)?.classList.contains("is-disabled")
        ).toBe(true)
      })
    })

    it("Send button is enabled when an endpoint is selected", async () => {
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() => {
        expect(
          getSendButton(container)?.classList.contains("is-disabled")
        ).toBe(false)
      })
    })

    it("Add binding button is disabled when no endpoint is selected", async () => {
      queries.store.update(s => ({
        ...s,
        list: [TEMPLATE_QUERY_NO_ENDPOINT],
      }))
      const { container } = setupDOM({ queryId: QUERY_ID })
      const getAddBindingButton = () =>
        Array.from(container.querySelectorAll("button")).find(b =>
          b.textContent?.trim().includes("Add binding")
        )
      await waitFor(() => expect(getAddBindingButton()).not.toBeUndefined())
      expect(getAddBindingButton()).toBeDisabled()
    })

    it("Add binding button is enabled when an endpoint is selected", async () => {
      const { container } = setupDOM({ queryId: QUERY_ID })
      const getAddBindingButton = () =>
        Array.from(container.querySelectorAll("button")).find(b =>
          b.textContent?.trim().includes("Add binding")
        )
      await waitFor(() => {
        expect(getAddBindingButton()).not.toBeDisabled()
      })
    })

    it("Pagination tab is not shown", async () => {
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() =>
        expect(
          Array.from(container.querySelectorAll(".spectrum-Tabs-item")).find(
            t => t.textContent?.trim().includes("Bindings")
          )
        ).not.toBeUndefined()
      )
      expect(
        Array.from(container.querySelectorAll(".spectrum-Tabs-item")).find(t =>
          t.textContent?.trim().includes("Pagination")
        )
      ).toBeUndefined()
    })

    it("shows endpoint details when an endpoint is selected", async () => {
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() => {
        expect(container.querySelector(".details")).not.toBeNull()
      })
    })

    it("hides endpoint details when no endpoint is selected", async () => {
      queries.store.update(s => ({
        ...s,
        list: [TEMPLATE_QUERY_NO_ENDPOINT],
      }))
      const { container } = setupDOM({ queryId: QUERY_ID })
      await waitFor(() =>
        expect(container.querySelector(".picker-button")).not.toBeNull()
      )
      expect(container.querySelector(".details")).toBeNull()
    })

    it("isValidCustomUrl is always true — Save is not blocked by URL validation", async () => {
      queries.store.update(s => ({
        ...s,
        list: [TEMPLATE_QUERY_NO_ENDPOINT],
      }))
      vi.mocked(API).saveQuery.mockResolvedValue({
        ...TEMPLATE_QUERY_NO_ENDPOINT,
        _rev: "2-updated",
      })
      const { container } = setupDOM({ queryId: QUERY_ID })
      // Dirty the query by changing the name
      await waitFor(() =>
        expect(container.querySelector(".query-name-input")).not.toBeNull()
      )
      const nameEl = container.querySelector(
        ".query-name-input"
      ) as HTMLInputElement
      await fireEvent.input(nameEl, { target: { value: "New name" } })
      await fireEvent.blur(nameEl)
      // Save should not be blocked by URL validation even with no endpoint
      // (it will be blocked by newQueryIncomplete for a new query, but this is
      // an existing query so existingQueryUnchanged gates it instead)
      await waitFor(() => {
        expect(
          getSaveButton(container)?.classList.contains("is-disabled")
        ).toBe(false)
      })
    })

    it("renders TemplateEndpointInput (not CustomEndpointInput) in template mode", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        // CustomEndpointInput has .url-input; template mode should not
        expect(container.querySelector(".url-input")).toBeNull()
        // TemplateEndpointInput wraps the endpoint Select in .input-wrap
        expect(container.querySelector(".input-wrap")).not.toBeNull()
      })
    })

    it("TemplateEndpointInput is disabled when no datasource is selected", async () => {
      const { container } = setupDOM()
      await waitFor(() => {
        expect(
          container
            .querySelector(".input-wrap")
            ?.classList.contains("is-disabled")
        ).toBe(true)
      })
    })

    it("TemplateEndpointInput is enabled when a datasource is selected", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() => {
        expect(
          container
            .querySelector(".input-wrap")
            ?.classList.contains("is-disabled")
        ).toBe(false)
      })
    })

    it("saves edited binding default value in query parameters for a new template query", async () => {
      vi.mocked(restTemplates.get).mockReturnValue({
        id: "my-api",
        name: "My API",
        connectionMode: undefined,
        specs: [{ version: "1.0.0", url: "https://example.com/spec.yaml" }],
      } as any)

      const endpoint = {
        id: "getUser",
        operationId: "getUser",
        name: "Get User",
        method: "GET",
        path: "/users/{userId}",
        queryVerb: "read" as const,
        description: "Get a user by ID",
        defaultBindings: { userId: "123" },
      }

      vi.spyOn(queries, "fetchImportInfo").mockResolvedValue({
        endpoints: [endpoint],
        url: "https://api.example.com",
      } as any)

      // Need this for the redirect "on save" or it'll barf
      vi.mocked(API).saveQuery.mockResolvedValue({ _id: "new_query_id" } as any)

      const { container } = setupDOM({ datasourceId: REST_DS_ID })

      const getTabLocal = (title: string) =>
        Array.from(container.querySelectorAll(".spectrum-Tabs-item")).find(t =>
          t.textContent?.trim().includes(title)
        ) as HTMLElement | undefined

      // Wait for loadEndpoints to finish — the Picker trigger appears once endpointOptions loads
      const pickerTrigger = await waitFor(() => {
        const el = container.querySelector(
          ".input-wrap .spectrum-Picker"
        ) as HTMLElement | null
        expect(el).not.toBeNull()
        return el!
      })

      // Open the endpoint Select dropdown and click the "Get User" menu item
      await fireEvent.click(pickerTrigger)
      const menuItem = await waitFor(() => {
        const item = Array.from(
          document.querySelectorAll(".spectrum-Menu-item")
        ).find(el => el.textContent?.includes("Get User")) as
          | HTMLElement
          | undefined
        expect(item).not.toBeUndefined()
        return item!
      })
      await fireEvent.click(menuItem)

      // applyEndpointDefaults runs after endpoint selection — Bindings tab gets populated
      await waitFor(() => expect(getTabLocal("Bindings")).not.toBeUndefined())
      await fireEvent.click(getTabLocal("Bindings")!)

      const valueInput = await waitFor(() => {
        const inputs = Array.from(
          container.querySelectorAll(".spectrum-Tabs-content input")
        ) as HTMLInputElement[]
        const el = inputs.find(i => i.value === "123")
        expect(el).not.toBeUndefined()
        return el!
      })

      await fireEvent.input(valueInput, { target: { value: "999" } })
      await fireEvent.blur(valueInput)

      const saveBtn = await waitFor(() => {
        const btn = getSaveButton(container)
        expect(btn?.classList.contains("is-disabled")).toBe(false)
        return btn!
      })
      await fireEvent.click(saveBtn)

      await waitFor(() => {
        const saved = vi.mocked(API).saveQuery.mock.calls[0]?.[0] as Query
        const param = saved?.parameters?.find(p => p.name === "userId")
        expect(param?.default).toBe("999")
      })

      vi.mocked(restTemplates.get).mockReturnValue(undefined)
    })
  })

  describe("URL commit / query param parsing", () => {
    it("blurring the URL input with a query string strips the query string from the URL input", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".url-input")).not.toBeNull()
      )
      const urlInput = container.querySelector(".url-input") as HTMLInputElement

      // Type a URL with query params, then commit via blur
      await fireEvent.input(urlInput, {
        target: { value: "https://api.example.com/users?page=2&limit=10" },
      })
      await fireEvent.blur(urlInput)

      // After urlCommit, customUrl is set to just the base (no query string).
      // The input's value should update to reflect this.
      await waitFor(() => {
        const input = container.querySelector(".url-input") as HTMLInputElement
        expect(input?.value).toBe("https://api.example.com/users")
      })
    })

    it("typing a URL without a query string does not populate Params", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".url-input")).not.toBeNull()
      )
      const urlInput = container.querySelector(".url-input") as HTMLInputElement

      // Type a plain URL with no query string, then commit
      await fireEvent.input(urlInput, {
        target: { value: "https://api.example.com/users" },
      })
      await fireEvent.blur(urlInput)

      const getTab = (title: string) =>
        Array.from(container.querySelectorAll(".spectrum-Tabs-item")).find(t =>
          t.textContent?.trim().includes(title)
        ) as HTMLElement | undefined

      await waitFor(() => expect(getTab("Params")).not.toBeUndefined())
      await fireEvent.click(getTab("Params")!)

      await waitFor(() => {
        const rows = container.querySelectorAll(
          ".spectrum-Tabs-content .spectrum-Table-row"
        )
        // No param rows should exist
        expect(rows.length).toBe(0)
      })
    })

    it("committing a second URL merges new params with existing ones and overwrites dupes", async () => {
      const buildUrlSpy = vi.spyOn(queryModule, "buildUrl")
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".url-input")).not.toBeNull()
      )
      const urlInput = container.querySelector(".url-input") as HTMLInputElement

      // First commit — sets page=1 and limit=10
      await fireEvent.input(urlInput, {
        target: { value: "https://api.example.com/users?page=1&limit=10" },
      })
      await fireEvent.blur(urlInput)

      // Second commit — page is updated to 2, sort is new; limit should be preserved
      await fireEvent.input(urlInput, {
        target: { value: "https://api.example.com/users?page=2&sort=asc" },
      })
      await fireEvent.blur(urlInput)

      // buildUrl is called reactively with the merged queryParams — check the last call
      await waitFor(() => {
        const calls = buildUrlSpy.mock.calls
        const lastParams = calls[calls.length - 1]?.[1] as
          | Record<string, string>
          | undefined
        expect(lastParams?.["page"]).toBe("2") // overwritten
        expect(lastParams?.["limit"]).toBe("10") // preserved
        expect(lastParams?.["sort"]).toBe("asc") // new
      })
    })

    it("committing a URL strips the query string from the path field", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".url-input")).not.toBeNull()
      )
      const urlInput = container.querySelector(".url-input") as HTMLInputElement

      await fireEvent.input(urlInput, {
        target: { value: "https://api.example.com/items?foo=bar" },
      })
      await fireEvent.blur(urlInput)

      // Save the query to inspect what path gets persisted
      vi.mocked(API).saveQuery.mockResolvedValue({
        _id: "new_id",
        _rev: "1-new",
        datasourceId: REST_DS_ID,
        name: "Untitled request",
        queryVerb: "read",
        parameters: [],
        fields: { path: "https://api.example.com/items" },
        transformer: "return data",
        schema: {},
        readable: true,
      })

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
        // The path stored should not include the query string
        expect(saved?.fields?.path).toBe("https://api.example.com/items")
      })
    })
  })

  // A shared collection (e.g. HubSpot) stores one datasource for all its child
  // APIs — the user picks the child in the TemplateEndpointInput child picker.
  describe("Template mode — shared collection", () => {
    const SHARED_COLLECTION_TEMPLATE = {
      id: "hubspot",
      name: "HubSpot",
      connectionMode: "shared" as const,
      templates: [
        {
          id: "hubspot-contacts",
          name: "HubSpot Contacts",
          specs: [{ version: "v3", url: "https://example.com/contacts.yaml" }],
        },
        {
          id: "hubspot-companies",
          name: "HubSpot Companies",
          specs: [{ version: "v3", url: "https://example.com/companies.yaml" }],
        },
      ],
    }

    beforeEach(() => {
      vi.mocked(hasRestTemplate).mockReturnValue(true)
      vi.mocked(restTemplates.get).mockReturnValue(
        SHARED_COLLECTION_TEMPLATE as any
      )
    })

    afterEach(() => {
      vi.mocked(hasRestTemplate).mockReturnValue(false)
      vi.mocked(restTemplates.get).mockReturnValue(undefined)
    })

    it("Send and Save buttons are disabled when no child template is selected", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".input-wrap")).not.toBeNull()
      )
      expect(getSendButton(container)?.classList.contains("is-disabled")).toBe(
        true
      )
      expect(getSaveButton(container)?.classList.contains("is-disabled")).toBe(
        true
      )
    })

    it("saves with restTemplateId preserved from query metadata", async () => {
      const QUERY_WITH_CHILD: Query = {
        ...SAVED_QUERY,
        restTemplateMetadata: {
          operationId: "getContacts",
          originalPath: "/crm/v3/objects/contacts",
          restTemplateId: "hubspot-contacts" as any,
        },
      }
      queries.store.update(s => ({ ...s, list: [QUERY_WITH_CHILD] }))
      vi.mocked(API).saveQuery.mockResolvedValue({
        ...QUERY_WITH_CHILD,
        _rev: "2-updated",
      })
      const { container } = setupDOM({ queryId: QUERY_ID })

      await waitFor(() =>
        expect(container.querySelector(".query-name-input")).not.toBeNull()
      )
      const nameEl = container.querySelector(
        ".query-name-input"
      ) as HTMLInputElement
      await fireEvent.input(nameEl, { target: { value: "Updated" } })
      await fireEvent.blur(nameEl)

      const saveBtn = await waitFor(() => {
        const btn = getSaveButton(container)
        expect(btn?.classList.contains("is-disabled")).toBe(false)
        return btn!
      })
      await fireEvent.click(saveBtn)

      await waitFor(() => {
        const saved = vi.mocked(API).saveQuery.mock.calls[0]?.[0] as Query
        expect(saved.restTemplateMetadata?.restTemplateId).toBe(
          "hubspot-contacts"
        )
      })
    })
  })

  // An independent collection (e.g. Twilio) creates one datasource per child
  // API — the child is identified by the datasource's restTemplateId field.
  // No child picker is shown; spec comes from getRestTemplateIdentifier(datasource).
  describe("Template mode — independent collection", () => {
    const INDEPENDENT_COLLECTION_TEMPLATE = {
      id: "twilio",
      name: "Twilio",
      connectionMode: "independent" as const,
      templates: [
        {
          id: "twilio-sms",
          name: "Twilio SMS",
          specs: [{ version: "1.0.0", url: "https://example.com/sms.yaml" }],
        },
        {
          id: "twilio-accounts",
          name: "Twilio Accounts",
          specs: [
            { version: "1.0.0", url: "https://example.com/accounts.yaml" },
          ],
        },
      ],
    }

    beforeEach(() => {
      vi.mocked(hasRestTemplate).mockReturnValue(true)
      vi.mocked(restTemplates.get).mockReturnValue(
        INDEPENDENT_COLLECTION_TEMPLATE as any
      )
    })

    afterEach(() => {
      vi.mocked(hasRestTemplate).mockReturnValue(false)
      vi.mocked(restTemplates.get).mockReturnValue(undefined)
      vi.mocked(getRestTemplateIdentifier).mockReturnValue(undefined)
    })

    it("child picker is not shown (TemplateEndpointInput gets empty templates array)", async () => {
      // For independent collections the child is encoded in the datasource itself,
      // not chosen at query time — so templates=[] means no child picker trigger.
      vi.mocked(getRestTemplateIdentifier).mockReturnValue("twilio-sms")
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".input-wrap")).not.toBeNull()
      )
      // .child-trigger is only rendered when templates.length > 1
      expect(container.querySelector(".child-trigger")).toBeNull()
    })
  })

  describe("Datasource switching (new query)", () => {
    it("updates baseUrlOptions when switching datasource", async () => {
      await setupTwoDatasources(REST_DS, REST_DS_2_WITH_URL)
      const { container, rerender } = setupDOM({ datasourceId: REST_DS_ID })

      // Initially REST_DS has no URL, so no globe icon
      await waitFor(() =>
        expect(container.querySelector(".url-input")).not.toBeNull()
      )
      expect(container.querySelector(".globe-icon")).toBeNull()

      // Switch to DS 2 which has a base URL - globe icon should appear
      await rerender({ datasourceId: REST_DS_ID_2 })
      await waitFor(() =>
        expect(container.querySelector(".globe-icon")).not.toBeNull()
      )
    })

    it("does not overwrite customUrl for an existing (saved) query when datasource list updates", async () => {
      // Existing query already has a path — switching to a datasource with a different
      // base URL should NOT overwrite the stored path.
      await setupTwoDatasources(REST_DS_WITH_URL, REST_DS_2_WITH_URL)

      const EXISTING_QUERY: Query = {
        _id: QUERY_ID,
        _rev: "1-abc",
        datasourceId: REST_DS_ID,
        name: "Existing request",
        queryVerb: "read",
        parameters: [],
        fields: {
          path: "https://api.example.com/my-endpoint",
          headers: {},
          disabledHeaders: {},
          queryString: "",
          bodyType: "none" as any,
        },
        transformer: "return data",
        schema: {},
        readable: true,
      }
      queries.store.update(s => ({ ...s, list: [EXISTING_QUERY] }))

      const { container } = setupDOM({ queryId: QUERY_ID })

      await waitFor(() => {
        const urlInput = container.querySelector(
          ".url-input"
        ) as HTMLInputElement | null
        // Should still show the stored path, not the datasource base URL
        expect(urlInput?.value).toBe("https://api.example.com/my-endpoint")
      })
    })

    it("pre-populates customUrl with the new datasource base URL for a new query", async () => {
      await setupTwoDatasources(REST_DS, REST_DS_2_WITH_URL)

      // Render with the second datasource (has a base URL)
      const { container } = setupDOM({ datasourceId: REST_DS_ID_2 })

      await waitFor(() => {
        const urlInput = container.querySelector(
          ".url-input"
        ) as HTMLInputElement | null
        expect(urlInput?.value).toBe("https://other.example.com")
      })
    })
  })

  describe("Navigation guard", () => {
    const dirtyNewQuery = async (container: Element) => {
      await waitFor(() =>
        expect(container.querySelector(".url-input")).not.toBeNull()
      )
      const urlInput = container.querySelector(".url-input") as HTMLInputElement
      await fireEvent.input(urlInput, {
        target: { value: "https://api.example.com/users" },
      })
      await fireEvent.blur(urlInput)
    }

    beforeEach(() => {
      navGuard = null
      gotoFn.mockReset()
      vi.mocked(confirm).mockResolvedValue(true)
    })

    it("allows navigation without prompting when the query is not dirty", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await waitFor(() =>
        expect(container.querySelector(".url-input")).not.toBeNull()
      )
      await navigateTo("/some/other/page")
      expect(confirm).not.toHaveBeenCalled()
      expect(gotoFn).toHaveBeenCalledWith("/some/other/page")
    })

    it("prompts when navigating away from a dirty new query", async () => {
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await dirtyNewQuery(container)
      await navigateTo("/some/other/page")
      expect(confirm).toHaveBeenCalled()
    })

    it("saves without redirecting (saveQuery(false)) when user confirms", async () => {
      vi.mocked(API).saveQuery.mockResolvedValue({ _id: "new_id" } as any)
      vi.mocked(confirm).mockImplementation(async ({ onConfirm }) => {
        return (await onConfirm?.()) ?? true
      })
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await dirtyNewQuery(container)
      await navigateTo("/some/other/page")
      expect(vi.mocked(API).saveQuery).toHaveBeenCalled()
      expect(gotoFn).toHaveBeenCalledWith("/some/other/page")
    })

    it("blocks navigation when save fails", async () => {
      vi.mocked(API).saveQuery.mockRejectedValue(new Error("network error"))
      vi.mocked(confirm).mockImplementation(async ({ onConfirm }) => {
        return (await onConfirm?.()) ?? true
      })
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await dirtyNewQuery(container)
      const allowed = await navigateTo("/some/other/page")
      expect(allowed).toBe(false)
      expect(gotoFn).not.toHaveBeenCalled()
    })

    it("discards the draft and navigates when user cancels", async () => {
      vi.spyOn(workspaceConnections, "discardDraft")
      vi.mocked(confirm).mockImplementation(async ({ onCancel }) => {
        return onCancel?.() ?? false
      })
      const { container } = setupDOM({ datasourceId: REST_DS_ID })
      await dirtyNewQuery(container)
      await navigateTo("/some/other/page")
      expect(workspaceConnections.discardDraft).toHaveBeenCalled()
      expect(gotoFn).toHaveBeenCalledWith("/some/other/page")
    })
  })
})
