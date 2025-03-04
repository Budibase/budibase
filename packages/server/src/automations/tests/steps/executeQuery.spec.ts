import { Datasource, Query } from "@budibase/types"
import * as setup from "../utilities"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../integrations/tests/utils"
import { Knex } from "knex"
import { generator } from "@budibase/backend-core/tests"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

const descriptions = datasourceDescribe({
  plus: true,
  exclude: [DatabaseName.SQS],
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
        await config.api.automation.deleteAll()
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
        const { steps } = await createAutomationBuilder(config)
          .onAppAction()
          .executeQuery({ query: { queryId: query._id! } })
          .test({ fields: {} })

        expect(steps[0].outputs.response).toEqual([{ a: "string", b: 1 }])
        expect(steps[0].outputs.success).toEqual(true)
      })

      it("should handle a null query value", async () => {
        const { steps } = await createAutomationBuilder(config)
          .onAppAction()
          // @ts-expect-error - intentionally passing null
          .executeQuery({ query: { queryId: null } })
          .test({ fields: {} })

        expect(steps[0].outputs.response).toStartWith("Error:")
        expect(steps[0].outputs.success).toEqual(false)
      })

      it("should handle an error executing a query", async () => {
        const { steps } = await createAutomationBuilder(config)
          .onAppAction()
          .executeQuery({ query: { queryId: "wrong_id" } })
          .test({ fields: {} })

        expect(steps[0].outputs.response).toStartWith("Error:")
        expect(steps[0].outputs.success).toEqual(false)
      })
    }
  )
}
