import * as setup from "../../../api/routes/tests/utilities"
import { basicTable } from "../../../tests/utilities/structures"
import { db as dbCore, SQLITE_DESIGN_DOC_ID } from "@budibase/backend-core"
import {
  LinkDocument,
  DocumentType,
  SQLiteDefinition,
  SQLiteType,
} from "@budibase/types"
import {
  generateJunctionTableID,
  generateLinkID,
  generateRowID,
} from "../../../db/utils"
import { processMigrations } from "../../migrationsProcessor"
import migration from "../20240604153647_initial_sqs"
import { AppMigration } from "src/appMigrations"
import sdk from "../../../sdk"

const MIGRATIONS: AppMigration[] = [
  {
    id: "20240604153647_initial_sqs",
    func: migration,
    disabled: false,
  },
]

const config = setup.getConfig()
let tableId: string

const prefix = sdk.tables.sqs.mapToUserColumn

function oldLinkDocInfo() {
  const tableId1 = `${DocumentType.TABLE}_a`,
    tableId2 = `${DocumentType.TABLE}_b`
  return {
    tableId1,
    tableId2,
    rowId1: generateRowID(tableId1, "b"),
    rowId2: generateRowID(tableId2, "a"),
    col1: "columnB",
    col2: "columnA",
  }
}

function oldLinkDocID() {
  const { tableId1, tableId2, rowId1, rowId2, col1, col2 } = oldLinkDocInfo()
  return generateLinkID(tableId1, tableId2, rowId1, rowId2, col1, col2)
}

function oldLinkDocument(): Omit<LinkDocument, "tableId"> {
  const { tableId1, tableId2, rowId1, rowId2, col1, col2 } = oldLinkDocInfo()
  return {
    type: "link",
    _id: oldLinkDocID(),
    doc1: {
      tableId: tableId1,
      fieldName: col1,
      rowId: rowId1,
    },
    doc2: {
      tableId: tableId2,
      fieldName: col2,
      rowId: rowId2,
    },
  }
}

async function sqsDisabled(cb: () => Promise<void>) {
  await config.withEnv({ SQS_SEARCH_ENABLE: "" }, cb)
}

async function sqsEnabled(cb: () => Promise<void>) {
  await config.withEnv({ SQS_SEARCH_ENABLE: "1" }, cb)
}

beforeAll(async () => {
  await sqsDisabled(async () => {
    await config.init()
    const table = await config.api.table.save(basicTable())
    tableId = table._id!
    const db = dbCore.getDB(config.appId!)
    // old link document
    await db.put(oldLinkDocument())
  })
})

describe("SQS migration", () => {
  it("test migration runs as expected against an older DB", async () => {
    const db = dbCore.getDB(config.appId!)
    // confirm nothing exists initially
    await sqsDisabled(async () => {
      let error: any | undefined
      try {
        await db.get(SQLITE_DESIGN_DOC_ID)
      } catch (err: any) {
        error = err
      }
      expect(error).toBeDefined()
      expect(error.status).toBe(404)
    })
    await sqsEnabled(async () => {
      await processMigrations(config.appId!, MIGRATIONS)
      const designDoc = await db.get<SQLiteDefinition>(SQLITE_DESIGN_DOC_ID)
      expect(designDoc.sql.tables).toBeDefined()
      const mainTableDef = designDoc.sql.tables[tableId]
      expect(mainTableDef).toBeDefined()
      expect(mainTableDef.fields[prefix("name")]).toEqual({
        field: "name",
        type: SQLiteType.TEXT,
      })
      expect(mainTableDef.fields[prefix("description")]).toEqual({
        field: "description",
        type: SQLiteType.TEXT,
      })

      const { tableId1, tableId2, rowId1, rowId2 } = oldLinkDocInfo()
      const linkDoc = await db.get<LinkDocument>(oldLinkDocID())
      expect(linkDoc.tableId).toEqual(
        generateJunctionTableID(tableId1, tableId2)
      )
      // should have swapped the documents
      expect(linkDoc.doc1.tableId).toEqual(tableId2)
      expect(linkDoc.doc1.rowId).toEqual(rowId2)
      expect(linkDoc.doc2.tableId).toEqual(tableId1)
      expect(linkDoc.doc2.rowId).toEqual(rowId1)
    })
  })
})
