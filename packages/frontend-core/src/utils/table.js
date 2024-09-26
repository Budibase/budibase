import * as sharedCore from "@budibase/shared-core"

export function canBeDisplayColumn(column) {
  if (!sharedCore.canBeDisplayColumn(column.type)) {
    return false
  }

  if (column.related) {
    // If it's a related column (only available in the frontend), don't allow using it as display column
    return false
  }

  return true
}

export function canBeSortColumn(column) {
  if (!sharedCore.canBeSortColumn(column.type)) {
    return false
  }

  if (column.related) {
    // If it's a related column (only available in the frontend), don't allow using it as display column
    return false
  }

  return true
}
