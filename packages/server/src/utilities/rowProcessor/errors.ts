import { BBReferenceFieldSubTypeieldSubType } from "@budibase/types"

export class InvalidBBRefError extends Error {
  constructor(id: string, subtype: BBReferenceFieldSubTypeieldSubType) {
    super(`Id "${id}" is not valid for the subtype "${subtype}"`)
  }
}
