import { context } from "@budibase/backend-core"
import sdk from "../../../.."
import TestConfiguration from "../../../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../../../tests/utilities/structures"
import { isProdWorkspaceID } from "../../../../../db/utils"
import { fetch } from "../internal/internal"

describe("internal row fetch", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("falls back to the dev table when the prod lookup 404s", async () => {
    const table = await config.api.table.save(basicTable())
    const realGetTable = sdk.tables.getTable

    const getTableSpy = jest
      .spyOn(sdk.tables, "getTable")
      .mockImplementation(async tableId => {
        const workspaceId = context.getWorkspaceId()
        if (workspaceId && isProdWorkspaceID(workspaceId)) {
          const error: any = new Error("Not found")
          error.status = 404
          throw error
        }
        return realGetTable(tableId)
      })

    const rows = await config.doInContext(config.getProdWorkspaceId(), () =>
      fetch(table._id!)
    )

    expect(rows).toEqual([])
    expect(getTableSpy).toHaveBeenCalled()
  })

  it("rethrows non-404 errors from prod table lookups", async () => {
    const prodError: any = new Error("boom")
    prodError.status = 500

    jest.spyOn(sdk.tables, "getTable").mockImplementation(async () => {
      const workspaceId = context.getWorkspaceId()
      if (workspaceId && isProdWorkspaceID(workspaceId)) {
        throw prodError
      }
      return basicTable()
    })

    await expect(
      config.doInContext(config.getProdWorkspaceId(), () =>
        fetch("missing-table")
      )
    ).rejects.toBe(prodError)
  })
})
