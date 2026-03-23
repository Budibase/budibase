import { TableSchema, FieldType, RelationshipType } from "@budibase/types"
import { AIColumnSchemas, GenerationStructure } from "../tables"
import { TableSchemaFromAI } from "../../types"
import { docIds } from "@budibase/backend-core"

export function aiTableResponseToTableSchema(
  structure: GenerationStructure
): TableSchemaFromAI[] {
  const result: TableSchemaFromAI[] = []
  const tableNameMap = structure.tables.reduce<Record<string, string>>(
    (acc, table) => {
      acc[table.name.toLowerCase()] = table.name
      return acc
    },
    {}
  )

  const processedRelationships: string[] = []
  for (const table of structure.tables) {
    const schema = table.schema.reduce<TableSchema>((acc, field) => {
      if (field.type === FieldType.LINK) {
        const normalizedTableName = tableNameMap[field.tableId?.toLowerCase()]
        // Ignore links to tables that were not generated in this response.
        // This prevents references to internal/system tables like users_table.
        if (!normalizedTableName) {
          return acc
        }

        // Avoid circular references
        if (!processedRelationships.includes(field.relationshipId)) {
          // Reversing relationship type, as the name is confusing for the AI gets it in the wrong order
          const map = {
            [RelationshipType.MANY_TO_ONE]: RelationshipType.ONE_TO_MANY,
            [RelationshipType.ONE_TO_MANY]: RelationshipType.MANY_TO_ONE,
            [RelationshipType.MANY_TO_MANY]: RelationshipType.MANY_TO_MANY,
          }
          const { reverseFieldName, relationshipId, ...rest } = field
          acc[field.name] = {
            ...rest,
            tableId: normalizedTableName,
            fieldName: reverseFieldName,
            relationshipType: map[field.relationshipType] as any,
          }
          processedRelationships.push(relationshipId)
        }
      } else {
        acc[field.name] = field as any
      }

      return acc
    }, {})
    result.push({
      _id: docIds.generateTableID(),
      name: table.name,
      primaryDisplay: table.primaryDisplay,
      schema,
    })
  }

  return result
}

export function appendAIColumns(
  tables: TableSchemaFromAI[],
  aiColumns: AIColumnSchemas
): TableSchemaFromAI[] {
  const result: TableSchemaFromAI[] = []

  for (const table of tables) {
    result.push({
      ...table,
      schema: {
        ...table.schema,
        ...aiColumns[table.name]?.reduce<TableSchema>((acc, field) => {
          acc[field.name] = field
          return acc
        }, {}),
      },
    })
  }

  return result
}
