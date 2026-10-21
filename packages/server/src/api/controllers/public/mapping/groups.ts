import type { Ctx, UserGroup } from "@budibase/types"

const mapGroups = (ctx: Ctx<void, UserGroup[]>) => ({
  data: ctx.body.map(group => ({
    _id: group._id!,
    name: group.name,
    isDefault: !!group.isDefault,
    managedByScim: !!group.scimInfo?.isSync,
  })),
})

export default { mapGroups }
