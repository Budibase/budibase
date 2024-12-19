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
import { buildInternalFieldList } from "../sqs"
import { structures } from "../../../../../../api/routes/tests/utilities"
import { sql } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import {
  generateJunctionTableID,
  generateViewID,
} from "../../../../../../db/utils"

import sdk from "../../../../../../sdk"
import { cloneDeep } from "lodash"
import { utils } from "@budibase/shared-core"

jest.mock("../../../../../../sdk/app/views", () => ({
  ...jest.requireActual("../../../../../../sdk/app/views"),
  getTable: jest.fn(),
}))
const getTableMock = sdk.views.getTable as jest.MockedFunction<
  typeof sdk.views.getTable
>

describe("buildInternalFieldList", () => {
  let allTables: Table[]

  class TableConfig {
    private _table: Table & { _id: string }

    constructor() {
      const name = generator.word()
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

      allTables.push(this._table)
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

    withEmptySchema() {
      this._table.schema = {}
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
    allTables = []
  })

  describe("table", () => {
    it("includes internal columns by default", async () => {
      const table = new TableConfig().withEmptySchema().create()
      const result = await buildInternalFieldList(table, [])
      expect(result).toEqual([
        `${table._id}._id`,
        `${table._id}._rev`,
        `${table._id}.type`,
        `${table._id}.createdAt`,
        `${table._id}.updatedAt`,
        `${table._id}.tableId`,
      ])
    })

    it("extracts fields from table schema", async () => {
      const table = new TableConfig().create()
      const result = await buildInternalFieldList(table, [])
      expect(result).toEqual([
        `${table._id}.data_name`,
        `${table._id}.data_description`,
        `${table._id}.data_amount`,
        `${table._id}._id`,
        `${table._id}._rev`,
        `${table._id}.type`,
        `${table._id}.createdAt`,
        `${table._id}.updatedAt`,
        `${table._id}.tableId`,
      ])
    })

    it("excludes hidden fields", async () => {
      const table = new TableConfig().withHiddenField("description").create()
      const result = await buildInternalFieldList(table, [])
      expect(result).toEqual([
        `${table._id}.data_name`,
        `${table._id}.data_amount`,
        `${table._id}._id`,
        `${table._id}._rev`,
        `${table._id}.type`,
        `${table._id}.createdAt`,
        `${table._id}.updatedAt`,
        `${table._id}.tableId`,
      ])
    })

    it("includes hidden fields if there is a formula column", async () => {
      const table = new TableConfig()
        .withHiddenField("description")
        .withField("formula", FieldType.FORMULA)
        .create()

      const result = await buildInternalFieldList(table, [])
      expect(result).toEqual([
        `${table._id}.data_name`,
        `${table._id}.data_description`,
        `${table._id}.data_amount`,
        `${table._id}.data_formula`,
        `${table._id}._id`,
        `${table._id}._rev`,
        `${table._id}.type`,
        `${table._id}.createdAt`,
        `${table._id}.updatedAt`,
        `${table._id}.tableId`,
      ])
    })

    it("includes relationships fields when flagged", async () => {
      const otherTable = new TableConfig()
        .withHiddenField("description")
        .create()

      const table = new TableConfig()
        .withHiddenField("amount")
        .withRelation("link", otherTable._id)
        .create()

      const relationships = [{ tableName: otherTable.name, column: "link" }]

      const result = await buildInternalFieldList(table, allTables, {
        relationships,
      })
      expect(result).toEqual([
        `${table._id}.data_name`,
        `${table._id}.data_description`,
        `${otherTable._id}.data_name`,
        `${otherTable._id}.data_amount`,
        `${otherTable._id}._id`,
        `${otherTable._id}._rev`,
        `${otherTable._id}.type`,
        `${otherTable._id}.createdAt`,
        `${otherTable._id}.updatedAt`,
        `${otherTable._id}.tableId`,
        `${generateJunctionTableID(table._id, otherTable._id)}.doc1.fieldName`,
        `${generateJunctionTableID(table._id, otherTable._id)}.doc2.fieldName`,
        `${table._id}._id`,
        `${table._id}._rev`,
        `${table._id}.type`,
        `${table._id}.createdAt`,
        `${table._id}.updatedAt`,
        `${table._id}.tableId`,
      ])
    })

    it("includes all relationship fields if there is a formula column", async () => {
      const otherTable = new TableConfig()
        .withField("hidden", FieldType.STRING, { visible: false })
        .create()

      const table = new TableConfig()
        .withRelation("link", otherTable._id)
        .withHiddenField("description")
        .withField("formula", FieldType.FORMULA)
        .create()

      const relationships = [{ tableName: otherTable.name, column: "link" }]
      const result = await buildInternalFieldList(table, allTables, {
        relationships,
      })
      expect(result).toEqual([
        `${table._id}.data_name`,
        `${table._id}.data_description`,
        `${table._id}.data_amount`,
        `${otherTable._id}.data_name`,
        `${otherTable._id}.data_description`,
        `${otherTable._id}.data_amount`,
        `${otherTable._id}.data_hidden`,
        `${otherTable._id}._id`,
        `${otherTable._id}._rev`,
        `${otherTable._id}.type`,
        `${otherTable._id}.createdAt`,
        `${otherTable._id}.updatedAt`,
        `${otherTable._id}.tableId`,
        `${generateJunctionTableID(table._id, otherTable._id)}.doc1.fieldName`,
        `${generateJunctionTableID(table._id, otherTable._id)}.doc2.fieldName`,
        `${table._id}.data_formula`,
        `${table._id}._id`,
        `${table._id}._rev`,
        `${table._id}.type`,
        `${table._id}.createdAt`,
        `${table._id}.updatedAt`,
        `${table._id}.tableId`,
      ])
    })
  })

  describe("view", () => {
    it("includes internal columns by default", async () => {
      const view = new ViewConfig(new TableConfig().create()).create()
      const result = await buildInternalFieldList(view, [])
      expect(result).toEqual([
        `${view.tableId}._id`,
        `${view.tableId}._rev`,
        `${view.tableId}.type`,
        `${view.tableId}.createdAt`,
        `${view.tableId}.updatedAt`,
        `${view.tableId}.tableId`,
      ])
    })

    it("extracts fields from table schema", async () => {
      const view = new ViewConfig(new TableConfig().create())
        .withVisible("amount")
        .withHidden("name")
        .create()

      const result = await buildInternalFieldList(view, [])
      expect(result).toEqual([
        `${view.tableId}.data_amount`,
        `${view.tableId}._id`,
        `${view.tableId}._rev`,
        `${view.tableId}.type`,
        `${view.tableId}.createdAt`,
        `${view.tableId}.updatedAt`,
        `${view.tableId}.tableId`,
      ])
    })

    it("includes all fields if there is a formula column", async () => {
      const table = new TableConfig()
        .withField("formula", FieldType.FORMULA)
        .create()
      const view = new ViewConfig(table)
        .withHidden("name")
        .withVisible("amount")
        .withVisible("formula")
        .create()

      const result = await buildInternalFieldList(view, [])
      expect(result).toEqual([
        `${view.tableId}.data_name`,
        `${view.tableId}.data_description`,
        `${view.tableId}.data_amount`,
        `${view.tableId}.data_formula`,
        `${view.tableId}._id`,
        `${view.tableId}._rev`,
        `${view.tableId}.type`,
        `${view.tableId}.createdAt`,
        `${view.tableId}.updatedAt`,
        `${view.tableId}.tableId`,
      ])
    })

    it("does not includes all fields if the formula column is not included", async () => {
      const table = new TableConfig()
        .withField("formula", FieldType.FORMULA)
        .create()
      const view = new ViewConfig(table)
        .withHidden("name")
        .withVisible("amount")
        .withHidden("formula")
        .create()

      const result = await buildInternalFieldList(view, [])
      expect(result).toEqual([
        `${view.tableId}.data_amount`,
        `${view.tableId}._id`,
        `${view.tableId}._rev`,
        `${view.tableId}.type`,
        `${view.tableId}.createdAt`,
        `${view.tableId}.updatedAt`,
        `${view.tableId}.tableId`,
      ])
    })

    it("includes relationships fields", async () => {
      const otherTable = new TableConfig().create()

      const table = new TableConfig()
        .withRelation("link", otherTable._id)
        .withField("formula", FieldType.FORMULA)
        .create()

      const view = new ViewConfig(table)
        .withVisible("name")
        .withVisible("link")
        .withHidden("amount")
        .create()

      const relationships = [{ tableName: otherTable.name, column: "link" }]
      const result = await buildInternalFieldList(view, allTables, {
        relationships,
      })
      expect(result).toEqual([
        `${table._id}.data_name`,
        `${otherTable._id}.data_name`,
        `${otherTable._id}.data_description`,
        `${otherTable._id}.data_amount`,
        `${otherTable._id}._id`,
        `${otherTable._id}._rev`,
        `${otherTable._id}.type`,
        `${otherTable._id}.createdAt`,
        `${otherTable._id}.updatedAt`,
        `${otherTable._id}.tableId`,
        `${generateJunctionTableID(table._id, otherTable._id)}.doc1.fieldName`,
        `${generateJunctionTableID(table._id, otherTable._id)}.doc2.fieldName`,
        `${table._id}._id`,
        `${table._id}._rev`,
        `${table._id}.type`,
        `${table._id}.createdAt`,
        `${table._id}.updatedAt`,
        `${table._id}.tableId`,
      ])
    })

    it("includes relationships columns", async () => {
      const otherTable = new TableConfig()
        .withField("formula", FieldType.FORMULA)
        .create()

      const table = new TableConfig()
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

      const relationships = [{ tableName: otherTable.name, column: "link" }]
      const result = await buildInternalFieldList(view, allTables, {
        relationships,
      })
      expect(result).toEqual([
        `${table._id}.data_name`,
        `${otherTable._id}.data_name`,
        `${otherTable._id}.data_description`,
        `${otherTable._id}.data_amount`,
        `${otherTable._id}.data_formula`,
        `${otherTable._id}._id`,
        `${otherTable._id}._rev`,
        `${otherTable._id}.type`,
        `${otherTable._id}.createdAt`,
        `${otherTable._id}.updatedAt`,
        `${otherTable._id}.tableId`,
        `${generateJunctionTableID(table._id, otherTable._id)}.doc1.fieldName`,
        `${generateJunctionTableID(table._id, otherTable._id)}.doc2.fieldName`,
        `${table._id}._id`,
        `${table._id}._rev`,
        `${table._id}.type`,
        `${table._id}.createdAt`,
        `${table._id}.updatedAt`,
        `${table._id}.tableId`,
      ])
    })

    it("does not include relationships columns for hidden links", async () => {
      const otherTable = new TableConfig()
        .withField("formula", FieldType.FORMULA)
        .create()

      const table = new TableConfig()
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

      const relationships = [{ tableName: otherTable.name, column: "link" }]
      const result = await buildInternalFieldList(view, allTables, {
        relationships,
      })
      expect(result).toEqual([
        `${table._id}.data_name`,
        `${table._id}._id`,
        `${table._id}._rev`,
        `${table._id}.type`,
        `${table._id}.createdAt`,
        `${table._id}.updatedAt`,
        `${table._id}.tableId`,
      ])
    })

    it("includes all relationship fields if there is a formula column", async () => {
      const otherTable = new TableConfig()
        .withField("hidden", FieldType.STRING, { visible: false })
        .withField("formula", FieldType.FORMULA)
        .withField("ai", FieldType.AI)
        .withRelation("link", "otherTableId")
        .create()

      const table = new TableConfig()
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

      const relationships = [{ tableName: otherTable.name, column: "link" }]
      const result = await buildInternalFieldList(view, allTables, {
        relationships,
      })
      expect(result).toEqual([
        `${table._id}.data_name`,
        `${table._id}.data_description`,
        `${table._id}.data_amount`,
        `${otherTable._id}.data_name`,
        `${otherTable._id}.data_description`,
        `${otherTable._id}.data_amount`,
        `${otherTable._id}.data_hidden`,
        `${otherTable._id}.data_formula`,
        `${otherTable._id}.data_ai`,
        `${otherTable._id}._id`,
        `${otherTable._id}._rev`,
        `${otherTable._id}.type`,
        `${otherTable._id}.createdAt`,
        `${otherTable._id}.updatedAt`,
        `${otherTable._id}.tableId`,
        `${generateJunctionTableID(table._id, otherTable._id)}.doc1.fieldName`,
        `${generateJunctionTableID(table._id, otherTable._id)}.doc2.fieldName`,
        `${table._id}.data_formula`,
        `${table._id}._id`,
        `${table._id}._rev`,
        `${table._id}.type`,
        `${table._id}.createdAt`,
        `${table._id}.updatedAt`,
        `${table._id}.tableId`,
      ])
    })
  })

  describe("calculation view", () => {
    it("does not include calculation fields", async () => {
      const view = new ViewConfig(new TableConfig().create())
        .withCalculation("average", "amount", CalculationType.AVG)
        .create()

      const result = await buildInternalFieldList(view, [])
      expect(result).toEqual([])
    })

    it("includes visible fields calculation fields", async () => {
      const view = new ViewConfig(new TableConfig().create())
        .withCalculation("average", "amount", CalculationType.AVG)
        .withHidden("name")
        .withVisible("amount")
        .create()

      const result = await buildInternalFieldList(view, [])
      expect(result).toEqual([`${view.tableId}.data_amount`])
    })
  })
})
