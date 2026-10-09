import { load } from "cheerio"
import { cache, context, db, tenancy, withEnv } from "@budibase/backend-core"
import { db as proDb, groups } from "@budibase/pro"
import type {
  InviteExistingUserToWorkspaceRequest,
  User,
} from "@budibase/types"
import { TestConfiguration, mocks, structures } from "../../../../tests"

jest.mock("nodemailer")
const sendMailMock = mocks.email.mock()

describe("workspace invitations for existing users", () => {
  const config = new TestConfiguration()
  let workspaceId: string
  let user: User

  beforeAll(async () => {
    await config.beforeAll()
    await config.saveSmtpConfig()
    await config.api.configs.saveConfig(
      structures.configs.settings({ platformUrl: "https://example.com" })
    )
  })

  afterAll(async () => {
    await config.afterAll()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    mocks.licenses.useGroups()
    workspaceId = db.generateWorkspaceID()
    const devWorkspaceId = db.getDevWorkspaceID(workspaceId)
    await config.doInTenant(() =>
      context.doInWorkspaceContext(devWorkspaceId, async () => {
        await context.getWorkspaceDB().put({
          ...structures.apps.app(devWorkspaceId),
          tenantId: config.tenantId,
          name: "Research & Development",
          url: "/research",
        })
      })
    )
    user = await config.createUser()
  })

  const invite = (
    body: InviteExistingUserToWorkspaceRequest = { role: "BASIC" }
  ) =>
    config.withApp(workspaceId, () =>
      config.api.users.inviteExistingUserToWorkspace({
        userId: user._id!,
        body,
      })
    )

  const publishWorkspace = async ({ url = "/research" } = {}) =>
    config.doInTenant(() =>
      context.doInWorkspaceContext(workspaceId, () =>
        context.getWorkspaceDB().put({
          ...structures.apps.app(workspaceId),
          tenantId: config.tenantId,
          name: "Research & Development",
          url,
        })
      )
    )

  const createGroup = async ({
    role = "BASIC",
    scim = false,
  }: { role?: string; scim?: boolean } = {}) => {
    const group = {
      ...structures.groups.UserGroup(),
      _id: proDb.groups.generateUserGroupID(),
      roles: { [workspaceId]: role },
      ...(role === "CREATOR" ? { builder: { apps: [workspaceId] } } : {}),
      ...(scim ? { scimInfo: { isSync: true } } : {}),
    }
    await config.doInTenant(() => tenancy.getGlobalDB().put(group))
    return group._id
  }

  it("sends an informational email with the inviter, workspace and tenant link", async () => {
    await publishWorkspace()
    const response = await withEnv(
      { PLATFORM_URL: "https://example.com" },
      () => invite()
    )

    const updatedUser = await config.getUser(user.email)
    expect(updatedUser.roles[workspaceId]).toBe("BASIC")
    expect(response.body).toEqual({
      _id: user._id,
      _rev: updatedUser._rev,
      email: user.email,
    })
    expect(sendMailMock).toHaveBeenCalledTimes(1)
    const mail = sendMailMock.mock.calls[0][0]
    const html = load(mail.html)
    expect(mail.to).toBe(user.email)
    expect(html.text()).toContain("Research & Development")
    expect(html.text()).toContain(
      [config.user!.firstName, config.user!.lastName]
        .filter(Boolean)
        .join(" ") || config.user!.email
    )
    expect(html("a.button").attr("href")).toBe(
      await config.doInTenant(() =>
        Promise.resolve(
          tenancy.addTenantToUrl(
            `https://${config.tenantId}.example.com/app/research`
          )
        )
      )
    )
    expect(html.text()).not.toContain("Set up account")
    expect(
      await config.doInTenant(() => cache.invite.getInviteCodes())
    ).toEqual([])
  })

  it("uses the published URL when the development URL has changed", async () => {
    await publishWorkspace({ url: "/published-research" })
    await invite()

    expect(
      load(sendMailMock.mock.calls[0][0].html)("a.button").attr("href")
    ).toContain("/app/published-research")
  })

  it("links app users to the app portal when the workspace is unpublished", async () => {
    await invite()

    expect(
      load(sendMailMock.mock.calls[0][0].html)("a.button").attr("href")
    ).toContain("/builder/apps")
  })

  it("links app users to the app portal when the published URL is missing", async () => {
    await publishWorkspace({ url: "" })
    await invite()

    expect(
      load(sendMailMock.mock.calls[0][0].html)("a.button").attr("href")
    ).toContain("/builder/apps")
  })

  it("links creators to the workspace builder", async () => {
    await invite({ role: "CREATOR" })

    const updatedUser = await config.getUser(user.email)
    expect(updatedUser.builder?.apps).toContain(workspaceId)
    expect(
      load(sendMailMock.mock.calls[0][0].html)("a.button").attr("href")
    ).toContain(`/builder/workspace/${db.getDevWorkspaceID(workspaceId)}/home`)
  })

  it("sends only one email for repeat invitations and subsequent role changes", async () => {
    await invite()
    await invite()
    await invite({ role: "POWER" })

    expect((await config.getUser(user.email)).roles[workspaceId]).toBe("POWER")
    expect(sendMailMock).toHaveBeenCalledTimes(1)
  })

  it("sends only one email for concurrent invitations", async () => {
    await config.withApp(workspaceId, () =>
      Promise.all([
        config.api.users.inviteExistingUserToWorkspace({
          userId: user._id!,
          body: { role: "BASIC" },
        }),
        config.api.users.inviteExistingUserToWorkspace({
          userId: user._id!,
          body: { role: "BASIC" },
        }),
      ])
    )

    expect((await config.getUser(user.email)).roles[workspaceId]).toBe("BASIC")
    expect(sendMailMock).toHaveBeenCalledTimes(1)
  })

  it("does not notify when editing workspace permissions", async () => {
    await config.withApp(workspaceId, () =>
      config.api.users.addUserToWorkspace(user._id!, user._rev!, "BASIC")
    )
    await invite()

    expect(sendMailMock).not.toHaveBeenCalled()
  })

  it("sends one email when multiple groups grant workspace access", async () => {
    const groupIds = [await createGroup(), await createGroup()]
    await invite({ groups: groupIds })
    await invite({ groups: groupIds })

    const updatedUser = await config.getUser(user.email)
    expect(updatedUser.userGroups).toEqual(expect.arrayContaining(groupIds))
    expect(updatedUser.roles[workspaceId]).toBeUndefined()
    expect(sendMailMock).toHaveBeenCalledTimes(1)
  })

  it("does not notify an existing group member when adding a direct role", async () => {
    const groupId = await createGroup()
    await config.doInTenant(() => groups.addUsers(groupId, [user._id!]))
    await invite()

    expect((await config.getUser(user.email)).roles[workspaceId]).toBe("BASIC")
    expect(sendMailMock).not.toHaveBeenCalled()
  })

  it("links users with builder access through a group to the workspace builder", async () => {
    const groupId = await createGroup({ role: "CREATOR" })
    await invite({ groups: [groupId] })

    expect(
      load(sendMailMock.mock.calls[0][0].html)("a.button").attr("href")
    ).toContain(`/builder/workspace/${db.getDevWorkspaceID(workspaceId)}/home`)
  })

  it.each(["admin", "builder"])(
    "does not notify an existing global %s",
    async permission => {
      user = await config.createUser({ [permission]: { global: true } })
      await invite()

      expect(sendMailMock).not.toHaveBeenCalled()
    }
  )

  it("preserves admin promotion when inviting an existing user", async () => {
    await invite({ role: "ADMIN", admin: true })

    const updatedUser = await config.getUser(user.email)
    expect(updatedUser.admin?.global).toBe(true)
    expect(updatedUser.builder?.global).toBe(true)
    expect(updatedUser.roles[workspaceId]).toBe("ADMIN")
    expect(sendMailMock).toHaveBeenCalledTimes(1)
  })

  it("sends one email when both a group and a direct role grant access", async () => {
    const groupId = await createGroup()
    await invite({ role: "POWER", groups: [groupId] })

    const updatedUser = await config.getUser(user.email)
    expect(updatedUser.userGroups).toContain(groupId)
    expect(updatedUser.roles[workspaceId]).toBe("POWER")
    expect(sendMailMock).toHaveBeenCalledTimes(1)
  })

  it("preserves workspace access when SMTP delivery fails", async () => {
    sendMailMock.mockRejectedValueOnce(new Error("SMTP unavailable"))
    await invite()

    expect((await config.getUser(user.email)).roles[workspaceId]).toBe("BASIC")
  })

  it("preserves workspace access when SMTP is not configured", async () => {
    await config.deleteConfig("smtp")
    try {
      await invite()
      expect((await config.getUser(user.email)).roles[workspaceId]).toBe(
        "BASIC"
      )
      expect(sendMailMock).not.toHaveBeenCalled()
    } finally {
      await config.saveSmtpConfig()
    }
  })

  it("allows a workspace creator to invite an existing user", async () => {
    const creator = await config.createUser({
      builder: { creator: true, apps: [workspaceId] },
    })
    await config.createSession(creator)
    await config.withUser(creator, () => invite())

    expect((await config.getUser(user.email)).roles[workspaceId]).toBe("BASIC")
    expect(sendMailMock).toHaveBeenCalledTimes(1)
  })

  it("rejects invitations from users without workspace builder access", async () => {
    await config.createSession(user)
    await config.withUser(user, () =>
      config.withApp(workspaceId, () =>
        config.api.users.inviteExistingUserToWorkspace({
          userId: user._id!,
          body: { role: "BASIC" },
          status: 403,
        })
      )
    )

    expect(
      (await config.getUser(user.email)).roles[workspaceId]
    ).toBeUndefined()
    expect(sendMailMock).not.toHaveBeenCalled()
  })

  it.each(["admin", "groups"])(
    "prevents a workspace creator from changing %s",
    async change => {
      const groupId = await createGroup()
      const creator = await config.createUser({
        builder: { creator: true, apps: [workspaceId] },
      })
      await config.createSession(creator)
      await config.withUser(creator, () =>
        config.withApp(workspaceId, () =>
          config.api.users.inviteExistingUserToWorkspace({
            userId: user._id!,
            body: {
              role: "BASIC",
              ...(change === "admin" ? { admin: true } : { groups: [groupId] }),
            },
            status: 403,
          })
        )
      )

      const updatedUser = await config.getUser(user.email)
      expect(updatedUser.roles[workspaceId]).toBeUndefined()
      expect(updatedUser.admin?.global).not.toBe(true)
      expect(updatedUser.userGroups || []).not.toContain(groupId)
      expect(sendMailMock).not.toHaveBeenCalled()
    }
  )

  it("rejects membership changes to SCIM-managed groups", async () => {
    const groupId = await createGroup({ scim: true })
    await config.withApp(workspaceId, () =>
      config.api.users.inviteExistingUserToWorkspace({
        userId: user._id!,
        body: { groups: [groupId] },
        status: 404,
      })
    )

    expect((await config.getUser(user.email)).userGroups || []).not.toContain(
      groupId
    )
    expect(sendMailMock).not.toHaveBeenCalled()
  })
})
