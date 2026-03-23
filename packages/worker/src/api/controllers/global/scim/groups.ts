import groupBy from "lodash/groupBy"
import { patchBodyValidation, scimPatch } from "scim-patch"
import { filter, parse } from "scim2-parse-filter"
import {
  Ctx,
  ScimCreateGroupRequest,
  ScimGroupListResponse,
  ScimGroupResponse,
  ScimUpdateRequest,
  UserGroup,
} from "@budibase/types"
import { utils } from "@budibase/shared-core"
import { groups, mappers, scimGroups, scimUsers } from "@budibase/pro"

function cleanResponse(group: ScimGroupResponse, excludedAttributes: string) {
  for (const attr of (excludedAttributes as string).split(",")) {
    delete (group as any)[attr]
  }
}

export const get = async (ctx: Ctx<void, ScimGroupListResponse>) => {
  const fetchedGroups = await groups.fetch()
  let result = fetchedGroups
    .filter(g => g.scimInfo?.isSync)
    .map(mappers.group.toScimGroupResponse)

  const { filter: reqFilter, excludedAttributes } = ctx.request.query

  if (reqFilter) {
    const filterFunc = filter(parse(reqFilter as string))
    result = result.filter(filterFunc)
  }

  if (excludedAttributes) {
    result.forEach((g: any) => {
      cleanResponse(g, excludedAttributes as string)
    })
  }

  ctx.body = {
    schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
    totalResults: result.length,
    Resources: result,
    startIndex: 1,
    itemsPerPage: result.length,
  }
}

export const create = async (
  ctx: Ctx<ScimCreateGroupRequest, ScimGroupResponse>
) => {
  const groupToCreate = mappers.group.fromScimGroup(ctx.request.body)
  const group = await scimGroups.create(groupToCreate)
  ctx.body = mappers.group.toScimGroupResponse(group)
}

export const find = async (ctx: Ctx<void, ScimGroupResponse>) => {
  const { id } = ctx.params
  const group = await groups.get(id)
  const response = mappers.group.toScimGroupResponse(group)

  const { excludedAttributes } = ctx.request.query
  if (excludedAttributes) {
    cleanResponse(response, excludedAttributes as string)
  }

  ctx.body = response
}

export const remove = async (ctx: Ctx) => {
  const { id } = ctx.params
  const existingGroup = await groups.get(id)
  await groups.remove(id, existingGroup._rev!)
  ctx.status = 204
}

export const update = async (
  ctx: Ctx<ScimUpdateRequest, ScimGroupResponse>
) => {
  const { id } = ctx.params
  const group = await groups.get(id)

  const scimGroup = mappers.group.toScimGroupResponse(group)

  const patchs = ctx.request.body
  try {
    // Validate request
    patchBodyValidation(patchs)
  } catch (error) {
    ctx.throw(400)
  }

  const { true: memberOps, false: fieldOps } = groupBy(
    patchs.Operations,
    p => p.path === "members"
  )

  if (fieldOps?.length) {
    const patchedScimGroup = scimPatch(scimGroup, fieldOps)
    if (!patchedScimGroup) {
      ctx.throw(500)
    }

    const groupToUpdate: UserGroup = {
      ...mappers.group.fromScimGroup(patchedScimGroup),
      _rev: group._rev,
    }
    await groups.save(groupToUpdate)
  }

  if (memberOps?.length) {
    const usersToAdd = []
    const usersToRemove = []
    for (const { op, value } of memberOps) {
      switch (op) {
        case "add":
        case "Add":
          for (const u of value) {
            usersToAdd.push(await scimUsers.find(u.value))
          }
          break
        case "remove":
        case "Remove":
          for (const u of value) {
            try {
              usersToRemove.push(await scimUsers.find(u.value))
            } catch (e: any) {
              if (e.status !== 404) {
                throw e
              }
            }
          }
          break
        case "replace":
        case "Replace":
          throw new Error("Replacing members is not allowed")
        default:
          utils.unreachable(op)
      }
    }

    if (usersToAdd.length) {
      await groups.addUsers(
        id,
        usersToAdd.map(u => u._id!)
      )
    }
    if (usersToRemove.length) {
      await groups.removeUsers(
        id,
        usersToRemove.map(u => u._id!)
      )
    }
  }

  ctx.body = mappers.group.toScimGroupResponse(await groups.get(id))
}
