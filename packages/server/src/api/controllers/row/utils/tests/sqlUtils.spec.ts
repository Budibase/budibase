import {
  AIOperationEnum,
  CalculationType,
  FieldType,
  RelationshipType,
  SourceName,
  Table,
  ViewV2,
  ViewV2Type,
} from "@budibase/types"
import { buildSqlFieldList } from "../sqlUtils"
import { structures } from "../../../../routes/tests/utilities"
import { sql } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import { generateViewID } from "../../../../../db/utils"

import sdk from "../../../../../sdk"
import { cloneDeep } from "lodash"
import { utils } from "@budibase/shared-core"

jest.mock("../../../../../sdk/app/views", () => ({
  ...jest.requireActual("../../../../../sdk/app/views"),
  getTable: jest.fn(),
}))
const getTableMock = sdk.views.getTable as jest.MockedFunction<
  typeof sdk.views.getTable
>

describe("buildSqlFieldList", () => {
  let allTables: Record<string, Table>

  class TableConfig {
    private _table: Table & { _id: string }

    constructor(name: string) {
      this._table = {
        ...structures.tableForDatasource({
          type: "datasource",
          source: SourceName.POSTGRES,
        }),
        name,
        _id: sql.utils.buildExternalTableId("ds_id", name),
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

      allTables[name] = this._table
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

    create() {
      return cloneDeep(this._table)
    }
  }

  class ViewConfig {
    private _table: Table
    private _view: ViewV2

    constructor(table: Table) {
      this._table = table
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

    create() {
      getTableMock.mockResolvedValueOnce(this._table)
      return cloneDeep(this._view)
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    allTables = {}
  })

  describe("table", () => {
    it("extracts fields from table schema", async () => {
      const table = new TableConfig("table").create()
      const result = await buildSqlFieldList(table, {})
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
      ])
    })

    it("excludes hidden fields", async () => {
      const table = new TableConfig("table")
        .withHiddenField("description")
        .create()
      const result = await buildSqlFieldList(table, {})
      expect(result).toEqual(["table.name", "table.amount"])
    })

    it("excludes non-sql fields fields", async () => {
      const table = new TableConfig("table")
        .withField("formula", FieldType.FORMULA)
        .withField("ai", FieldType.AI)
        .withRelation("link", "otherTableId")
        .create()

      const result = await buildSqlFieldList(table, {})
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
      ])
    })

    it("includes hidden fields if there is a formula column", async () => {
      const table = new TableConfig("table")
        .withHiddenField("description")
        .withField("formula", FieldType.FORMULA)
        .create()

      const result = await buildSqlFieldList(table, {})
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
      ])
    })

    it("includes relationships fields when flagged", async () => {
      const otherTable = new TableConfig("linkedTable")
        .withField("id", FieldType.NUMBER)
        .withPrimary("id")
        .withDisplay("name")
        .create()

      const table = new TableConfig("table")
        .withRelation("link", otherTable._id)
        .create()

      const result = await buildSqlFieldList(table, allTables, {
        relationships: true,
      })
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
        "linkedTable.id",
        "linkedTable.name",
      ])
    })

    it("includes all relationship fields if there is a formula column", async () => {
      const otherTable = new TableConfig("linkedTable")
        .withField("hidden", FieldType.STRING, { visible: false })
        .create()

      const table = new TableConfig("table")
        .withRelation("link", otherTable._id)
        .withField("formula", FieldType.FORMULA)
        .create()

      const result = await buildSqlFieldList(table, allTables, {
        relationships: true,
      })
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
        "linkedTable.name",
        "linkedTable.description",
        "linkedTable.amount",
        "linkedTable.hidden",
      ])
    })

    it("never includes non-sql columns from relationships", async () => {
      const otherTable = new TableConfig("linkedTable")
        .withField("id", FieldType.NUMBER)
        .withField("hidden", FieldType.STRING, { visible: false })
        .withField("formula", FieldType.FORMULA)
        .withField("ai", FieldType.AI)
        .withRelation("link", "otherTableId")
        .create()

      const table = new TableConfig("table")
        .withRelation("link", otherTable._id)
        .withField("formula", FieldType.FORMULA)
        .create()

      const result = await buildSqlFieldList(table, allTables, {
        relationships: true,
      })
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
        "linkedTable.name",
        "linkedTable.description",
        "linkedTable.amount",
        "linkedTable.id",
        "linkedTable.hidden",
      ])
    })
  })

  describe("view", () => {
    it("extracts fields from table schema", async () => {
      const view = new ViewConfig(new TableConfig("table").create())
        .withVisible("amount")
        .withHidden("name")
        .create()

      const result = await buildSqlFieldList(view, {})
      expect(result).toEqual(["table.amount"])
    })

    it("includes all fields if there is a formula column", async () => {
      const table = new TableConfig("table")
        .withField("formula", FieldType.FORMULA)
        .create()
      const view = new ViewConfig(table)
        .withHidden("name")
        .withVisible("amount")
        .withVisible("formula")
        .create()

      const result = await buildSqlFieldList(view, {})
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
      ])
    })

    it("does not includes all fields if the formula column is not included", async () => {
      const table = new TableConfig("table")
        .withField("formula", FieldType.FORMULA)
        .create()
      const view = new ViewConfig(table)
        .withHidden("name")
        .withVisible("amount")
        .withHidden("formula")
        .create()

      const result = await buildSqlFieldList(view, {})
      expect(result).toEqual(["table.amount"])
    })

    it("includes relationships columns", async () => {
      const otherTable = new TableConfig("linkedTable")
        .withField("id", FieldType.NUMBER)
        .withField("formula", FieldType.FORMULA)
        .withPrimary("id")
        .create()

      const table = new TableConfig("table")
        .withRelation("link", otherTable._id)
        .create()

      const view = new ViewConfig(table)
        .withVisible("name")
        .withVisible("link")
        .withRelationshipColumns("link", {
          name: { visible: false },
          amount: { visible: true },
          formula: { visible: false },
        })
        .create()

      const result = await buildSqlFieldList(view, allTables, {
        relationships: true,
      })
      expect(result).toEqual([
        "table.name",
        "linkedTable.id",
        "linkedTable.amount",
      ])
    })

    it("excludes relationships fields when view is not included in the view", async () => {
      const otherTable = new TableConfig("linkedTable")
        .withField("id", FieldType.NUMBER)
        .withPrimary("id")
        .withDisplay("name")
        .create()

      const table = new TableConfig("table")
        .withRelation("link", otherTable._id)
        .withField("formula", FieldType.FORMULA)
        .create()

      const view = new ViewConfig(table)
        .withVisible("name")
        .withHidden("amount")
        .create()

      const result = await buildSqlFieldList(view, allTables, {
        relationships: true,
      })
      expect(result).toEqual(["table.name"])
    })

    it("does not include relationships columns for hidden links", async () => {
      const otherTable = new TableConfig("linkedTable")
        .withField("id", FieldType.NUMBER)
        .withField("formula", FieldType.FORMULA)
        .withPrimary("id")
        .create()

      const table = new TableConfig("table")
        .withRelation("link", otherTable._id)
        .create()

      const view = new ViewConfig(table)
        .withVisible("name")
        .withHidden("link")
        .withRelationshipColumns("link", {
          name: { visible: false },
          amount: { visible: true },
          formula: { visible: false },
        })
        .create()

      const result = await buildSqlFieldList(view, allTables, {
        relationships: true,
      })
      expect(result).toEqual(["table.name"])
    })

    it("includes all relationship fields if there is a formula column", async () => {
      const otherTable = new TableConfig("linkedTable")
        .withField("id", FieldType.NUMBER)
        .withField("hidden", FieldType.STRING, { visible: false })
        .withField("formula", FieldType.FORMULA)
        .withField("ai", FieldType.AI)
        .withRelation("link", "otherTableId")
        .withPrimary("id")
        .create()

      const table = new TableConfig("table")
        .withRelation("link", otherTable._id)
        .withField("formula", FieldType.FORMULA)
        .create()

      const view = new ViewConfig(table)
        .withVisible("name")
        .withVisible("formula")
        .withHidden("link")
        .withRelationshipColumns("link", {
          name: { visible: false },
          amount: { visible: true },
          formula: { visible: false },
        })
        .create()

      const result = await buildSqlFieldList(view, allTables, {
        relationships: true,
      })
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
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
      const view = new ViewConfig(new TableConfig("table").create())
        .withCalculation("average", "amount", CalculationType.AVG)

        .create()

      const result = await buildSqlFieldList(view, {})
      expect(result).toEqual([])
    })

    it("includes visible fields calculation fields", async () => {
      const view = new ViewConfig(new TableConfig("table").create())
        .withCalculation("average", "amount", CalculationType.AVG)
        .withHidden("name")
        .withVisible("amount")

        .create()

      const result = await buildSqlFieldList(view, {})
      expect(result).toEqual(["table.amount"])
    })
  })
})
