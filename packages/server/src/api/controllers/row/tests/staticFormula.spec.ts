jest.mock("@budibase/backend-core", () => ({
  context: {
    getWorkspaceDB: jest.fn(),
  },
}))

jest.mock("../../../../db/linkedRows", () => ({
  squashLinks: jest.fn(),
}))

jest.mock("../../../../db/utils", () => ({
  getRowParams: jest.fn(),
}))

jest.mock("../../../../sdk", () => ({
  __esModule: true,
  default: {
    views: {
      getTable: jest.fn(),
      isView: jest.fn(),
    },
  },
}))

jest.mock("../../../../utilities/rowProcessor", () => ({
  outputProcessing: jest.fn(),
  processAIColumns: jest.fn(),
  processFormulas: jest.fn(),
}))

import { context } from "@budibase/backend-core"
import { Row, Table } from "@budibase/types"
import {
  outputProcessing,
  processFormulas,
} from "../../../../utilities/rowProcessor"
import { updateAllFormulasInTable } from "../staticFormula"

describe("updateAllFormulasInTable", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("indexes enriched rows before matching formula contexts", async () => {
    const rowCount = 100
    let enrichedIdReads = 0
    const rows = Array.from({ length: rowCount }, (_, index) => ({
      _id: `row-${index}`,
    }))
    const enrichedRows = rows.map(row => {
      const enrichedRow: Row = {}
      Object.defineProperty(enrichedRow, "_id", {
        enumerable: true,
        get() {
          enrichedIdReads += 1
          return row._id
        },
      })
      return enrichedRow
    })
    const bulkDocs = jest.fn()
    ;(context.getWorkspaceDB as jest.Mock).mockReturnValue({
      allDocs: jest.fn().mockResolvedValue({
        rows: rows.map(doc => ({ doc })),
      }),
      bulkDocs,
    })
    ;(outputProcessing as jest.Mock).mockResolvedValue(enrichedRows)
    ;(processFormulas as jest.Mock).mockImplementation(
      async (_table, row) => row
    )

    await updateAllFormulasInTable({ _id: "table-1" } as Table)

    expect(enrichedIdReads).toBe(rowCount)
    expect(processFormulas).toHaveBeenCalledTimes(rowCount)
    expect(bulkDocs).toHaveBeenCalledWith([])
  })
})
