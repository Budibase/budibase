import * as sharedCore from "@budibase/shared-core"

export function canBeDisplayColumn(column) {
  if (!sharedCore.canBeDisplayColumn(column.type)) {
    return false
  }
  // If it's a related column (only available in the frontend), don't allow using it as display column
  if (column.related) {
    return false
  }
  return true
}

export function canBeSortColumn(column) {
  // Allow sorting by calculation columns
  if (column.calculationType) {
    return true
  }
  if (!sharedCore.canBeSortColumn(column.type)) {
    return false
  }
  // If it's a related column (only available in the frontend), don't allow using it as display column
  if (column.related) {
    return false
  }
  return true
}
