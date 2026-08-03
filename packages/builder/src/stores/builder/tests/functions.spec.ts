import { API } from "@/api"
import { FunctionStore } from "@/stores/builder/functions"
import { workspaceDeploymentStore } from "@/stores/builder/workspaceDeployment"
import type { FunctionResponse } from "@budibase/types"
import { PublishResourceState, SourceName } from "@budibase/types"
import { get } from "svelte/store"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/api", () => ({
  API: {
    getFunctions: vi.fn(),
    getFunctionStatus: vi.fn(),
    getFunctionQueryCatalog: vi.fn(),
    getFunction: vi.fn(),
    compileFunction: vi.fn(),
    buildFunction: vi.fn(),
    createFunction: vi.fn(),
    updateFunction: vi.fn(),
    deleteFunction: vi.fn(),
  },
}))

const makeFunction = (
  overrides: Partial<FunctionResponse> = {}
): FunctionResponse => ({
  _id: "fn_one",
  _rev: "1-one",
  appId: "app_dev_test",
  name: "Lookup customer",
  source: "export default async function () { return { output: {} } }",
  capabilities: [
    {
      capabilityId: "cap_one",
      queryId: "query_one",
      datasourceAlias: "CRM",
      queryAlias: "findCustomer",
      parameterNames: ["id"],
    },
  ],
  readiness: "ready",
  createdAt: "2026-07-23T12:00:00.000Z",
  updatedAt: "2026-07-23T12:00:00.000Z",
  artifact: {
    runnerProtocolVersion: 1,
    compiledJavaScript: "compiled",
    sourceHash: "source-hash",
    declarationsHash: "declarations-hash",
    compiledAt: "2026-07-23T12:00:00.000Z",
  },
  ...overrides,
})

describe("FunctionStore", () => {
  let store: FunctionStore

  beforeEach(() => {
    store = new FunctionStore()
    vi.clearAllMocks()
    vi.mocked(API.getFunctions).mockResolvedValue({ functions: [] })
    vi.mocked(API.getFunctionStatus).mockResolvedValue({ runner: "healthy" })
    workspaceDeploymentStore.set({
      automations: {},
      workspaceApps: {},
      tables: {},
      agents: {},
      functions: {},
    })
  })

  it("loads Functions and uses workspace publication status", async () => {
    const fn = makeFunction()
    vi.mocked(API.getFunctions).mockResolvedValue({ functions: [fn] })
    workspaceDeploymentStore.update(state => ({
      ...state,
      functions: {
        [fn._id]: {
          name: fn.name,
          published: true,
          unpublishedChanges: false,
          state: PublishResourceState.PUBLISHED,
        },
      },
    }))

    await store.fetch()

    expect(store.list).toEqual([
      expect.objectContaining({
        _id: fn._id,
        deploymentState: "published",
      }),
    ])
    expect(get(store).loading).toBe(false)
  })

  it("distinguishes unpublished changes and Functions not yet published", async () => {
    const changed = makeFunction({ _id: "fn_changed" })
    const newFunction = makeFunction({ _id: "fn_new", name: "New Function" })
    vi.mocked(API.getFunctions).mockResolvedValue({
      functions: [changed, newFunction],
    })
    workspaceDeploymentStore.update(state => ({
      ...state,
      functions: {
        [changed._id]: {
          name: changed.name,
          published: true,
          unpublishedChanges: true,
          state: PublishResourceState.PUBLISHED,
        },
      },
    }))

    await store.fetch()

    expect(store.list.map(fn => [fn._id, fn.deploymentState])).toEqual([
      ["fn_changed", "unpublished_changes"],
      ["fn_new", "not_published"],
    ])
  })

  it("uses the guarded server status as availability authority", async () => {
    await expect(store.fetchStatus()).resolves.toBe(true)
    expect(get(store)).toMatchObject({
      availability: "available",
      runnerStatus: "healthy",
      runnerStatusLoading: false,
    })

    store = new FunctionStore()
    vi.mocked(API.getFunctionStatus).mockRejectedValue({ status: 404 })
    await expect(store.fetchStatus()).resolves.toBe(false)
    expect(get(store)).toMatchObject({
      availability: "unavailable",
      runnerStatusLoading: false,
    })
  })

  it("revokes availability when a guarded Function request returns 404", async () => {
    await store.fetchStatus()
    vi.mocked(API.getFunctions).mockRejectedValue({ status: 404 })

    await store.fetch()

    expect(get(store)).toMatchObject({
      availability: "unavailable",
      functions: [],
      loading: false,
      error: undefined,
    })
  })

  it("stores a fetch error for the retry state", async () => {
    vi.mocked(API.getFunctions).mockRejectedValue(new Error("Network failed"))

    await store.fetch()

    expect(get(store)).toMatchObject({
      loading: false,
      error: "Network failed",
    })
  })

  it("fetches a single Function and adds it to the store", async () => {
    const fn = makeFunction()
    vi.mocked(API.getFunction).mockResolvedValue({ function: fn })

    await expect(store.fetchOne(fn._id)).resolves.toEqual(fn)

    expect(API.getFunction).toHaveBeenCalledWith(fn._id)
    expect(store.list[0]._id).toBe(fn._id)
  })

  it("loads the saved query catalog", async () => {
    const query = {
      queryId: "query_one",
      queryName: "Find customer",
      datasourceId: "datasource_one",
      datasourceName: "CRM",
      source: SourceName.POSTGRES,
      kind: "data" as const,
      parameters: [{ name: "id" }],
    }
    vi.mocked(API.getFunctionQueryCatalog).mockResolvedValue({
      queries: [query],
    })

    await store.fetchQueryCatalog()

    expect(get(store)).toMatchObject({
      queryCatalog: [query],
      catalogLoading: false,
      catalogError: undefined,
    })
  })

  it("stores query catalog API failures for retry", async () => {
    vi.mocked(API.getFunctionQueryCatalog).mockRejectedValue(
      new Error("Catalog unavailable")
    )

    await store.fetchQueryCatalog()

    expect(get(store)).toMatchObject({
      catalogLoading: false,
      catalogError: "Catalog unavailable",
    })
  })

  it("creates and renames while sending only editable Function fields", async () => {
    const fn = makeFunction()
    vi.mocked(API.createFunction).mockResolvedValue({ function: fn })
    vi.mocked(API.updateFunction).mockResolvedValue({
      function: makeFunction({ _rev: "2-two", name: "Renamed Function" }),
    })

    await store.create({
      name: fn.name,
      source: fn.source,
      capabilities: [],
    })
    await store.rename(fn, "Renamed Function")

    expect(API.updateFunction).toHaveBeenCalledWith(fn._id, {
      _rev: fn._rev,
      name: "Renamed Function",
      source: fn.source,
      capabilities: [
        {
          queryId: "query_one",
          datasourceAlias: "CRM",
          queryAlias: "findCustomer",
        },
      ],
    })
    expect(store.list[0].name).toBe("Renamed Function")
  })

  it("preserves the current Function when a rename revision conflicts", async () => {
    const fn = makeFunction()
    vi.mocked(API.getFunctions).mockResolvedValue({ functions: [fn] })
    await store.fetch()
    vi.mocked(API.updateFunction).mockRejectedValue({
      status: 409,
      message: "Function revision does not match.",
    })

    await expect(store.rename(fn, "Stale rename")).rejects.toMatchObject({
      status: 409,
    })

    expect(store.list[0]).toMatchObject({
      name: fn.name,
      _rev: fn._rev,
    })
  })

  it("validates an unsaved draft without changing the stored Function", async () => {
    const fn = makeFunction()
    const request = {
      functionId: fn._id,
      name: fn.name,
      source: "invalid TypeScript",
      capabilities: [],
    }
    vi.mocked(API.compileFunction).mockResolvedValue({
      diagnostics: [{ code: "TS2304", message: "Cannot find name" }],
    })

    await expect(store.compile(request)).resolves.toEqual({
      diagnostics: [{ code: "TS2304", message: "Cannot find name" }],
    })

    expect(API.compileFunction).toHaveBeenCalledWith(request)
    expect(store.list).toEqual([])
  })

  it("builds the saved revision and stores its new readiness", async () => {
    const fn = makeFunction({ readiness: "build_required" })
    const built = makeFunction({ _rev: "2-two", readiness: "ready" })
    vi.mocked(API.buildFunction).mockResolvedValue({ function: built })

    await expect(store.build(fn)).resolves.toEqual(built)

    expect(API.buildFunction).toHaveBeenCalledWith(fn._id, fn._rev)
    expect(store.list[0]).toEqual(
      expect.objectContaining({ _rev: "2-two", readiness: "ready" })
    )
  })

  it("requires a revision before building", async () => {
    const fn = makeFunction({ _rev: undefined })

    await expect(store.build(fn)).rejects.toThrow(
      "Function revision is missing"
    )
    expect(API.buildFunction).not.toHaveBeenCalled()
  })

  it("duplicates the draft without copying server-owned metadata", async () => {
    const fn = makeFunction()
    vi.mocked(API.getFunctions).mockResolvedValue({ functions: [fn] })
    await store.fetch()
    vi.mocked(API.createFunction).mockResolvedValue({
      function: makeFunction({
        _id: "fn_copy",
        name: "Lookup customer 1",
        artifact: undefined,
      }),
    })

    await store.duplicate(fn)

    expect(API.createFunction).toHaveBeenCalledWith({
      name: "Lookup customer 1",
      source: fn.source,
      capabilities: [
        {
          queryId: "query_one",
          datasourceAlias: "CRM",
          queryAlias: "findCustomer",
        },
      ],
    })
    expect(
      JSON.stringify(vi.mocked(API.createFunction).mock.calls)
    ).not.toContain("source-hash")
  })

  it("keeps a Function in the store when guarded deletion conflicts", async () => {
    const fn = makeFunction()
    vi.mocked(API.getFunctions).mockResolvedValue({ functions: [fn] })
    await store.fetch()
    vi.mocked(API.deleteFunction).mockRejectedValue({
      status: 409,
      message: "Function is used by: Customer sync.",
    })

    await expect(store.delete(fn)).rejects.toMatchObject({ status: 409 })

    expect(store.list).toHaveLength(1)
    expect(store.list[0]._id).toBe(fn._id)
  })

  it("removes a Function after successful deletion", async () => {
    const fn = makeFunction()
    vi.mocked(API.getFunctions).mockResolvedValue({ functions: [fn] })
    await store.fetch()
    vi.mocked(API.deleteFunction).mockResolvedValue()

    await store.delete(fn)

    expect(API.deleteFunction).toHaveBeenCalledWith(fn._id, fn._rev)
    expect(store.list).toEqual([])
  })
})
