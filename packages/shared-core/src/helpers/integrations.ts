import { SourceName } from "@budibase/types"

export function isGoogleSheets(type: SourceName) {
  return type === SourceName.GOOGLE_SHEETS
}
