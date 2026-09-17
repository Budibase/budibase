const mockBuildInternalRelationships = jest.fn()
const mockDoWithLock = jest.fn()
const mockGetWorkspaceDB = jest.fn()
const mockGetWorkspaceId = jest.fn(() => "workspace_1")
const mockOutputProcessing = jest.fn()
const mockSqlOutputProcessing = jest.fn()
const mockSyncDefinition = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: () => mockGetWorkspaceDB(),
      getWorkspaceId: () => mockGetWorkspaceId(),
      getOrThrowWorkspaceId: () => mockGetWorkspaceId(),
    },
    locks: {
      ...actual.locks,
      doWithLock: (...args: unknown[]) => mockDoWithLock(...args),
    },
  }
})

jest.mock("../../../../../../api/controllers/row/utils", () => {
  const actual = jest.requireActual(
    "../../../../../../api/controllers/row/utils"
  )
  return {
    ...actual,
    buildInternalRelationships: (...args: unknown[]) =>
      mockBuildInternalRelationships(...args),
    sqlOutputProcessing: (...args: unknown[]) =>
      mockSqlOutputProcessing(...args),
  }
})

jest.mock("../../../../tables/internal/sqs", () => ({
  ...jest.requireActual("../../../../tables/internal/sqs"),
  syncDefinition: (...args: unknown[]) => mockSyncDefinition(...args),
}))

jest.mock("../../../../../../utilities/rowProcessor", () => {
  const actual = jest.requireActual("../../../../../../utilities/rowProcessor")
  return {
    ...actual,
    outputProcessing: (...args: unknown[]) => mockOutputProcessing(...args),
  }
})

import { sql } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import {
  AIOperationEnum,
  CalculationType,
  FieldType,
  LockName,
  LockType,
  RelationshipType,
  SourceName,
  Table,
  ViewV2,
  ViewV2Type,
} from "@budibase/types"
import { structures } from "../../../../../../api/routes/tests/utilities"
import {
  generateJunctionTableID,
  generateViewID,
} from "../../../../../../db/utils"
import { buildInternalFieldList, search } from "../sqs"

import { utils } from "@budibase/shared-core"
import { cloneDeep } from "lodash"
import sdk from "../../../../.."

jest.mock("../../../../../../sdk/workspace/views", () => ({
  ...jest.requireActual("../../../../../../sdk/workspace/views"),
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
      const name = generator.guid()
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

    it("skips view fields that no longer exist on the table", async () => {
      const baseTable = new TableConfig().create()
      const view = new ViewConfig(baseTable).withVisible("missing").create()

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
  })
})

describe("search", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("runs SQL queries after checking for definition rebuilds", async () => {
    const table: Table = {
      ...structures.tableForDatasource({
        type: "datasource",
        source: SourceName.POSTGRES,
      }),
      name: "contacts",
      _id: "ta_contacts",
      primary: ["_id"],
      schema: {
        name: {
          name: "name",
          type: FieldType.STRING,
        },
      },
    }

    jest
      .spyOn(sdk.tables, "getAllInternalTables")
      .mockImplementation(async () => [cloneDeep(table)])

    mockBuildInternalRelationships.mockReturnValue([])
    mockSqlOutputProcessing.mockImplementation(async rows => rows)
    mockOutputProcessing.mockImplementation(async (_source, rows) => rows)

    let insideLock = false
    const sqlCallsInsideLock: boolean[] = []
    const sqlQueries: string[] = []
    const sqlMock = jest.fn(async (query: string) => {
      sqlCallsInsideLock.push(insideLock)
      sqlQueries.push(query)
      if (query.toLowerCase().includes("count(")) {
        return [{ [sql.COUNT_FIELD_NAME]: 1 }]
      }
      return [
        {
          _id: "row_1",
          data_name: "Alice",
        },
      ]
    })
    mockGetWorkspaceDB.mockReturnValue({ sql: sqlMock })

    mockDoWithLock.mockImplementation(
      async (
        opts: unknown,
        fn: () => Promise<unknown>
      ): Promise<{ executed: true; result: unknown }> => {
        expect(opts).toEqual(
          expect.objectContaining({
            type: LockType.AUTO_EXTEND,
            name: LockName.SQS_SYNC_DEFINITIONS,
            resource: "workspace_1",
          })
        )
        insideLock = true
        try {
          const result = await fn()
          return { executed: true, result }
        } finally {
          insideLock = false
        }
      }
    )

    const response = await search(
      {
        tableId: table._id!,
        query: {},
        countRows: true,
      },
      table
    )

    expect(response.rows).toEqual([
      {
        _id: "row_1",
        name: "Alice",
      },
    ])
    expect(response.totalRows).toBe(1)
    expect(sqlCallsInsideLock).toEqual([false, false])
    expect(
      sqlQueries.filter(query => query.toLowerCase().includes("count("))
    ).toHaveLength(1)
  })

  it("resyncs stale definitions while holding the rebuild lock", async () => {
    const table: Table = {
      ...structures.tableForDatasource({
        type: "datasource",
        source: SourceName.POSTGRES,
      }),
      name: "contacts",
      _id: "ta_contacts",
      primary: ["_id"],
      schema: {
        name: {
          name: "name",
          type: FieldType.STRING,
        },
      },
    }

    jest
      .spyOn(sdk.tables, "getAllInternalTables")
      .mockImplementation(async () => [cloneDeep(table)])

    mockBuildInternalRelationships.mockReturnValue([])
    mockSqlOutputProcessing.mockImplementation(async rows => rows)
    mockOutputProcessing.mockImplementation(async (_source, rows) => rows)

    const staleDefinitionError = Object.assign(
      new Error("no such table: ta_contacts"),
      { status: 400 }
    )
    const sqlMock = jest
      .fn()
      .mockRejectedValueOnce(staleDefinitionError)
      .mockResolvedValueOnce([
        {
          _id: "row_1",
          data_name: "Alice",
        },
      ])
    mockGetWorkspaceDB.mockReturnValue({ sql: sqlMock })

    let insideLock = false
    const syncCallsInsideLock: boolean[] = []
    mockSyncDefinition.mockImplementation(async () => {
      syncCallsInsideLock.push(insideLock)
    })
    mockDoWithLock.mockImplementation(
      async (
        opts: unknown,
        fn: () => Promise<unknown>
      ): Promise<{ executed: true; result: unknown }> => {
        expect(opts).toEqual(
          expect.objectContaining({
            type: LockType.AUTO_EXTEND,
            name: LockName.SQS_SYNC_DEFINITIONS,
            resource: "workspace_1",
          })
        )
        insideLock = true
        try {
          return { executed: true, result: await fn() }
        } finally {
          insideLock = false
        }
      }
    )

    const response = await search(
      {
        tableId: table._id!,
        query: {},
      },
      table
    )

    expect(response.rows).toEqual([
      {
        _id: "row_1",
        name: "Alice",
      },
    ])
    expect(syncCallsInsideLock).toEqual([true])
  })
})
