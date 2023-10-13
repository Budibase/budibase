import {
  AutoReason,
  Datasource,
  FieldType,
  RelationshipType,
} from "@budibase/types"

function checkForeignKeysAreAutoColumns(datasource: Datasource) {
  if (!datasource.entities) {
    return datasource
  }
  const tables = Object.values(datasource.entities)
  // make sure all foreign key columns are marked as auto columns
  const foreignKeys: { tableId: string; key: string }[] = []
  for (let table of tables) {
    Object.values(table.schema).forEach(column => {
      if (column.type !== FieldType.LINK) {
        return
      }
      const relationship = column
      if (relationship.relationshipType === RelationshipType.MANY_TO_MANY) {
        const tableId = relationship.through!
        foreignKeys.push({ key: relationship.throughTo!, tableId })
        foreignKeys.push({ key: relationship.throughFrom!, tableId })
      } else {
        const fk = relationship.foreignKey!
        const oneSide =
          relationship.relationshipType === RelationshipType.ONE_TO_MANY
        foreignKeys.push({
          tableId: oneSide ? table._id! : relationship.tableId!,
          key: fk,
        })
      }
    })
  }

  // now make sure schemas are all accurate
  for (const table of tables) {
    for (let column of Object.values(table.schema)) {
      const shouldBeForeign = foreignKeys.find(
        options => options.tableId === table._id && options.key === column.name
      )
      // don't change already auto-columns to it, e.g. primary keys that are foreign
      if (shouldBeForeign && !column.autocolumn) {
        column.autocolumn = true
        column.autoReason = AutoReason.FOREIGN_KEY
      } else if (column.autoReason === AutoReason.FOREIGN_KEY) {
        delete column.autocolumn
        delete column.autoReason
      }
    }
  }

  return datasource
}

export function populateExternalTableSchemas(datasource: Datasource) {
  return checkForeignKeysAreAutoColumns(datasource)
}
