import {
  AutoReason,
  Datasource,
  FieldSchema,
  FieldType,
  RelationshipType,
} from "@budibase/types"
import { FieldTypes } from "../../../constants"

function checkForeignKeysAreAutoColumns(datasource: Datasource) {
  if (!datasource.entities) {
    return datasource
  }
  const tables = Object.values(datasource.entities)
  // make sure all foreign key columns are marked as auto columns
  const foreignKeys: { tableId: string; key: string }[] = []
  for (let table of tables) {
    const relationships = Object.values(table.schema).filter(
      column => column.type === FieldType.LINK
    )
    relationships.forEach(relationship => {
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
  for (let table of tables) {
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

export function isEditableColumn(column: FieldSchema) {
  const isAutoColumn =
    column.autocolumn && column.autoReason !== AutoReason.FOREIGN_KEY
  const isFormula = column.type === FieldTypes.FORMULA
  return !(isAutoColumn || isFormula)
}

export function populateExternalTableSchemas(datasource: Datasource) {
  return checkForeignKeysAreAutoColumns(datasource)
}
