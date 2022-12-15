import { Cookie } from "../../constants"
import env from "../../environment"
import { authError } from "./utils"
import { BBContext } from "@budibase/types"

export const options = {
  secretOrKey: env.JWT_SECRET,
  jwtFromRequest: function (ctx: BBContext) {
    return ctx.cookies.get(Cookie.Auth)
  },
}

export async function authenticate(jwt: Function, done: Function) {
  try {
    return done(null, jwt)
  } catch (err) {
    return authError(done, "JWT invalid", err)
  }
}
