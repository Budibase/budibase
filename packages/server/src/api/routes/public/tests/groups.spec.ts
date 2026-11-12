import { context, db, roles } from "@budibase/backend-core"
import { mocks, structures } from "@budibase/backend-core/tests"
import { db as proDb, groups } from "@budibase/pro"
import { Feature, type UserGroup } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import * as setup from "../../tests/utilities"

describe("public workspace groups", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(setup.afterAll)

  beforeEach(async () => {
    mocks.licenses.useUnlimited({
      features: [Feature.USER_GROUPS, Feature.EXPANDED_PUBLIC_API],
    })
    await config.newTenant()
    config.user = await config.globalUser({
      email: structures.users.newEmail(),
      admin: { global: true },
      builder: { global: true },
    })
  })

  const createGroup = async (extra: Partial<UserGroup> = {}) => {
    const group: UserGroup = {
      ...structures.userGroups.userGroup(),
      roles: { [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC },
      ...extra,
    }
    const saved = await config.doInTenant(() => groups.save(group))
    return { ...group, _id: saved.id, _rev: saved.rev }
  }

  it("lists role and builder groups without exposing members or other workspace permissions", async () => {
    const roleGroup = await createGroup({
      isDefault: true,
      roles: {
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
        app_other: roles.BUILTIN_ROLE_IDS.ADMIN,
      },
    })
    const builderGroup = await createGroup({
      roles: {},
      builder: { apps: [config.getProdWorkspaceId()] },
      scimInfo: { isSync: true, externalId: "external-group" },
    })
    await createGroup({ roles: { app_other: roles.BUILTIN_ROLE_IDS.BASIC } })
    await createGroup({ roles: {} })
    await context.doInTenant(structures.tenant.id(), () =>
      proDb.groups.save({
        ...structures.userGroups.userGroup(),
        _id: proDb.groups.generateUserGroupID(),
        roles: {
          [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
        },
      })
    )

    const listed = await config.api.public.group.list()

    expect(listed).toHaveLength(2)
    expect(listed).toEqual(
      expect.arrayContaining([
        {
          _id: roleGroup._id,
          name: roleGroup.name,
          isDefault: true,
          managedByScim: false,
        },
        {
          _id: builderGroup._id,
          name: builderGroup.name,
          isDefault: false,
          managedByScim: true,
        },
      ])
    )
  })

  it("returns an empty list when no groups grant access to the workspace", async () => {
    await createGroup({ roles: {} })

    expect(await config.api.public.group.list()).toEqual([])
  })

  it("accepts the production workspace ID", async () => {
    const group = await createGroup()
    await config.api.workspace.publish()

    const listed = await config.api.public.group.list({
      workspaceId: config.getProdWorkspaceId(),
    })

    expect(listed).toEqual([
      {
        _id: group._id,
        name: group.name,
        isDefault: false,
        managedByScim: false,
      },
    ])
  })

  it.each([Feature.USER_GROUPS, Feature.EXPANDED_PUBLIC_API])(
    "rejects requests when only %s is licensed",
    async feature => {
      mocks.licenses.useUnlimited({ features: [feature] })

      await config.api.public.group.list({ expectations: { status: 400 } })
    }
  )

  it.each([true, false])(
    "rejects non-admin API keys (global builder: %s)",
    async builder => {
      const user = await config.globalUser({
        email: structures.users.newEmail(),
        admin: { global: false },
        builder: { global: builder },
        roles: { [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.ADMIN },
      })

      await config.withUser(user, () =>
        config.api.public.group.list({ expectations: { status: 403 } })
      )
    }
  )

  it("requires an API key even with an admin browser session", async () => {
    await config
      .request!.get(
        `/api/public/v1/workspaces/${config.getDevWorkspaceId()}/groups`
      )
      .set(config.defaultHeaders())
      .expect(400)
  })

  it("rejects requests without authentication", async () => {
    await config
      .request!.get(
        `/api/public/v1/workspaces/${config.getDevWorkspaceId()}/groups`
      )
      .expect(403)
  })

  it("rejects invalid API keys", async () => {
    await config
      .request!.get(
        `/api/public/v1/workspaces/${config.getDevWorkspaceId()}/groups`
      )
      .set("x-budibase-api-key", "invalid-key")
      .expect(403)
  })

  it("rejects another tenant's workspace", async () => {
    const foreignWorkspaceId = db.generateWorkspaceID(structures.tenant.id())

    await config.api.public.group.list({
      workspaceId: foreignWorkspaceId,
      expectations: { status: 403 },
    })
  })

  it("returns 404 for a missing workspace", async () => {
    const workspaceId = db.generateWorkspaceID(config.getTenantId())

    await config.api.public.group.list({
      workspaceId,
      expectations: { status: 404 },
    })
  })
})
