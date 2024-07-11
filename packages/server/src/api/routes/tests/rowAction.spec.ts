import _ from "lodash"
import tk from "timekeeper"

import { CreateRowActionRequest, RowActionResponse } from "@budibase/types"
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

  function createRowActionRequests(count: number): CreateRowActionRequest[] {
    return generator
      .unique(() => generator.word(), count)
      .map(name => ({ name }))
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
      const res = await createRowAction(tableId, rowAction, {
        status: 201,
      })

      expect(res).toEqual({
        id: expect.stringMatching(/^row_action_\w+/),
        tableId: tableId,
        ...rowAction,
      })

      expect(await config.api.rowAction.find(tableId)).toEqual({
        _id: `ra_${tableId}`,
        _rev: expect.stringMatching(/^1-\w+/),
        tableId: tableId,
        actions: {
          [res.id]: rowAction,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    })

    it("can create multiple row actions for the same table", async () => {
      const rowActions = createRowActionRequests(3)
      const responses: RowActionResponse[] = []
      for (const action of rowActions) {
        responses.push(await createRowAction(tableId, action))
      }

      expect(await config.api.rowAction.find(tableId)).toEqual({
        _id: `ra_${tableId}`,
        _rev: expect.stringMatching(/^3-\w+/),
        actions: {
          [responses[0].id]: rowActions[0],
          [responses[1].id]: rowActions[1],
          [responses[2].id]: rowActions[2],
        },
        tableId: tableId,
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
      const rowActions: RowActionResponse[] = []
      for (const action of createRowActionRequests(3)) {
        rowActions.push(await createRowAction(tableId, action))
      }

      const otherTable = await config.api.table.save(
        setup.structures.basicTable()
      )
      await createRowAction(otherTable._id!, createRowActionRequest())

      const response = await config.api.rowAction.find(tableId)
      expect(response).toEqual(
        expect.objectContaining({
          tableId,
          actions: {
            [rowActions[0].id]: expect.any(Object),
            [rowActions[1].id]: expect.any(Object),
            [rowActions[2].id]: expect.any(Object),
          },
        })
      )
    })

    it("returns empty for tables without row actions", async () => {
      const response = await config.api.rowAction.find(tableId)
      expect(response).toEqual(
        expect.objectContaining({
          tableId,
          actions: {},
        })
      )
    })
  })

  describe("update", () => {
    unauthorisedTests()

    it("can update existing actions", async () => {
      for (const rowAction of createRowActionRequests(3)) {
        await createRowAction(tableId, rowAction)
      }

      const persisted = await config.api.rowAction.find(tableId)

      const [actionId, actionData] = _.sample(
        Object.entries(persisted.actions)
      )!

      const updatedName = generator.word()

      const res = await config.api.rowAction.update(tableId, actionId, {
        ...actionData,
        name: updatedName,
      })

      expect(res).toEqual({
        id: actionId,
        tableId,
        ...actionData,
        name: updatedName,
      })

      expect(await config.api.rowAction.find(tableId)).toEqual(
        expect.objectContaining({
          actions: expect.objectContaining({
            [actionId]: {
              ...actionData,
              name: updatedName,
            },
          }),
        })
      )
    })

    it("throws Bad Request when trying to update by a non-existing id", async () => {
      await createRowAction(tableId, createRowActionRequest())

      await config.api.rowAction.update(
        tableId,
        generator.guid(),
        createRowActionRequest(),
        { status: 400 }
      )
    })

    it("throws Bad Request when trying to update by a via another table id", async () => {
      const otherTable = await config.api.table.save(
        setup.structures.basicTable()
      )
      await createRowAction(otherTable._id!, createRowActionRequest())

      const action = await createRowAction(tableId, createRowActionRequest())
      await config.api.rowAction.update(
        otherTable._id!,
        action.id,
        createRowActionRequest(),
        { status: 400 }
      )
    })
  })
})
