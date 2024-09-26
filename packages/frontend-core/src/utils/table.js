import * as sharedCore from "@budibase/shared-core"

export function canBeDisplayColumn(column) {
  if (!sharedCore.canBeDisplayColumn(column.type)) {
    return sharedCore
  }

  if (column.related) {
    // If it's a related column (only available in the frontend), don't allow using it as display column
    return false
  }

  return true
}
