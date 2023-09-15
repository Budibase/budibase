import { cache } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import { FieldSubtype } from "@budibase/types"

export async function processInputBBReferences(
  value: string,
  subtype: FieldSubtype
) {
  const result = []
  const ids = value.split(",").map((id: string) => id.trim())

  switch (subtype) {
    case FieldSubtype.USER:
      for (const id of ids) {
        result.push(await cache.user.getUser(id))
      }
      break
    default:
      utils.unreachable(subtype)
  }

  if (result.length > 1) {
    return result
  }

  return result[0]
}
