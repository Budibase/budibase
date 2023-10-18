import { BadRequestError, context } from "@budibase/backend-core"
import {
  BBReferenceFieldMetadata,
  FieldSchema,
  InternalTable,
  RelationshipFieldMetadata,
  Row,
  Table,
  isBBReferenceField,
  isRelationshipField,
} from "@budibase/types"
import sdk from "../../../sdk"
import { isExternalTable } from "../../../../src/integrations/utils"
import { db as dbCore } from "@budibase/backend-core"
import { EventType, updateLinks } from "../../../../src/db/linkedRows"
import { cloneDeep } from "lodash"

export async function migrate(
  table: Table,
  oldColumn: FieldSchema,
  newColumn: FieldSchema
) {
  let migrator = getColumnMigrator(table, oldColumn, newColumn)
  let oldTable = cloneDeep(table)

  table = await sdk.tables.addColumn(table, newColumn)

  await migrator.doMigration()

  delete table.schema[oldColumn.name]
  await sdk.tables.saveTable(table)
  await updateLinks({ eventType: EventType.TABLE_UPDATED, table, oldTable })
}

interface ColumnMigrator {
  doMigration(): Promise<void>
}

function getColumnMigrator(
  table: Table,
  oldColumn: FieldSchema,
  newColumn: FieldSchema
): ColumnMigrator {
  // For now we're only supporting migrations of user relationships to user
  // columns in internal tables. In future we may want to support other
  // migrations but for now return an error if we aren't migrating a user
  // relationship.
  if (isExternalTable(table._id!)) {
    throw new BadRequestError("External tables cannot be migrated")
  }

  if (!(oldColumn.name in table.schema)) {
    throw new BadRequestError(`Column "${oldColumn.name}" does not exist`)
  }

  if (newColumn.name in table.schema) {
    throw new BadRequestError(`Column "${newColumn.name}" already exists`)
  }

  if (!isBBReferenceField(newColumn)) {
    throw new BadRequestError(`Column "${newColumn.name}" is not a user column`)
  }

  if (newColumn.subtype !== "user" && newColumn.subtype !== "users") {
    throw new BadRequestError(`Column "${newColumn.name}" is not a user column`)
  }

  if (!isRelationshipField(oldColumn)) {
    throw new BadRequestError(
      `Column "${oldColumn.name}" is not a user relationship`
    )
  }

  if (oldColumn.tableId !== InternalTable.USER_METADATA) {
    throw new BadRequestError(
      `Column "${oldColumn.name}" is not a user relationship`
    )
  }

  return new UserColumnMigrator(table, oldColumn, newColumn)
}

class UserColumnMigrator implements ColumnMigrator {
  constructor(
    private table: Table,
    private oldColumn: RelationshipFieldMetadata,
    private newColumn: BBReferenceFieldMetadata
  ) {}

  async doMigration() {
    let rows = await sdk.rows.fetch(this.table._id!)
    let rowsById = rows.reduce((acc, row) => {
      acc[row._id!] = row
      return acc
    }, {} as Record<string, Row>)

    let links = await sdk.links.fetchWithDocument(this.table._id!)
    for (let link of links) {
      if (link.doc1.tableId !== this.table._id) {
        continue
      }
      if (link.doc1.fieldName !== this.oldColumn.name) {
        continue
      }
      if (link.doc2.tableId !== InternalTable.USER_METADATA) {
        continue
      }

      let userId = dbCore.getGlobalIDFromUserMetadataID(link.doc2.rowId)
      let row = rowsById[link.doc1.rowId]
      row[this.newColumn.name] = userId
    }

    let db = context.getAppDB()
    await db.bulkDocs(rows)
  }
}
