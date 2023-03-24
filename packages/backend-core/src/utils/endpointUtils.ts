import { Ctx } from "@budibase/types"

const SCIM_ENDPOINTS = new RegExp(["scim/"].join("|"))
export function isScimEndpoint(ctx: Ctx): boolean {
  return SCIM_ENDPOINTS.test(ctx.request.url)
}
