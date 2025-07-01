import { Table, WithoutDocMetadata } from "@budibase/types"
import { create } from "./create"

/**
 * Duplicates an internal table without its data
 * @param table - The table to duplicate
 * @param userId - The user performing the duplication
 * @returns The new duplicated table
 */
export async function duplicate(table: Table, userId?: string): Promise<Table> {
  // Generate a unique name for the duplicated table
  const duplicatedName = `${table.name} - Copy`

  // Create a new table object without the original _id and _rev
  const tableToCreate: WithoutDocMetadata<Table> = {
    name: duplicatedName,
    type: table.type,
    sourceType: table.sourceType,
    sourceId: table.sourceId,
    schema: { ...table.schema },
    views: table.views ? { ...table.views } : {},
    indexes: table.indexes ? { ...table.indexes } : undefined,
    // Don't include any data/rows - this is intentionally empty
  }

  // Create the new table using the existing create function
  // This ensures all the proper table creation logic is followed
  const duplicatedTable = await create(tableToCreate, undefined, userId)

  return duplicatedTable
}
