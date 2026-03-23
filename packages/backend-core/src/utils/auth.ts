import { Ctx } from "@budibase/types"

export function getBearerToken(ctx: Ctx) {
  const auth = ctx.get("authorization")
  if (!auth) {
    return null
  }

  const match = auth.match(/^Bearer\s+(.+)$/i)
  return match ? match[1] : null
}
