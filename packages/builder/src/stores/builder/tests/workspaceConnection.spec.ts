import { describe, it, expect, beforeEach, vi } from "vitest"
import { get } from "svelte/store"
import {
  RestAuthType,
  SourceName,
  WorkspaceConnectionType,
  OAuth2CredentialsMethod,
  OAuth2GrantType,
} from "@budibase/types"
import type { WorkspaceConnectionResponse, Datasource } from "@budibase/types"
import type { OAuth2Config } from "@/types"

vi.mock("@/api", () => {
  return {
    API: {
      workspaceConnections: {
        fetch: vi.fn().mockResolvedValue([]),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  }
})

vi.mock("@/stores/builder/restTemplates", () => {
  return {
    restTemplates: {
      getById: vi.fn().mockReturnValue(undefined),
      get: vi.fn().mockReturnValue(undefined),
      subscribe: vi.fn((cb: any) => {
        cb({})
        return () => {}
      }),
    },
  }
})

vi.mock("@/stores/builder/oauth2", async () => {
  const { writable } = await import("svelte/store")
  return {
    oauth2: writable({ configs: [] as OAuth2Config[], loading: false }),
  }
})

vi.mock("@/stores/builder/datasources", async () => {
  const { writable, derived } = await import("svelte/store")
  const rawStore = writable({
    rawList: [] as Datasource[],
    selectedDatasourceId: null,
  })
  const derivedStore = derived(rawStore, $store => ({
    ...$store,
    list: $store.rawList,
  }))
  return {
    datasources: {
      subscribe: derivedStore.subscribe,
      set: (val: any) =>
        rawStore.set({
          rawList: val.list || val.rawList || [],
          selectedDatasourceId: null,
        }),
    },
  }
})

import { API } from "@/api"
import { oauth2 } from "@/stores/builder/oauth2"
import { datasources } from "@/stores/builder/datasources"
import { WorkspaceConnectionStore } from "../workspaceConnection"

const fetchMock = vi.mocked(API.workspaceConnections.fetch)

const setDatasources = (list: Partial<Datasource>[]) => {
  ;(datasources as any).set({ list })
}

function makeConnection(
  overrides: Partial<WorkspaceConnectionResponse> = {}
): WorkspaceConnectionResponse {
  return {
    _id: "workspace_connection_1",
    _rev: "1-abc",
    name: "My Connection",
    type: WorkspaceConnectionType.WORKSPACE_CONNECTION,
    auth: [
      {
        _id: "auth-1",
        name: "Basic",
        type: RestAuthType.BASIC,
        config: { username: "user", password: "****" },
      },
    ],
    props: {},
    ...overrides,
  }
}

function makeOAuth2Config(
  overrides: Partial<OAuth2Config> = {}
): OAuth2Config {
  return {
    _id: "oauth2-1",
    _rev: "1-abc",
    name: "OAuth Config",
    url: "https://auth.example.com/token",
    clientId: "client-id",
    clientSecret: "****",
    method: OAuth2CredentialsMethod.BODY,
    grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
    ...overrides,
  }
}

describe("WorkspaceConnectionStore", () => {
  let store: WorkspaceConnectionStore

  beforeEach(() => {
    store = new WorkspaceConnectionStore()
    fetchMock.mockReset()
    fetchMock.mockResolvedValue([])
    oauth2.set({ configs: [], loading: false })
    setDatasources([])
  })

  describe("fetch", () => {
    it("populates connections from API", async () => {
      const conn = makeConnection()
      fetchMock.mockResolvedValue([conn])

      await store.fetch()

      const state = get(store)
      expect(state.connections).toEqual([conn])
      expect(state.loading).toBe(false)
    })

    it("sets error on failure", async () => {
      fetchMock.mockRejectedValue(new Error("Network error"))

      await store.fetch()

      const state = get(store)
      expect(state.error).toBe("Network error")
      expect(state.loading).toBe(false)
    })
  })

  describe("select", () => {
    it("sets selectedConnectionId and resolves the selected connection", async () => {
      const conn = makeConnection()
      fetchMock.mockResolvedValue([conn])
      await store.fetch()

      store.select("workspace_connection_1")

      const state = get(store)
      expect(state.selectedConnectionId).toBe("workspace_connection_1")
      expect(state.selected?.sourceId).toBe("workspace_connection_1")
    })

    it("clears selection when null is passed", async () => {
      store.select("workspace_connection_1")
      store.select(null)

      const state = get(store)
      expect(state.selectedConnectionId).toBeNull()
      expect(state.selected).toBeUndefined()
    })
  })

  describe("derived list", () => {
    it("maps workspace connections with source type and default icon", async () => {
      const conn = makeConnection({ name: "WS Conn" })
      fetchMock.mockResolvedValue([conn])
      await store.fetch()

      const state = get(store)
      const item = state.list.find(c => c.source === "workspace_connection")
      expect(item).toBeDefined()
      expect(item?.name).toBe("WS Conn")
      expect(item?.sourceId).toBe("workspace_connection_1")
      expect(item?.icon).toEqual({ type: "icon", value: "lock-simple" })
    })

    it("includes OAuth2 configs as oauth2 source entries", async () => {
      oauth2.set({
        configs: [makeOAuth2Config()],
        loading: false,
      })

      await new Promise(r => setTimeout(r, 0))

      const state = get(store)
      const item = state.list.find(c => c.source === "oauth2")
      expect(item).toBeDefined()
      expect(item?.name).toBe("OAuth Config")
      expect(item?.sourceId).toBe("oauth2-1")
      expect(item?.icon).toEqual({ type: "icon", value: "key" })
    })

    it("includes REST datasources that have auth configs", async () => {
      setDatasources([
        {
          _id: "datasource_ds1",
          name: "REST API",
          source: SourceName.REST,
          config: {
            authConfigs: [
              {
                _id: "ds-auth-1",
                name: "Bearer",
                type: RestAuthType.BEARER,
                config: { token: "tok" },
              },
            ],
          },
        },
      ])

      await new Promise(r => setTimeout(r, 0))

      const state = get(store)
      const item = state.list.find(c => c.source === "datasource")
      expect(item).toBeDefined()
      expect(item?.name).toBe("REST API")
      expect(item?.sourceId).toBe("datasource_ds1")
    })

    it("includes REST datasources that have default headers", async () => {
      setDatasources([
        {
          _id: "datasource_ds2",
          name: "Headers DS",
          source: SourceName.REST,
          config: {
            defaultHeaders: { "X-Key": "val" },
          },
        },
      ])

      await new Promise(r => setTimeout(r, 0))

      const state = get(store)
      const item = state.list.find(c => c.source === "datasource")
      expect(item).toBeDefined()
      expect(item?.name).toBe("Headers DS")
    })

    it("includes REST datasources that have static variables", async () => {
      setDatasources([
        {
          _id: "datasource_ds3",
          name: "Static Vars DS",
          source: SourceName.REST,
          config: {
            staticVariables: { domain: "acme" },
          },
        },
      ])

      await new Promise(r => setTimeout(r, 0))

      const state = get(store)
      const item = state.list.find(c => c.source === "datasource")
      expect(item).toBeDefined()
      expect(item?.name).toBe("Static Vars DS")
    })

    it("excludes REST datasources that have no auth, headers, or static variables", async () => {
      setDatasources([
        {
          _id: "datasource_empty",
          name: "Empty DS",
          source: SourceName.REST,
          config: {},
        },
      ])

      await new Promise(r => setTimeout(r, 0))

      const state = get(store)
      const item = state.list.find(c => c.source === "datasource")
      expect(item).toBeUndefined()
    })

    it("excludes datasources created from a REST template since they are managed as workspace connections", async () => {
      setDatasources([
        {
          _id: "datasource_tmpl",
          name: "Template DS",
          source: SourceName.REST,
          restTemplateId: "hubspot" as any,
          config: {
            authConfigs: [
              {
                _id: "a1",
                name: "Auth",
                type: RestAuthType.BEARER,
                config: { token: "t" },
              },
            ],
          },
        },
      ])

      await new Promise(r => setTimeout(r, 0))

      const state = get(store)
      const item = state.list.find(c => c.source === "datasource")
      expect(item).toBeUndefined()
    })

    it("sorts all connection types alphabetically by name", async () => {
      const connZ = makeConnection({ _id: "wc_z", name: "Zebra" })
      const connA = makeConnection({ _id: "wc_a", name: "Alpha" })
      fetchMock.mockResolvedValue([connZ, connA])

      oauth2.set({
        configs: [makeOAuth2Config({ _id: "oauth-m", name: "Middle" })],
        loading: false,
      })

      await store.fetch()
      await new Promise(r => setTimeout(r, 0))

      const state = get(store)
      const names = state.list.map(c => c.name)
      expect(names).toEqual(["Alpha", "Middle", "Zebra"])
    })
  })
})
