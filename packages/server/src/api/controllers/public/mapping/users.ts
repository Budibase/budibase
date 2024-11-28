import { User } from "./types"
import { RequiredKeys } from "@budibase/types"

function user(body: any): RequiredKeys<User> {
  return {
    _id: body._id,
    email: body.email,
    password: body.password,
    status: body.status,
    firstName: body.firstName,
    lastName: body.lastName,
    forceResetPassword: body.forceResetPassword,
    builder: body.builder,
    admin: body.admin,
    roles: body.roles,
  }
}

function mapUser(ctx: any) {
  const body: { data: User; message?: string } = {
    data: user(ctx.body),
  }
  if (ctx.extra?.message) {
    body.message = ctx.extra.message
    delete ctx.extra
  }
  return body
}

function mapUsers(ctx: any): { data: User[] } {
  const users = ctx.body.map((body: any) => user(body))
  return { data: users }
}

export default {
  mapUser,
  mapUsers,
}
