import { generator } from "@budibase/backend-core/tests"
import {
  AIOperationEnum,
  CalculationType,
  Datasource,
  FieldType,
  RelationshipType,
  Table,
  ViewV2,
  ViewV2Type,
} from "@budibase/types"
import { generateViewID } from "../../../../../db/utils"
import { structures } from "../../../../routes/tests/utilities"
import { buildSqlFieldList } from "../sqlUtils"

import { context } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../../../integrations/tests/utils"

const descriptions = datasourceDescribe({
  only: [DatabaseName.POSTGRES],
})

if (descriptions.length) {
  describe.each(descriptions)(
    "buildSqlFieldList ($dbName)",
    ({ config, dsProvider }) => {
      let allTables: Record<string, Table>
      let datasource: Datasource

      beforeEach(async () => {
        const ds = await dsProvider()
        datasource = ds.datasource!
        allTables = {}
      })

      class TableConfig {
        private _table: Table

        constructor(name: string) {
          this._table = {
            ...structures.tableForDatasource(datasource),
            name,
            schema: {
              name: {
                name: "name",
                type: FieldType.STRING,
              },
              description: {
                name: "description",
                type: FieldType.STRING,
              },
              amount: {
                name: "amount",
                type: FieldType.NUMBER,
              },
            },
          }
        }

        withHiddenField(field: string) {
          this._table.schema[field].visible = false
          return this
        }

        withField(
          name: string,
          type:
            | FieldType.STRING
            | FieldType.NUMBER
            | FieldType.FORMULA
            | FieldType.AI,
          options?: { visible: boolean }
        ) {
          switch (type) {
            case FieldType.NUMBER:
            case FieldType.STRING:
              this._table.schema[name] = {
                name,
                type,
                ...options,
              }
              break
            case FieldType.FORMULA:
              this._table.schema[name] = {
                name,
                type,
                formula: "any",
                ...options,
              }
              break
            case FieldType.AI:
              this._table.schema[name] = {
                name,
                type,
                operation: AIOperationEnum.PROMPT,
                ...options,
              }
              break
            default:
              utils.unreachable(type)
          }
          return this
        }

        withRelation(name: string, toTableId: string) {
          this._table.schema[name] = {
            name,
            type: FieldType.LINK,
            relationshipType: RelationshipType.ONE_TO_MANY,
            fieldName: "link",
            foreignKey: "link",
            tableId: toTableId,
          }
          return this
        }

        withPrimary(field: string) {
          this._table.primary = [field]
          return this
        }

        withDisplay(field: string) {
          this._table.primaryDisplay = field
          return this
        }

        async create() {
          const table = await config.api.table.save(this._table)
          allTables[table.name] = table
          return table
        }
      }

      class ViewConfig {
        private _view: ViewV2

        constructor(table: Table) {
          this._view = {
            version: 2,
            id: generateViewID(table._id!),
            name: generator.word(),
            tableId: table._id!,
          }
        }

        withVisible(field: string) {
          this._view.schema ??= {}
          this._view.schema[field] ??= {}
          this._view.schema[field].visible = true
          return this
        }

        withHidden(field: string) {
          this._view.schema ??= {}
          this._view.schema[field] ??= {}
          this._view.schema[field].visible = false
          return this
        }

        withRelationshipColumns(
          field: string,
          columns: Record<string, { visible: boolean }>
        ) {
          this._view.schema ??= {}
          this._view.schema[field] ??= {}
          this._view.schema[field].columns = columns
          return this
        }

        withCalculation(
          name: string,
          field: string,
          calculationType: CalculationType
        ) {
          this._view.type = ViewV2Type.CALCULATION
          this._view.schema ??= {}
          this._view.schema[name] = {
            field,
            calculationType,
            visible: true,
          }
          return this
        }

        async create() {
          return await config.api.viewV2.create(this._view)
        }
      }

      const buildSqlFieldListInApp: typeof buildSqlFieldList = async (
        table,
        allTables,
        opts
      ) => {
        return context.doInWorkspaceContext(config.getAppId(), () =>
          buildSqlFieldList(table, allTables, opts)
        )
      }

      describe("table", () => {
        it("extracts fields from table schema", async () => {
          const table = await new TableConfig("table").create()
          const result = await buildSqlFieldListInApp(table, {})
          expect(result).toEqual([
            "table.name",
            "table.description",
            "table.amount",
            "table.id",
          ])
        })

        it("excludes hidden fields", async () => {
          const table = await new TableConfig("table")
            .withHiddenField("description")
            .create()
          const result = await buildSqlFieldListInApp(table, {})
          expect(result).toEqual(["table.name", "table.amount", "table.id"])
        })

        it("excludes non-sql fields fields", async () => {
          const table = await new TableConfig("table")
            .withField("formula", FieldType.FORMULA)
            .withField("ai", FieldType.AI)
            .create()

          const result = await buildSqlFieldListInApp(table, {})
          expect(result).toEqual([
            "table.name",
            "table.description",
            "table.amount",
            "table.id",
          ])
        })

        it("includes hidden fields if there is a formula column", async () => {
          const table = await new TableConfig("table")
            .withHiddenField("description")
            .withField("formula", FieldType.FORMULA)
            .create()

          const result = await buildSqlFieldListInApp(table, {})
          expect(result).toEqual([
            "table.name",
            "table.description",
            "table.amount",
            "table.id",
          ])
        })

        it("includes relationships fields when flagged", async () => {
          const otherTable = await new TableConfig("linkedTable")
            .withField("id", FieldType.NUMBER)
            .withPrimary("id")
            .withDisplay("name")
            .create()

          const table = await new TableConfig("table")
            .withRelation("link", otherTable._id!)
            .create()

          const result = await buildSqlFieldListInApp(table, allTables, {
            relationships: true,
          })
          expect(result).toEqual([
            "table.name",
            "table.description",
            "table.amount",
            "table.id",
            "linkedTable.id",
            "linkedTable.name",
          ])
        })

        it("includes all relationship fields if there is a formula column", async () => {
          const otherTable = await new TableConfig("linkedTable")
            .withField("hidden", FieldType.STRING, { visible: false })
            .create()

          const table = await new TableConfig("table")
            .withRelation("link", otherTable._id!)
            .withField("formula", FieldType.FORMULA)
            .create()

          const result = await buildSqlFieldListInApp(table, allTables, {
            relationships: true,
          })
          expect(result).toEqual([
            "table.name",
            "table.description",
            "table.amount",
            "table.id",
            "linkedTable.name",
            "linkedTable.description",
            "linkedTable.amount",
            "linkedTable.hidden",
            "linkedTable.id",
          ])
        })

        it("never includes non-sql columns from relationships", async () => {
          const otherTable = await new TableConfig("linkedTable")
            .withField("hidden", FieldType.STRING, { visible: false })
            .withField("formula", FieldType.FORMULA)
            .withField("ai", FieldType.AI)
            .create()

          const table = await new TableConfig("table")
            .withRelation("link", otherTable._id!)
            .withField("formula", FieldType.FORMULA)
            .create()

          const result = await buildSqlFieldListInApp(table, allTables, {
            relationships: true,
          })
          expect(result).toEqual([
            "table.name",
            "table.description",
            "table.amount",
            "table.id",
            "linkedTable.name",
            "linkedTable.description",
            "linkedTable.amount",
            "linkedTable.hidden",
            "linkedTable.id",
          ])
        })
      })

      describe("view", () => {
        it("extracts fields from table schema", async () => {
          const view = await new ViewConfig(
            await new TableConfig("table").create()
          )
            .withVisible("amount")
            .withHidden("name")
            .create()

          const result = await buildSqlFieldListInApp(view, {})
          expect(result).toEqual(["table.amount", "table.id"])
        })

        it("includes all fields if there is a formula column", async () => {
          const table = await new TableConfig("table")
            .withField("formula", FieldType.FORMULA)
            .create()
          const view = await new ViewConfig(table)
            .withHidden("name")
            .withVisible("amount")
            .withVisible("formula")
            .create()

          const result = await buildSqlFieldListInApp(view, {})
          expect(result).toEqual([
            "table.name",
            "table.description",
            "table.amount",
            "table.id",
          ])
        })

        it("does not includes all fields if the formula column is not included", async () => {
          const table = await new TableConfig("table")
            .withField("formula", FieldType.FORMULA)
            .create()
          const view = await new ViewConfig(table)
            .withHidden("name")
            .withVisible("amount")
            .withHidden("formula")
            .create()

          const result = await buildSqlFieldListInApp(view, {})
          expect(result).toEqual(["table.amount", "table.id"])
        })

        it("includes relationships columns", async () => {
          const otherTable = await new TableConfig("linkedTable")
            .withField("id", FieldType.NUMBER)
            .withField("formula", FieldType.FORMULA)
            .withPrimary("id")
            .create()

          const table = await new TableConfig("table")
            .withRelation("link", otherTable._id!)
            .create()

          const view = await new ViewConfig(table)
            .withVisible("name")
            .withVisible("link")
            .withRelationshipColumns("link", {
              name: { visible: false },
              amount: { visible: true },
              formula: { visible: false },
            })
            .create()

          const result = await buildSqlFieldListInApp(view, allTables, {
            relationships: true,
          })
          expect(result).toEqual([
            "table.name",
            "table.id",
            "linkedTable.id",
            "linkedTable.amount",
          ])
        })

        it("excludes relationships fields when view is not included in the view", async () => {
          const otherTable = await new TableConfig("linkedTable")
            .withField("id", FieldType.NUMBER)
            .withPrimary("id")
            .withDisplay("name")
            .create()

          const table = await new TableConfig("table")
            .withRelation("link", otherTable._id!)
            .withField("formula", FieldType.FORMULA)
            .create()

          const view = await new ViewConfig(table)
            .withVisible("name")
            .withHidden("amount")
            .create()

          const result = await buildSqlFieldListInApp(view, allTables, {
            relationships: true,
          })
          expect(result).toEqual(["table.name", "table.id"])
        })

        it("does not include relationships columns for hidden links", async () => {
          const otherTable = await new TableConfig("linkedTable")
            .withField("id", FieldType.NUMBER)
            .withField("formula", FieldType.FORMULA)
            .withPrimary("id")
            .create()

          const table = await new TableConfig("table")
            .withRelation("link", otherTable._id!)
            .create()

          const view = await new ViewConfig(table)
            .withVisible("name")
            .withHidden("link")
            .withRelationshipColumns("link", {
              name: { visible: false },
              amount: { visible: true },
              formula: { visible: false },
            })
            .create()

          const result = await buildSqlFieldListInApp(view, allTables, {
            relationships: true,
          })
          expect(result).toEqual(["table.name", "table.id"])
        })

        it("includes all relationship fields if there is a formula column", async () => {
          const otherTable = await new TableConfig("linkedTable")
            .withField("id", FieldType.NUMBER)
            .withField("hidden", FieldType.STRING, { visible: false })
            .withField("formula", FieldType.FORMULA)
            .withField("ai", FieldType.AI)
            .withPrimary("id")
            .create()

          const table = await new TableConfig("table")
            .withRelation("link", otherTable._id!)
            .withField("formula", FieldType.FORMULA)
            .create()

          const view = await new ViewConfig(table)
            .withVisible("name")
            .withVisible("formula")
            .withHidden("link")
            .withRelationshipColumns("link", {
              name: { visible: false },
              amount: { visible: true },
              formula: { visible: false },
            })
            .create()

          const result = await buildSqlFieldListInApp(view, allTables, {
            relationships: true,
          })
          expect(result).toEqual([
            "table.name",
            "table.description",
            "table.amount",
            "table.id",
            "linkedTable.name",
            "linkedTable.description",
            "linkedTable.amount",
            "linkedTable.id",
            "linkedTable.hidden",
          ])
        })
      })

      describe("calculation view", () => {
        it("does not include calculation fields", async () => {
          const view = await new ViewConfig(
            await new TableConfig("table").create()
          )
            .withCalculation("average", "amount", CalculationType.AVG)

            .create()

          const result = await buildSqlFieldListInApp(view, {})
          expect(result).toEqual([])
        })

        it("includes visible fields calculation fields", async () => {
          const view = await new ViewConfig(
            await new TableConfig("table").create()
          )
            .withCalculation("average", "amount", CalculationType.AVG)
            .withHidden("name")
            .withVisible("amount")

            .create()

          const result = await buildSqlFieldListInApp(view, {})
          expect(result).toEqual(["table.amount"])
        })
      })
    }
  )
}
