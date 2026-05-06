import { generator } from "@budibase/backend-core/tests"
import { Datasource, FieldType, LoopStepType } from "@budibase/types"
import { Knex } from "knex"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../integrations/tests/utils"
import { basicTable } from "../../../tests/utilities/structures"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

const descriptions = datasourceDescribe({ only: [DatabaseName.MYSQL] })

describe.each(descriptions)(
  "External database automation scenarios ($dbName)",
  ({ config, dsProvider }) => {
    let datasource: Datasource
    let client: Knex

    beforeAll(async () => {
      const ds = await dsProvider()
      datasource = ds.datasource!
      client = ds.client!
    })

    it("queries an external database and inserts the result into an internal table", async () => {
      const newTable = await config.api.table.save({
        ...basicTable(),
        name: "table",
        type: "table",
        schema: {
          name: {
            name: "name",
            type: FieldType.STRING,
            constraints: {
              presence: true,
            },
          },
          age: {
            name: "age",
            type: FieldType.NUMBER,
            constraints: {
              presence: true,
            },
          },
        },
      })

      const tableName = generator.guid()
      await client.schema.createTable(tableName, table => {
        table.string("name")
        table.integer("age")
      })

      const rows = [
        { name: "Joe", age: 20 },
        { name: "Bob", age: 25 },
        { name: "Paul", age: 30 },
      ]

      await client(tableName).insert(rows)

      const query = await config.api.query.save({
        name: "test query",
        datasourceId: datasource._id!,
        parameters: [],
        fields: {
          sql: client(tableName).select("*").toSQL().toNative().sql,
        },
        transformer: "",
        schema: {},
        readable: true,
        queryVerb: "read",
      })

      const results = await createAutomationBuilder(config)
        .onAppAction()
        .executeQuery({
          query: {
            queryId: query._id!,
          },
        })
        .loop({
          option: LoopStepType.ARRAY,
          binding: "{{ steps.1.response }}",
        })
        .createRow({
          row: {
            name: "{{ loop.currentItem.name }}",
            age: "{{ loop.currentItem.age }}",
            tableId: newTable._id!,
          },
        })
        .queryRows({
          tableId: newTable._id!,
        })
        .test({ fields: {} })

      expect(results.steps).toHaveLength(3)
      expect(results.steps[1].outputs.iterations).toBe(3)
      expect(results.steps[1].outputs.items).toHaveLength(3)
      expect(results.steps[2].outputs.rows).toHaveLength(3)

      rows.forEach(expectedRow => {
        expect(results.steps[2].outputs.rows).toEqual(
          expect.arrayContaining([expect.objectContaining(expectedRow)])
        )
      })
    })
  }
)
