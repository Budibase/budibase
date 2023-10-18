import { BadRequestError } from "@budibase/backend-core"
import {
  BBReferenceFieldMetadata,
  FieldSchema,
  InternalTable,
  RelationshipFieldMetadata,
  Table,
  isBBReferenceField,
  isRelationshipField,
} from "@budibase/types"
import sdk from "../../../sdk"
import { isExternalTable } from "../../../../src/integrations/utils"

export async function migrate(
  table: Table,
  oldColumn: FieldSchema,
  newColumn: FieldSchema
) {
  let migrator = getColumnMigrator(table, oldColumn, newColumn)

  await sdk.tables.addColumn(table, newColumn)

  migrator.doMigration()
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
    let links = await sdk.links.fetchWithDocument(this.table._id!)
  }
}
