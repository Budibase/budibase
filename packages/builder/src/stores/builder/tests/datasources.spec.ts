import { describe, it, expect, beforeEach, vi } from "vitest"
import { get } from "svelte/store"
import { SourceName, DatasourceFeature } from "@budibase/types"
import type { Datasource, UIIntegration } from "@budibase/types"

vi.mock("@/api", () => {
  return {
    API: {
      getDatasources: vi.fn().mockResolvedValue([]),
      createDatasource: vi.fn(),
      deleteDatasource: vi.fn(),
      updateDatasource: vi.fn(),
      buildDatasourceSchema: vi.fn(),
      validateDatasource: vi.fn(),
    },
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

vi.mock("@/stores/builder/queries", () => {
  return {
    removeDatasourceQueries: vi.fn(),
    saveQuery: vi.fn(),
    queries: {
      subscribe: vi.fn(() => () => {}),
    },
  }
})

vi.mock("@/stores/builder/restTemplates", () => {
  const templates: Record<string, { id: string; name: string; icon: string }> =
    {
      hubspot: { id: "hubspot", name: "HubSpot", icon: "hubspot.png" },
      "google-sheets": {
        id: "google-sheets",
        name: "Google Sheets",
        icon: "google-sheets.png",
      },
    }

  return {
    restTemplates: {
      getById: vi.fn((id: string) => templates[id]),
      get: vi.fn((nameOrId: string) => {
        if (templates[nameOrId]) {
          return templates[nameOrId]
        }
        return Object.values(templates).find(t => t.name === nameOrId)
      }),
      getByName: vi.fn((name: string) =>
        Object.values(templates).find(t => t.name === name)
      ),
      subscribe: vi.fn((cb: any) => {
        cb({})
        return () => {}
      }),
    },
  }
})

import { API } from "@/api"
import { tables } from "@/stores/builder/tables"
import { removeDatasourceQueries } from "@/stores/builder/queries"
import { DatasourceStore } from "../datasources"

const createDatasourceMock = vi.mocked(API.createDatasource)
const validateDatasourceMock = vi.mocked(API.validateDatasource)
const deleteDatasourceMock = vi.mocked(API.deleteDatasource)
const removeDatasourceTablesMock = vi.mocked(
  (tables as any).removeDatasourceTables
)
const removeDatasourceQueriesMock = vi.mocked(removeDatasourceQueries)

const makeDatasource = (
  overrides: Partial<Datasource> = {}
): Datasource => ({
  _id: "datasource_1",
  _rev: "1-abc",
  type: "datasource",
  name: "REST API",
  source: SourceName.REST,
  config: {},
  ...overrides,
})

const makeIntegration = (
  overrides: Partial<UIIntegration> = {}
): UIIntegration => ({
  name: SourceName.REST,
  friendlyName: "REST API",
  docs: "",
  description: "",
  type: "datasource",
  datasource: {} as any,
  query: {},
  ...overrides,
})

describe("DatasourceStore", () => {
  let store: DatasourceStore

  beforeEach(() => {
    store = new DatasourceStore()
    vi.clearAllMocks()
  })

  const setRawList = (list: Datasource[]) => {
    store.update(state => ({
      ...state,
      rawList: list,
    }))
  }

  describe("sourceCount", () => {
    it("counts datasources by source type", () => {
      setRawList([
        makeDatasource({ _id: "ds1", source: SourceName.REST }),
        makeDatasource({ _id: "ds2", source: SourceName.REST }),
        makeDatasource({ _id: "ds3", source: SourceName.POSTGRES }),
      ])

      expect(store.sourceCount(SourceName.REST)).toBe(2)
      expect(store.sourceCount(SourceName.POSTGRES)).toBe(1)
      expect(store.sourceCount(SourceName.MYSQL)).toBe(0)
    })

    it("filters by restTemplateId when provided", () => {
      setRawList([
        makeDatasource({
          _id: "ds1",
          source: SourceName.REST,
          restTemplateId: "hubspot" as any,
        }),
        makeDatasource({
          _id: "ds2",
          source: SourceName.REST,
          restTemplateId: "google-sheets" as any,
        }),
        makeDatasource({
          _id: "ds3",
          source: SourceName.REST,
        }),
      ])

      expect(store.sourceCount(SourceName.REST, "hubspot")).toBe(1)
      expect(store.sourceCount(SourceName.REST, "google-sheets")).toBe(1)
      expect(store.sourceCount(SourceName.REST)).toBe(3)
    })

    it("matches legacy restTemplate display names via restTemplates.get()", () => {
      setRawList([
        makeDatasource({
          _id: "ds1",
          source: SourceName.REST,
          restTemplate: "Google Sheets" as any,
        }),
      ])

      expect(store.sourceCount(SourceName.REST, "google-sheets")).toBe(1)
    })

    it("does not match when legacy name resolves to a different template id", () => {
      setRawList([
        makeDatasource({
          _id: "ds1",
          source: SourceName.REST,
          restTemplate: "HubSpot" as any,
        }),
      ])

      expect(store.sourceCount(SourceName.REST, "google-sheets")).toBe(0)
    })

    it("counts both legacy and new format datasources for the same template", () => {
      setRawList([
        makeDatasource({
          _id: "ds1",
          source: SourceName.REST,
          restTemplateId: "hubspot" as any,
        }),
        makeDatasource({
          _id: "ds2",
          source: SourceName.REST,
          restTemplate: "HubSpot" as any,
        }),
      ])

      expect(store.sourceCount(SourceName.REST, "hubspot")).toBe(2)
    })

    it("returns 0 when no datasources match", () => {
      setRawList([])
      expect(store.sourceCount(SourceName.REST, "hubspot")).toBe(0)
    })
  })

  describe("select", () => {
    it("sets selectedDatasourceId", () => {
      store.select("ds1")
      const state = get(store.store)
      expect(state.selectedDatasourceId).toBe("ds1")
    })
  })

  describe("replaceDatasource", () => {
    it("adds a new datasource to the list", () => {
      setRawList([])
      const ds = makeDatasource({ _id: "ds_new" })

      store.replaceDatasource("ds_new", ds)

      const state = get(store.store)
      expect(state.rawList).toHaveLength(1)
      expect(state.rawList[0]._id).toBe("ds_new")
    })

    it("updates an existing datasource in place", () => {
      const original = makeDatasource({ _id: "ds1", name: "Original" })
      setRawList([original])

      const updated = makeDatasource({ _id: "ds1", name: "Updated" })
      store.replaceDatasource("ds1", updated)

      const state = get(store.store)
      expect(state.rawList).toHaveLength(1)
      expect(state.rawList[0].name).toBe("Updated")
    })

    it("removes a datasource when no replacement is provided", () => {
      setRawList([
        makeDatasource({ _id: "ds1" }),
        makeDatasource({ _id: "ds2" }),
      ])

      store.replaceDatasource("ds1")

      const state = get(store.store)
      expect(state.rawList).toHaveLength(1)
      expect(state.rawList[0]._id).toBe("ds2")
    })

    it("cleans up tables and queries on deletion", () => {
      setRawList([makeDatasource({ _id: "ds1" })])

      store.replaceDatasource("ds1")

      expect(removeDatasourceTablesMock).toHaveBeenCalledWith("ds1")
      expect(removeDatasourceQueriesMock).toHaveBeenCalledWith("ds1")
    })

    it("does nothing when datasourceId is empty", () => {
      setRawList([makeDatasource({ _id: "ds1" })])

      store.replaceDatasource("")

      const state = get(store.store)
      expect(state.rawList).toHaveLength(1)
    })
  })

  describe("create", () => {
    it("generates the correct name for the first datasource", async () => {
      setRawList([])
      validateDatasourceMock.mockResolvedValue({ connected: true })
      createDatasourceMock.mockResolvedValue({
        datasource: makeDatasource({ _id: "ds_new", name: "REST API" }),
      } as any)

      await store.create({
        integration: makeIntegration(),
        config: {},
      })

      expect(createDatasourceMock).toHaveBeenCalledWith(
        expect.objectContaining({
          datasource: expect.objectContaining({ name: "REST API" }),
        })
      )
    })

    it("appends count suffix when datasources of the same type exist", async () => {
      setRawList([
        makeDatasource({ _id: "ds1", source: SourceName.REST }),
      ])
      validateDatasourceMock.mockResolvedValue({ connected: true })
      createDatasourceMock.mockResolvedValue({
        datasource: makeDatasource({ _id: "ds_new", name: "REST API 2" }),
      } as any)

      await store.create({
        integration: makeIntegration(),
        config: {},
      })

      expect(createDatasourceMock).toHaveBeenCalledWith(
        expect.objectContaining({
          datasource: expect.objectContaining({ name: "REST API 2" }),
        })
      )
    })

    it("uses custom name when provided", async () => {
      setRawList([])
      validateDatasourceMock.mockResolvedValue({ connected: true })
      createDatasourceMock.mockResolvedValue({
        datasource: makeDatasource({ _id: "ds_new", name: "My Custom DS" }),
      } as any)

      await store.create({
        integration: makeIntegration(),
        config: {},
        name: "My Custom DS",
      })

      expect(createDatasourceMock).toHaveBeenCalledWith(
        expect.objectContaining({
          datasource: expect.objectContaining({ name: "My Custom DS" }),
        })
      )
    })

    it("counts legacy datasources when generating name suffix", async () => {
      setRawList([
        makeDatasource({
          _id: "ds1",
          source: SourceName.REST,
          restTemplate: "HubSpot" as any,
        }),
      ])
      validateDatasourceMock.mockResolvedValue({ connected: true })
      createDatasourceMock.mockResolvedValue({
        datasource: makeDatasource({ _id: "ds_new", name: "HubSpot 2" }),
      } as any)

      await store.create({
        integration: makeIntegration({ friendlyName: "HubSpot" }),
        config: {},
        restTemplateId: "hubspot" as any,
      })

      expect(createDatasourceMock).toHaveBeenCalledWith(
        expect.objectContaining({
          datasource: expect.objectContaining({ name: "HubSpot 2" }),
        })
      )
    })

    it("throws when datasource validation fails", async () => {
      setRawList([])
      validateDatasourceMock.mockResolvedValue({
        connected: false,
        error: "Connection refused",
      })

      await expect(
        store.create({
          integration: makeIntegration({
            features: { [DatasourceFeature.CONNECTION_CHECKING]: true },
          }),
          config: {},
        })
      ).rejects.toThrow("Unable to connect - Connection refused")
    })
  })

  describe("deleteDatasource", () => {
    it("removes the datasource from the store", async () => {
      const ds = makeDatasource({ _id: "ds1", _rev: "1-abc" })
      setRawList([ds])
      deleteDatasourceMock.mockResolvedValue(undefined as any)

      await store.delete(ds)

      const state = get(store.store)
      expect(state.rawList).toHaveLength(0)
      expect(deleteDatasourceMock).toHaveBeenCalledWith("ds1", "1-abc")
    })

    it("does nothing when datasource has no _id", async () => {
      const ds = makeDatasource({ _id: undefined })

      await store.delete(ds)

      expect(deleteDatasourceMock).not.toHaveBeenCalled()
    })
  })
})
