import _ from "lodash"
import { Table } from "@budibase/types"
import * as setup from "./utilities"
import { generator } from "@budibase/backend-core/tests"

describe("/rowsActions", () => {
  const config = setup.getConfig()

  let table: Table

  beforeAll(async () => {
    await config.init()

    table = await config.api.table.save(setup.structures.basicTable())
  })

  afterAll(setup.afterAll)

  function unauthorisedTests() {
    it("returns unauthorised (401) for unauthenticated requests", async () => {
      await config.api.rowAction.save(
        table._id!,
        {},
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
        await config.api.rowAction.save(generator.guid(), {}, { status: 403 })
      })
    })

    it("rejects (404) for a non-existing table", async () => {
      await config.api.rowAction.save(generator.guid(), {}, { status: 404 })
    })
  }

  describe("create", () => {
    unauthorisedTests()

    it("accepts creating new row actions", async () => {
      const res = await config.api.rowAction.save(
        table._id!,
        {},
        { status: 201 }
      )

      expect(res).toEqual({})
    })
  })

  describe("find", () => {
    unauthorisedTests()

    it("returns empty for tables without row actions", async () => {
      const res = await config.api.rowAction.find(table._id!, {})

      expect(res).toEqual({ actions: [] })
    })
  })
})
