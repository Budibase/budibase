import { FieldType, TableSourceType } from "@budibase/types"
import type { Row, Table } from "@budibase/types"
import { seedTableRows } from "../seed"

const tableId = "ta_seed"
const devWorkspaceId = "app_dev_seed"
const prodWorkspaceId = "app_seed"

interface PageOptions {
  startkey?: string
  endkey?: string
  limit?: number
}

const devRows = new Map<string, Row>()
const prodRows = new Map<string, Row>()
let workspaceId = devWorkspaceId
let rowUsage = 0

const table: Table = {
  _id: tableId,
  name: "Seed test",
  type: "table",
  sourceId: "bb_internal",
  sourceType: TableSourceType.INTERNAL,
  schema: {
    name: { name: "name", type: FieldType.STRING },
    date: { name: "date", type: FieldType.DATETIME, ignoreTimezones: true },
  },
}

const saveRows = async (rows: Row[]) =>
  rows.map(row => {
    const id = row._id!
    if (prodRows.has(id)) {
      return { id, error: "conflict", reason: "Document update conflict." }
    }
    prodRows.set(id, { ...row, _rev: "1-prod" })
    return { id, rev: "1-prod" }
  })

const readPage = async ({ startkey = "", endkey, limit }: PageOptions) => ({
  rows: [...devRows.values()]
    .filter(
      row =>
        row._id! >= startkey && (endkey === undefined || row._id! <= endkey)
    )
    .sort((first, second) => first._id!.localeCompare(second._id!))
    .slice(0, limit)
    .map(row => ({ id: row._id!, key: row._id!, doc: { ...row } })),
})
const allDocs = jest.fn(readPage)
const findRows = async (ids: string[]) =>
  ids.flatMap(id => {
    const row = prodRows.get(id)
    return row ? [{ ...row }] : []
  })
const getMultiple = jest.fn(findRows)
const bulkDocs = jest.fn(saveRows)
const updateUsage = jest.fn(async () => {})
const incrementRows = async (count: number) => {
  rowUsage += count
}
const addRows = jest.fn(incrementRows)
const imported = jest.fn(async () => {})

jest.mock("@budibase/backend-core", () => ({
  context: {
    getWorkspaceDB: () =>
      workspaceId === devWorkspaceId
        ? { allDocs }
        : { getMultiple, bulkDocs, tryGet: async () => undefined },
    doInWorkspaceContext: async (
      destinationId: string,
      task: () => Promise<void>
    ) => {
      const previousWorkspace = workspaceId
      workspaceId = destinationId
      try {
        return await task()
      } finally {
        workspaceId = previousWorkspace
      }
    },
  },
  events: {
    rows: {
      get imported() {
        return imported
      },
    },
  },
}))

jest.mock("@budibase/pro", () => ({
  quotas: {
    get updateUsage() {
      return updateUsage
    },
    get addRows() {
      return addRows
    },
  },
}))

jest.mock("../../../../db/utils", () => ({
  getRowParams: jest.requireActual<
    typeof import("@budibase/backend-core/src/docIds/params")
  >("@budibase/backend-core/src/docIds/params").getRowParams,
}))

const createRows = (count: number) => {
  for (let index = 0; index < count; index++) {
    const id = `ro_${tableId}_${index.toString().padStart(5, "0")}`
    devRows.set(id, {
      _id: id,
      _rev: "2-dev",
      tableId,
      type: "row",
      name: `Row ${index}`,
    })
  }
}

const seed = () => seedTableRows({ table, prodWorkspaceId })

const expectCompleteCopy = () => {
  expect([...prodRows.keys()].sort()).toEqual([...devRows.keys()].sort())
  expect([...prodRows.values()].map(row => row.name).sort()).toEqual(
    [...devRows.values()].map(row => row.name).sort()
  )
}

describe("seedTableRows", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    devRows.clear()
    prodRows.clear()
    workspaceId = devWorkspaceId
    rowUsage = 0
    allDocs.mockReset().mockImplementation(readPage)
    getMultiple.mockReset().mockImplementation(findRows)
    bulkDocs.mockReset().mockImplementation(saveRows)
    updateUsage.mockReset().mockResolvedValue(undefined)
    addRows.mockReset().mockImplementation(incrementRows)
    imported.mockReset().mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  it("pages through a large table and copies stable IDs in bounded writes", async () => {
    createRows(1201)

    await seed()

    expectCompleteCopy()
    expect(rowUsage).toBe(1201)
    expect(allDocs.mock.calls.length).toBeGreaterThan(1)
    expect(
      allDocs.mock.calls.every(([options]) => options.limit! <= 1001)
    ).toBe(true)
    expect(bulkDocs.mock.calls.map(([rows]) => rows.length)).toEqual([
      500, 500, 201,
    ])
    expect(bulkDocs.mock.calls.flatMap(([rows]) => rows)).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ _rev: "2-dev" })])
    )
  })

  it("does not skip a row when the page cursor is deleted between reads", async () => {
    createRows(1201)
    const expectedIds = [...devRows.keys()]
    allDocs.mockImplementationOnce(async options => {
      const response = await readPage(options)
      devRows.delete(response.rows[response.rows.length - 1].id)
      return response
    })

    await seed()

    expect([...prodRows.keys()].sort()).toEqual(expectedIds.sort())
    expect(rowUsage).toBe(1201)
  })

  it("only copies the selected table across multiple pages", async () => {
    createRows(1201)
    const expectedIds = [...devRows.keys()]
    for (const otherTableId of ["ta_before", "ta_z_after"]) {
      const id = `ro_${otherTableId}_00000`
      devRows.set(id, {
        _id: id,
        tableId: otherTableId,
        type: "row",
        name: "Another table's row",
      })
    }

    await seed()

    expect([...prodRows.keys()].sort()).toEqual(expectedIds.sort())
    expect(rowUsage).toBe(1201)
  })

  it("counts known successes and fails if ambiguous writes cannot be checked", async () => {
    createRows(4)
    const verificationError = new Error("Read unavailable")
    const errorLog = jest.spyOn(console, "error").mockImplementation(() => {})
    getMultiple
      .mockResolvedValueOnce([])
      .mockRejectedValueOnce(verificationError)
    bulkDocs.mockImplementationOnce(async rows => {
      await saveRows(rows.slice(0, 2))
      return rows.map((row, index) =>
        index < 2
          ? { id: row._id!, rev: "1-prod" }
          : { id: row._id!, error: "timeout", reason: "Write failed" }
      )
    })

    await expect(seed()).rejects.toThrow("Write failed")

    expect(prodRows.size).toBe(2)
    expect(bulkDocs).toHaveBeenCalledTimes(1)
    expect(rowUsage).toBe(2)
    expect(imported).toHaveBeenCalledWith(table, 2)
    expect(errorLog).toHaveBeenCalledWith(
      `Failed to verify seeded rows for table ${tableId}`,
      verificationError
    )
  })

  it("retries only failed documents from a partial bulk response", async () => {
    createRows(4)
    bulkDocs.mockImplementationOnce(async rows => {
      await saveRows(rows.slice(0, 2))
      return rows.map((row, index) =>
        index < 2
          ? { id: row._id!, rev: "1-prod" }
          : { id: row._id!, error: "timeout", reason: "Write failed" }
      )
    })

    await Promise.all([
      expect(seed()).resolves.toBeUndefined(),
      jest.runAllTimersAsync(),
    ])

    expectCompleteCopy()
    expect(bulkDocs.mock.calls.map(([rows]) => rows.length)).toEqual([4, 2])
    expect(rowUsage).toBe(4)
  })

  it("reconciles an error returned after all documents were committed", async () => {
    createRows(4)
    bulkDocs.mockImplementationOnce(async rows => {
      await saveRows(rows)
      throw new Error("Gateway timeout")
    })

    await seed()

    expectCompleteCopy()
    expect(bulkDocs).toHaveBeenCalledTimes(1)
    expect(rowUsage).toBe(4)
  })

  it("retries missing documents after a timeout that committed part of a batch", async () => {
    createRows(4)
    bulkDocs.mockImplementationOnce(async rows => {
      await saveRows(rows.slice(0, 2))
      throw new Error("Gateway timeout")
    })

    await Promise.all([
      expect(seed()).resolves.toBeUndefined(),
      jest.runAllTimersAsync(),
    ])

    expectCompleteCopy()
    expect(bulkDocs.mock.calls.map(([rows]) => rows.length)).toEqual([4, 2])
    expect(rowUsage).toBe(4)
  })

  it("counts confirmed writes and rejects when retries are exhausted", async () => {
    createRows(4)
    const timeout = jest.spyOn(global, "setTimeout")
    bulkDocs.mockImplementation(async rows => {
      if (!prodRows.size) {
        await saveRows(rows.slice(0, 1))
      }
      return rows.map(row => ({
        id: row._id!,
        error: "timeout",
        reason: "Write failed",
      }))
    })

    await Promise.all([
      expect(seed()).rejects.toThrow("Write failed"),
      jest.runAllTimersAsync(),
    ])

    expect(prodRows.size).toBe(1)
    expect(bulkDocs).toHaveBeenCalledTimes(3)
    expect(rowUsage).toBe(1)
    expect(imported).toHaveBeenCalledTimes(1)
    expect(imported).toHaveBeenCalledWith(table, 1)
    expect(timeout.mock.calls.map(([, delay]) => delay)).toEqual([250, 500])
  })

  it("resumes a failed invocation without overwriting or charging existing rows", async () => {
    createRows(4)
    bulkDocs.mockImplementation(async rows => {
      if (!prodRows.size) {
        await saveRows(rows.slice(0, 1))
      }
      throw new Error("Gateway timeout")
    })
    await Promise.all([
      expect(seed()).rejects.toThrow("Gateway timeout"),
      jest.runAllTimersAsync(),
    ])
    bulkDocs.mockImplementation(saveRows)

    await seed()

    expectCompleteCopy()
    expect(rowUsage).toBe(4)
    expect(bulkDocs.mock.calls.at(-1)?.[0]).toHaveLength(3)
    expect(imported).toHaveBeenCalledTimes(2)
    expect(imported).toHaveBeenNthCalledWith(1, table, 1)
    expect(imported).toHaveBeenNthCalledWith(2, table, 3)
  })

  it("stops after committed rows when the quota update fails", async () => {
    createRows(501)
    addRows.mockRejectedValueOnce(new Error("Quota update failed"))

    await expect(seed()).rejects.toThrow("Quota update failed")

    expect(prodRows.size).toBe(500)
    expect(bulkDocs).toHaveBeenCalledTimes(1)
    expect(imported).toHaveBeenCalledWith(table, 500)
  })

  it("counts committed rows when the import event fails", async () => {
    createRows(501)
    imported.mockRejectedValueOnce(new Error("Import event failed"))

    await expect(seed()).rejects.toThrow("Import event failed")

    expect(prodRows.size).toBe(500)
    expect(rowUsage).toBe(500)
    expect(bulkDocs).toHaveBeenCalledTimes(1)
    expect(imported).toHaveBeenCalledWith(table, 500)
  })

  it("preserves the write error when quota and event finalization also fail", async () => {
    createRows(4)
    bulkDocs.mockImplementation(async rows => {
      if (!prodRows.size) {
        await saveRows(rows.slice(0, 1))
      }
      throw new Error("Gateway timeout")
    })
    addRows.mockRejectedValueOnce(new Error("Quota update failed"))
    imported.mockRejectedValueOnce(new Error("Import event failed"))
    jest.spyOn(console, "error").mockImplementation(() => {})

    await Promise.all([
      expect(seed()).rejects.toThrow("Gateway timeout"),
      jest.runAllTimersAsync(),
    ])

    expect(prodRows.size).toBe(1)
    expect(addRows).toHaveBeenCalledWith(1, undefined, { tableId })
    expect(imported).toHaveBeenCalledWith(table, 1)
  })

  it("does not write when the quota preflight fails", async () => {
    createRows(4)
    updateUsage.mockRejectedValueOnce(new Error("Row quota exceeded"))

    await expect(seed()).rejects.toThrow("Row quota exceeded")

    expect(prodRows.size).toBe(0)
    expect(bulkDocs).not.toHaveBeenCalled()
    expect(rowUsage).toBe(0)
  })

  it("sanitizes timezone suffixes and strips attachments while preserving row IDs", async () => {
    createRows(1)
    const row = [...devRows.values()][0]
    row.date = "2025-12-18T16:09:03.950Z"
    row._attachments = { fixture: { content_type: "text/plain", data: "eA==" } }

    await seed()

    expect(prodRows.get(row._id!)).toMatchObject({
      _id: row._id,
      date: "2025-12-18T16:09:03.950",
    })
    expect(prodRows.get(row._id!)).not.toHaveProperty("_attachments")
  })

  it("does not write or charge quota for an empty source", async () => {
    await seed()

    expect(prodRows.size).toBe(0)
    expect(bulkDocs).not.toHaveBeenCalled()
    expect(updateUsage).not.toHaveBeenCalled()
    expect(rowUsage).toBe(0)
  })
})
