import { patchBodyValidation, scimPatch } from "scim-patch"
import { EmailUnavailableError } from "@budibase/backend-core"
import { mappers, scimUsers } from "@budibase/pro"
import {
  Ctx,
  ScimUserListResponse,
  ScimCreateUserRequest,
  ScimUserResponse,
  ScimUpdateRequest,
} from "@budibase/types"

function tryGetQueryAsNumber(ctx: Ctx, name: string) {
  const value = ctx.request.query[name]
  if (value === undefined) {
    return undefined
  }

  return +value
}

export const get = async (ctx: Ctx<void, ScimUserListResponse>) => {
  const pageSize = tryGetQueryAsNumber(ctx, "pageSize") ?? 20
  const skip = tryGetQueryAsNumber(ctx, "startIndex")

  let filters
  if (ctx.request.query.filter) {
    filters = mappers.user.userFilters(ctx.request.query.filter as string)
  }

  const getResponse = await scimUsers.get({ pageSize, skip, filters })
  ctx.body = {
    schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
    totalResults: getResponse.total,
    Resources: getResponse.users.map(mappers.user.toScimUserResponse),
    startIndex: (skip || 0) + 1,
    itemsPerPage: pageSize,
  }
}

export const find = async (ctx: Ctx<void, ScimUserResponse>) => {
  const { id } = ctx.params
  if (typeof id !== "string") {
    ctx.throw(404)
  }

  const user = await scimUsers.find(id)
  ctx.body = mappers.user.toScimUserResponse(user)
}

export const create = async (
  ctx: Ctx<ScimCreateUserRequest, ScimUserResponse>
) => {
  const userToCreate = mappers.user.fromScimUser(ctx.request.body)
  try {
    const user = await scimUsers.create(userToCreate)
    ctx.body = mappers.user.toScimUserResponse(user)
  } catch (e) {
    if (e instanceof EmailUnavailableError) {
      ctx.throw(409, "Email already in use")
    }

    throw e
  }
}

function isDeactivation(request: ScimUpdateRequest) {
  const activeFieldChange = request.Operations.find(
    o => (o.op === "Replace" || o.op === "replace") && o.path === "active"
  )
  if (!activeFieldChange) {
    return false
  }

  return (
    activeFieldChange.value === false ||
    activeFieldChange.value?.toLowerCase?.() === "false"
  )
}

export const update = async (ctx: Ctx<ScimUpdateRequest, ScimUserResponse>) => {
  const user = await scimUsers.find(ctx.params.id)
  if (!user) {
    ctx.throw(404)
  }

  const scimUser = mappers.user.toScimUserResponse(user)

  const patchs = ctx.request.body
  try {
    patchBodyValidation(patchs)
  } catch (error) {
    // Here if there are an error in you SCIM request.
  }

  if (isDeactivation(patchs)) {
    return remove(ctx)
  }

  let patchedScimUser
  try {
    patchedScimUser = scimPatch(scimUser, patchs.Operations)
  } catch (error) {
    // Here if there is an error during the patch.
  }

  if (!patchedScimUser) {
    ctx.throw(500)
  }

  const userToUpdate = mappers.user.fromScimUser(patchedScimUser)
  await scimUsers.update(userToUpdate, { allowChangingEmail: true })

  ctx.body = mappers.user.toScimUserResponse(userToUpdate)
}

export const remove = async (ctx: Ctx) => {
  const { id } = ctx.params
  if (typeof id !== "string") {
    ctx.throw(404)
  }

  await scimUsers.remove(id)
  ctx.status = 204
}
