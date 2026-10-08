// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest"
import { get } from "svelte/store"

const saveRow = vi.fn()

vi.mock("@/api", () => ({ API: { saveRow } }))
vi.mock("./dataSource", () => ({
  dataSourceStore: { actions: { invalidateDataSource: vi.fn() } },
}))
vi.mock("./notification", () => ({
  notificationStore: { actions: { success: vi.fn() } },
}))

const setOnline = (online: boolean) => {
  Object.defineProperty(navigator, "onLine", {
    value: online,
    configurable: true,
  })
}

const loadStore = async () => {
  vi.resetModules()
  const { offlineQueueStore } = await import("./offlineQueue")
  return offlineQueueStore
}

describe("offlineQueueStore", () => {
  beforeEach(() => {
    localStorage.clear()
    saveRow.mockReset()
    setOnline(true)
  })

  it("persists queued rows across reloads", async () => {
    const store = await loadStore()
    store.actions.enqueue({ tableId: "ta_1", name: "Offline" })

    const reloaded = await loadStore()
    const { submissions, pendingCount } = get(reloaded)
    expect(pendingCount).toEqual(1)
    expect(submissions[0].row).toEqual({ tableId: "ta_1", name: "Offline" })
  })

  it("syncs pending rows in order and removes them", async () => {
    const store = await loadStore()
    store.actions.enqueue({ tableId: "ta_1", name: "First" })
    store.actions.enqueue({ tableId: "ta_1", name: "Second" })
    saveRow.mockResolvedValue({})

    await store.actions.sync()

    expect(saveRow.mock.calls.map(([row]) => row.name)).toEqual([
      "First",
      "Second",
    ])
    expect(get(store).submissions).toEqual([])
  })

  it("does not sync while offline", async () => {
    const store = await loadStore()
    store.actions.enqueue({ tableId: "ta_1" })
    setOnline(false)

    await store.actions.sync()

    expect(saveRow).not.toHaveBeenCalled()
    expect(get(store).pendingCount).toEqual(1)
  })

  it("keeps rows pending when the network or session fails", async () => {
    const store = await loadStore()
    store.actions.enqueue({ tableId: "ta_1", name: "First" })
    store.actions.enqueue({ tableId: "ta_1", name: "Second" })
    saveRow.mockRejectedValue({ status: 403, message: "Forbidden" })

    await store.actions.sync()

    expect(saveRow).toHaveBeenCalledTimes(1)
    expect(get(store).pendingCount).toEqual(2)
  })

  it("marks rows rejected by the server as failed and retries them", async () => {
    const store = await loadStore()
    const { id } = store.actions.enqueue({ tableId: "ta_1" })
    saveRow.mockRejectedValueOnce({ status: 400, message: "name is required" })

    await store.actions.sync()
    expect(get(store).submissions[0]).toMatchObject({
      status: "failed",
      error: "name is required",
    })

    saveRow.mockResolvedValueOnce({})
    await store.actions.retry(id)
    expect(get(store).submissions).toEqual([])
  })

  it("resets a failed row to pending when it is edited", async () => {
    const store = await loadStore()
    const { id } = store.actions.enqueue({ tableId: "ta_1" })
    saveRow.mockRejectedValueOnce({ status: 400, message: "name is required" })
    await store.actions.sync()

    store.actions.updateRow(id, { tableId: "ta_1", name: "Fixed" })

    expect(get(store).submissions[0]).toMatchObject({
      status: "pending",
      row: { name: "Fixed" },
    })
  })
})
