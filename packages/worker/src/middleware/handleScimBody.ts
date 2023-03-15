import { Ctx } from "@budibase/types"

export const handleScimBody = (ctx: Ctx, next: any) => {
  var type = ctx.req.headers["content-type"] || ""
  type = type.split(";")[0]

  if (type === "application/scim+json") {
    ctx.req.headers["content-type"] = "application/json"
  }

  return next()
}
