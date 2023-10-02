import { FieldSubtype } from "@budibase/types"

export class InvalidBBRefError extends Error {
  constructor(id: string, subtype: FieldSubtype) {
    super(`Id "${id}" is not valid for the subtype "${subtype}"`)
  }
}
