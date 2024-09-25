import {
  Datasource,
  FieldType,
  ManyToManyRelationshipFieldMetadata,
  ManyToOneRelationshipFieldMetadata,
  OneToManyRelationshipFieldMetadata,
  RelationshipFieldMetadata,
  RelationshipType,
  Table,
  TableSourceType,
} from "@budibase/types"
import {
  foreignKeyStructure,
  generateForeignKey,
  generateJunctionTableName,
} from "../../../../api/controllers/table/utils"
import { buildExternalTableId } from "../../../../integrations/utils"
import { cloneDeep } from "lodash/fp"

export function cleanupRelationships(
  table: Table,
  tables: Record<string, Table>,
  opts: { oldTable: Table }
): void
export function cleanupRelationships(
  table: Table,
  tables: Record<string, Table>,
  opts: { deleting: boolean }
): void
export function cleanupRelationships(
  table: Table,
  tables: Record<string, Table>,
  opts?: { oldTable?: Table; deleting?: boolean }
): void {
  const oldTable = opts?.oldTable
  const tableToIterate = oldTable ? oldTable : table
  // clean up relationships in couch table schemas
  for (let [key, schema] of Object.entries(tableToIterate.schema)) {
    if (
      schema.type === FieldType.LINK &&
      (opts?.deleting || oldTable?.schema[key] != null) &&
      table.schema[key] == null
    ) {
      const schemaTableId = schema.tableId
      const relatedTable = Object.values(tables).find(
        table => table._id === schemaTableId
      )
      const foreignKey =
        schema.relationshipType !== RelationshipType.MANY_TO_MANY &&
        schema.foreignKey
      if (!relatedTable || !foreignKey) {
        continue
      }
      for (let [relatedKey, relatedSchema] of Object.entries(
        relatedTable.schema
      )) {
        if (relatedSchema.type !== FieldType.LINK) {
          continue
        }
        // if they both have the same field name it will appear as if it needs to be removed,
        // don't cleanup in this scenario
        const sameFieldNameForBoth = relatedSchema.name === schema.name
        if (relatedSchema.fieldName === foreignKey && !sameFieldNameForBoth) {
          delete relatedTable.schema[relatedKey]
        }
      }
    }
  }
}

export function otherRelationshipType(type: RelationshipType) {
  if (type === RelationshipType.MANY_TO_MANY) {
    return RelationshipType.MANY_TO_MANY
  }
  return type === RelationshipType.ONE_TO_MANY
    ? RelationshipType.MANY_TO_ONE
    : RelationshipType.ONE_TO_MANY
}

export function generateManyLinkSchema(
  datasource: Datasource,
  column: ManyToManyRelationshipFieldMetadata,
  table: Table,
  relatedTable: Table
): Table {
  if (!table.primary || !relatedTable.primary) {
    const noPrimaryName = !table.primary ? table.name : relatedTable.name
    throw new Error(
      `Unable to generate many link schema, "${noPrimaryName}" does not have a primary key`
    )
  }
  const primary = table.name + table.primary[0]
  const relatedPrimary = relatedTable.name + relatedTable.primary[0]
  const jcTblName = generateJunctionTableName(column, table, relatedTable)
  const datasourceId = datasource._id!
  // first create the new table
  const junctionTable: Table = {
    type: "table",
    _id: buildExternalTableId(datasourceId, jcTblName),
    name: jcTblName,
    primary: [primary, relatedPrimary],
    constrained: [primary, relatedPrimary],
    sourceId: datasourceId,
    sourceType: TableSourceType.EXTERNAL,
    schema: {
      [primary]: foreignKeyStructure(primary, {
        toTable: table.name,
        toKey: table.primary[0],
      }),
      [relatedPrimary]: foreignKeyStructure(relatedPrimary, {
        toTable: relatedTable.name,
        toKey: relatedTable.primary[0],
      }),
    },
  }
  column.through = junctionTable._id
  column.throughFrom = relatedPrimary
  column.throughTo = primary
  column.fieldName = relatedPrimary
  return junctionTable
}

export function generateLinkSchema(
  column:
    | OneToManyRelationshipFieldMetadata
    | ManyToOneRelationshipFieldMetadata,
  table: Table,
  relatedTable: Table,
  type: RelationshipType.ONE_TO_MANY | RelationshipType.MANY_TO_ONE
) {
  if (!table.primary || !relatedTable.primary) {
    throw new Error("Unable to generate link schema, no primary keys")
  }
  const isOneSide = type === RelationshipType.ONE_TO_MANY
  const primary = isOneSide ? relatedTable.primary[0] : table.primary[0]
  // generate a foreign key
  const foreignKey = generateForeignKey(column, relatedTable)
  column.relationshipType = type
  column.foreignKey = isOneSide ? foreignKey : primary
  column.fieldName = isOneSide ? primary : foreignKey
  return foreignKey
}

export function generateRelatedSchema(
  linkColumn: RelationshipFieldMetadata,
  table: Table,
  relatedTable: Table,
  columnName: string
) {
  // generate column for other table
  let relatedSchema: RelationshipFieldMetadata
  const isMany2Many =
    linkColumn.relationshipType === RelationshipType.MANY_TO_MANY
  // swap them from the main link
  if (!isMany2Many && linkColumn.foreignKey) {
    relatedSchema = cloneDeep(linkColumn) as
      | OneToManyRelationshipFieldMetadata
      | ManyToOneRelationshipFieldMetadata
    relatedSchema.fieldName = linkColumn.foreignKey
    relatedSchema.foreignKey = linkColumn.fieldName
  }
  // is many to many
  else {
    const manyToManyCol = linkColumn as ManyToManyRelationshipFieldMetadata
    relatedSchema = cloneDeep(linkColumn) as ManyToManyRelationshipFieldMetadata
    // don't need to copy through, already got it
    relatedSchema.fieldName = manyToManyCol.throughTo!
    relatedSchema.throughTo = manyToManyCol.throughFrom
    relatedSchema.throughFrom = manyToManyCol.throughTo
  }
  relatedSchema.relationshipType = otherRelationshipType(
    linkColumn.relationshipType
  )
  relatedSchema.tableId = relatedTable._id!
  relatedSchema.name = columnName
  table.schema[columnName] = relatedSchema
}

export function isRelationshipSetup(column: RelationshipFieldMetadata) {
  return (column as any).foreignKey || (column as any).through
}
