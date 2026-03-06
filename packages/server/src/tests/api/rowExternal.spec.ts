import { quotas } from "@budibase/pro"
import { destroy, find, patch, save } from "../../api/controllers/row"

jest.mock("@budibase/pro", () => {
  const actual = jest.requireActual("@budibase/pro")
  return {
    ...actual,
    quotas: {
      ...actual.quotas,
      addAction: jest.fn().mockImplementation((fn: () => Promise<any>) => fn()),
      addRow: jest.fn().mockImplementation((fn: () => Promise<any>) => fn()),
      removeRow: jest.fn(),
      removeRows: jest.fn(),
    },
  }
})

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    events: {
      ...actual.events,
      action: { crudExecuted: jest.fn() },
    },
  }
})

jest.mock("../../integrations/utils", () => ({
  isExternalTableID: jest.fn().mockReturnValue(true),
}))

jest.mock("../../api/controllers/row/external", () => ({
  patch: jest.fn().mockResolvedValue({
    row: { _id: "row1" },
    table: { name: "T", _id: "table1" },
    oldRow: {},
  }),
  destroy: jest
    .fn()
    .mockResolvedValue({ response: "ok", row: { _id: "row1" } }),
  bulkDestroy: jest.fn().mockResolvedValue({ rows: [{ _id: "row1" }] }),
  fetchEnrichedRow: jest.fn(),
}))

jest.mock("../../api/controllers/row/internal", () => ({
  patch: jest.fn(),
  destroy: jest.fn(),
  bulkDestroy: jest.fn(),
  fetchEnrichedRow: jest.fn(),
}))

jest.mock("../../sdk", () => ({
  __esModule: true,
  default: {
    rows: {
      save: jest.fn().mockResolvedValue({
        row: { _id: "row1" },
        table: { name: "T" },
        squashed: undefined,
      }),
      find: jest.fn().mockResolvedValue({ _id: "row1" }),
    },
    users: { getUserContextBindings: jest.fn().mockReturnValue({}) },
    tables: {
      getAllTables: jest.fn().mockResolvedValue([]),
      getTable: jest.fn(),
    },
  },
}))

jest.mock("../../websockets", () => ({
  gridSocket: { emitRowUpdate: jest.fn(), emitRowDeletion: jest.fn() },
}))

jest.mock("../../api/controllers/public/rows", () => ({
  fixRow: jest.fn().mockImplementation((row: any) => row),
}))

jest.mock("../../api/controllers/public/utils", () => ({
  addRev: jest
    .fn()
    .mockResolvedValue({ _id: "row1", tableId: "datasource_plus_xxx" }),
}))

jest.mock("../../api/controllers/view/exporters", () => ({
  Format: {},
  isFormat: jest.fn(),
}))

jest.mock("../../api/controllers/row/utils", () => ({
  getSourceId: jest
    .fn()
    .mockReturnValue({ tableId: "datasource_plus_xxx", viewId: undefined }),
  isUserMetadataTable: jest.fn().mockReturnValue(false),
  enrichSearchContext: jest.fn(),
  getSource: jest.fn(),
  getTableFromSource: jest.fn(),
}))

function makeCtx(
  body: Record<string, any> = {},
  params: Record<string, any> = {}
) {
  return {
    request: { body },
    params,
    appId: "app_test",
    query: {},
    eventEmitter: { emitRow: jest.fn() },
    user: { _id: "user1" },
    body: undefined as any,
    message: undefined as any,
    status: 200,
    throw: jest.fn((_status: number, msg: string) => {
      throw new Error(msg)
    }),
    attachment: jest.fn(),
  }
}

describe("External table row operations quota tracking", () => {
  const addActionMock = quotas.addAction as jest.MockedFunction<
    typeof quotas.addAction
  >
  const addRowMock = quotas.addRow as jest.MockedFunction<typeof quotas.addRow>

  beforeEach(() => {
    addActionMock.mockClear()
    addRowMock.mockClear()
  })

  describe("HTTP (UI/API) scope — addAction is called", () => {
    it("tracks patch on an external table as one action", async () => {
      const ctx = makeCtx({ _id: "row1" })
      await patch(ctx as any)
      expect(addActionMock).toHaveBeenCalledTimes(1)
    })

    it("tracks save on an external table as one action without row quota", async () => {
      const ctx = makeCtx({ name: "new row" })
      await save(ctx as any)
      expect(addActionMock).toHaveBeenCalledTimes(1)
      expect(addRowMock).not.toHaveBeenCalled()
    })

    it("tracks single-row delete on an external table as one action", async () => {
      const ctx = makeCtx({ _id: "row1" })
      await destroy(ctx as any)
      expect(addActionMock).toHaveBeenCalledTimes(1)
    })

    it("tracks bulk delete on an external table as one action", async () => {
      const ctx = makeCtx({ rows: [{ _id: "row1" }, { _id: "row2" }] })
      await destroy(ctx as any)
      expect(addActionMock).toHaveBeenCalledTimes(1)
    })
  })

  describe("Read operations — addAction is never called", () => {
    it("does not call addAction when reading a row", async () => {
      const ctx = makeCtx({}, { rowId: "row1" })
      await find(ctx as any)
      expect(addActionMock).not.toHaveBeenCalled()
    })
  })

  describe("Automation scope — addAction is not called", () => {
    it("does not call addAction on patch from an automation step", async () => {
      const ctx = makeCtx({ _id: "row1" })
      await patch(ctx as any, { isAutomation: true })
      expect(addActionMock).not.toHaveBeenCalled()
    })

    it("does not call addAction on save from an automation step", async () => {
      const ctx = makeCtx({ name: "new row" })
      await save(ctx as any, { isAutomation: true })
      expect(addActionMock).not.toHaveBeenCalled()
    })

    it("does not call addAction on single-row delete from an automation step", async () => {
      const ctx = makeCtx({ _id: "row1" })
      await destroy(ctx as any, { isAutomation: true })
      expect(addActionMock).not.toHaveBeenCalled()
    })

    it("does not call addAction on bulk delete from an automation step", async () => {
      const ctx = makeCtx({ rows: [{ _id: "row1" }, { _id: "row2" }] })
      await destroy(ctx as any, { isAutomation: true })
      expect(addActionMock).not.toHaveBeenCalled()
    })
  })
})
