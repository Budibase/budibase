export const PROTECTED_INTERNAL_COLUMNS = [
  "_id",
  "_rev",
  "type",
  "createdAt",
  "updatedAt",
  "tableId",
] as const

export const CONSTANT_EXTERNAL_ROW_COLS = ["_id", "_rev", "tableId"] as const

export function isInternalColumnName(name: string): boolean {
  return (PROTECTED_INTERNAL_COLUMNS as readonly string[]).includes(name)
}
