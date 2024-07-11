import _ from "lodash"
import tk from "timekeeper"

import { CreateRowActionRequest, Table } from "@budibase/types"
import * as setup from "./utilities"
import { generator } from "@budibase/backend-core/tests"

describe("/rowsActions", () => {
  const config = setup.getConfig()

  let table: Table

  beforeAll(async () => {
    tk.freeze(new Date())
    await config.init()

    table = await config.api.table.save(setup.structures.basicTable())
  })

  afterAll(setup.afterAll)

  function createRowActionRequest(): CreateRowActionRequest {
    return {
      name: generator.word(),
    }
  }

  function unauthorisedTests() {
    it("returns unauthorised (401) for unauthenticated requests", async () => {
      await config.api.rowAction.save(
        table._id!,
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
        await config.api.rowAction.save(
          generator.guid(),
          createRowActionRequest(),
          { status: 403 }
        )
      })
    })

    it("rejects (404) for a non-existing table", async () => {
      await config.api.rowAction.save(
        generator.guid(),
        createRowActionRequest(),
        { status: 404 }
      )
    })
  }

  describe("create", () => {
    unauthorisedTests()

    it("accepts creating new row actions for", async () => {
      const rowAction = createRowActionRequest()

      const res = await config.api.rowAction.save(table._id!, rowAction, {
        status: 201,
      })

      expect(res).toEqual({
        _id: `${table._id}_row_actions`,
        _rev: expect.stringMatching(/^1-\w+/),
        actions: [{ name: rowAction.name }],
        tableId: table._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    })

    it("rejects with bad request when creating with no name", async () => {
      const rowAction: CreateRowActionRequest = {
        name: "",
      }

      await config.api.rowAction.save(table._id!, rowAction, {
        status: 400,
        body: {
          message: 'Invalid body - "name" is not allowed to be empty',
        },
      })
    })
  })

  describe("find", () => {
    unauthorisedTests()

    it("returns empty for tables without row actions", async () => {
      const tableId = table._id!
      const res = await config.api.rowAction.find(tableId)

      expect(res).toEqual({ tableId, actions: [] })
    })
  })
})
