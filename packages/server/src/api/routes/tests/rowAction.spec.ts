import _ from "lodash"
import tk from "timekeeper"

import { CreateRowActionRequest } from "@budibase/types"
import * as setup from "./utilities"
import { generator } from "@budibase/backend-core/tests"
import { Expectations } from "src/tests/utilities/api/base"

describe("/rowsActions", () => {
  const config = setup.getConfig()

  let tableId: string

  beforeAll(async () => {
    tk.freeze(new Date())
    await config.init()
  })

  beforeEach(async () => {
    const table = await config.api.table.save(setup.structures.basicTable())
    tableId = table._id!
  })

  afterAll(setup.afterAll)

  async function createRowAction(
    tableId: string,
    rowAction: CreateRowActionRequest,
    expectations?: Expectations,
    opts?: { publicUser?: boolean }
  ) {
    return await config.api.rowAction.save(
      tableId,
      rowAction,
      {
        ...expectations,
        status: expectations?.status || 201,
      },
      opts
    )
  }

  function createRowActionRequest(): CreateRowActionRequest {
    return {
      name: generator.word(),
    }
  }

  function unauthorisedTests() {
    it("returns unauthorised (401) for unauthenticated requests", async () => {
      await createRowAction(
        tableId,
        createRowActionRequest(),
        {
          status: 401,
          body: {
            message: "Session not authenticated",
          },
        },
        { publicUser: true }
      )
    })

    it("returns forbidden (403) for non-builder users", async () => {
      const user = await config.createUser({
        builder: {},
      })
      await config.withUser(user, async () => {
        await createRowAction(generator.guid(), createRowActionRequest(), {
          status: 403,
        })
      })
    })

    it("rejects (404) for a non-existing table", async () => {
      await createRowAction(generator.guid(), createRowActionRequest(), {
        status: 404,
      })
    })
  }

  describe("create", () => {
    unauthorisedTests()

    it("creates new row actions for tables without existing actions", async () => {
      const rowAction = createRowActionRequest()

      const res = await createRowAction(tableId, rowAction, { status: 201 })

      expect(res).toEqual({
        _id: `${tableId}_row_actions`,
        _rev: expect.stringMatching(/^1-\w+/),
        actions: [
          {
            id: expect.any(String),
            name: rowAction.name,
          },
        ],
        tableId: tableId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    })

    it("can create multiple row actions for the same table", async () => {
      const rowActions = generator.unique(() => createRowActionRequest(), 3)

      await createRowAction(tableId, rowActions[0])
      await createRowAction(tableId, rowActions[1])
      const res = await createRowAction(tableId, rowActions[2])

      expect(res).toEqual({
        _id: `${tableId}_row_actions`,
        _rev: expect.stringMatching(/^3-\w+/),
        actions: rowActions.map(a => ({
          id: expect.any(String),
          ...a,
        })),
        tableId: tableId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    })

    it("can create row actions for different tables", async () => {
      const otherTable = await config.api.table.save(
        setup.structures.basicTable()
      )
      const otherTableId = otherTable._id!

      const rowAction1 = createRowActionRequest()
      const rowAction2 = createRowActionRequest()

      const res1 = await createRowAction(tableId, rowAction1)
      const res2 = await createRowAction(otherTableId, rowAction2)

      expect(res1).toEqual({
        _id: `${tableId}_row_actions`,
        _rev: expect.stringMatching(/^1-\w+/),
        actions: [
          {
            id: expect.any(String),
            ...rowAction1,
          },
        ],
        tableId: tableId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      expect(res2).toEqual({
        _id: `${otherTableId}_row_actions`,
        _rev: expect.stringMatching(/^1-\w+/),
        actions: [
          {
            id: expect.any(String),
            ...rowAction2,
          },
        ],
        tableId: otherTableId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    })

    it("rejects with bad request when creating with no name", async () => {
      const rowAction: CreateRowActionRequest = {
        name: "",
      }

      await createRowAction(tableId, rowAction, {
        status: 400,
        body: {
          message: 'Invalid body - "name" is not allowed to be empty',
        },
      })
    })
  })

  describe("find", () => {
    unauthorisedTests()

    it("returns only the actions for the requested table", async () => {
      const rowActions = generator.unique(() => createRowActionRequest(), 5)
      for (const rowAction of rowActions) {
        await createRowAction(tableId, rowAction)
      }

      const otherTable = await config.api.table.save(
        setup.structures.basicTable()
      )
      const otherTableId = otherTable._id!
      await createRowAction(otherTableId, createRowActionRequest())

      const response = await config.api.rowAction.find(tableId)
      expect(response).toEqual(
        expect.objectContaining({
          tableId,
          actions: rowActions.map(a => ({
            id: expect.any(String),
            ...a,
          })),
        })
      )
    })

    it("returns empty for tables without row actions", async () => {
      const response = await config.api.rowAction.find(tableId)
      expect(response).toEqual(
        expect.objectContaining({
          tableId,
          actions: [],
        })
      )
    })
  })
})
