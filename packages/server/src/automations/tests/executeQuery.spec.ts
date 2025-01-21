import { Datasource, Query } from "@budibase/types"
import * as setup from "./utilities"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../integrations/tests/utils"
import { Knex } from "knex"
import { generator } from "@budibase/backend-core/tests"

const descriptions = datasourceDescribe({
  exclude: [DatabaseName.MONGODB, DatabaseName.SQS],
})

if (descriptions.length) {
  describe.each(descriptions)(
    "execute query action ($dbName)",
    ({ config, dsProvider }) => {
      let tableName: string
      let client: Knex
      let datasource: Datasource
      let query: Query

      beforeAll(async () => {
        const ds = await dsProvider()
        datasource = ds.datasource!
        client = ds.client!
      })

      beforeEach(async () => {
        tableName = generator.guid()
        await client.schema.createTable(tableName, table => {
          table.string("a")
          table.integer("b")
        })
        await client(tableName).insert({ a: "string", b: 1 })
        query = await setup.saveTestQuery(config, client, tableName, datasource)
      })

      afterEach(async () => {
        await client.schema.dropTable(tableName)
      })

      it("should be able to execute a query", async () => {
        let res = await setup.runStep(
          config,
          setup.actions.EXECUTE_QUERY.stepId,
          {
            query: { queryId: query._id },
          }
        )
        expect(res.response).toEqual([{ a: "string", b: 1 }])
        expect(res.success).toEqual(true)
      })

      it("should handle a null query value", async () => {
        let res = await setup.runStep(
          config,
          setup.actions.EXECUTE_QUERY.stepId,
          {
            query: null,
          }
        )
        expect(res.response.message).toEqual("Invalid inputs")
        expect(res.success).toEqual(false)
      })

      it("should handle an error executing a query", async () => {
        let res = await setup.runStep(
          config,
          setup.actions.EXECUTE_QUERY.stepId,
          {
            query: { queryId: "wrong_id" },
          }
        )
        expect(res.response).toBeDefined()
        expect(res.success).toEqual(false)
      })
    }
  )
}
