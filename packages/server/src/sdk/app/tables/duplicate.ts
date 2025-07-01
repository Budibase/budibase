import { Table, WithoutDocMetadata } from "@budibase/types"
import { create } from "./create"
import { getAllInternalTables } from "./getters"

/**
 * Generates a unique name for a duplicated table by checking existing table names
 * and adding an incrementing number if needed
 * @param originalName - The name of the original table
 * @param existingTables - Array of existing tables to check against
 * @returns A unique table name
 */
function generateUniqueName(
  originalName: string,
  existingTables: Table[]
): string {
  const existingNames = new Set(existingTables.map(table => table.name))

  // First try with just " - Copy"
  let candidateName = `${originalName} - Copy`
  if (!existingNames.has(candidateName)) {
    return candidateName
  }

  // If that exists, try with numbers
  let counter = 2
  do {
    candidateName = `${originalName} - Copy ${counter}`
    counter++
  } while (existingNames.has(candidateName))

  return candidateName
}

/**
 * Duplicates an internal table without its data
 * @param table - The table to duplicate
 * @param userId - The user performing the duplication
 * @returns The new duplicated table
 */
export async function duplicate(table: Table, userId?: string): Promise<Table> {
  // Get all existing internal tables to check for name conflicts
  const existingTables = await getAllInternalTables()

  // Generate a unique name for the duplicated table
  const duplicatedName = generateUniqueName(table.name, existingTables)

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
