import sdk from "../../../sdk"
import { Ctx } from "@budibase/types"

export async function fetch(ctx: Ctx) {
  ctx.body = await sdk.views.get()
}
