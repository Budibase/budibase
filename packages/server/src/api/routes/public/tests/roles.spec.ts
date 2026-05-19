import { tenancy } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"
import type { User } from "@budibase/types"
import * as setup from "../../tests/utilities"
import { PublicAPIRequest } from "./Request"

describe("public roles API", () => {
  const config = setup.getConfig()
  let targetUser: User
  let appBuilderRequest: PublicAPIRequest
  let globalBuilderRequest: PublicAPIRequest
  let adminRequest: PublicAPIRequest

  const getGlobalUser = async (userId: string) => {
    const db = tenancy.getTenantDB(config.getTenantId())
    return db.get<User>(userId)
  }

  beforeAll(async () => {
    await config.init()
    mocks.licenses.useExpandedPublicApi()
  })

  afterAll(setup.afterAll)

  beforeEach(async () => {
    targetUser = await config.globalUser({
      builder: { global: false },
      admin: { global: false },
    })
    const appBuilderUser = await config.globalUser({
      builder: {
        apps: [config.getProdWorkspaceId()],
      },
      admin: { global: false },
    })
    const globalBuilderUser = await config.globalUser({
      builder: { global: true },
      admin: { global: false },
    })
    const adminUser = await config.globalUser({
      builder: { global: false },
      admin: { global: true },
    })

    appBuilderRequest = await PublicAPIRequest.init(config, appBuilderUser)
    globalBuilderRequest = await PublicAPIRequest.init(
      config,
      globalBuilderUser
    )
    adminRequest = await PublicAPIRequest.init(config, adminUser)
  })

  it("rejects global builder grants from app builders", async () => {
    await appBuilderRequest.send(
      "post",
      "/roles/assign",
      {
        userIds: [targetUser._id],
        builder: true,
      },
      { status: 403 }
    )

    const user = await getGlobalUser(targetUser._id!)
    expect(user.builder?.global).toBe(false)
  })

  it("allows global builder grants from global builders", async () => {
    await globalBuilderRequest.send(
      "post",
      "/roles/assign",
      {
        userIds: [targetUser._id],
        builder: true,
      },
      { status: 200 }
    )

    const user = await getGlobalUser(targetUser._id!)
    expect(user.builder?.global).toBe(true)
  })

  it("rejects global admin grants from global builders", async () => {
    await globalBuilderRequest.send(
      "post",
      "/roles/assign",
      {
        userIds: [targetUser._id],
        admin: true,
      },
      { status: 403 }
    )

    const user = await getGlobalUser(targetUser._id!)
    expect(user.admin?.global).toBe(false)
  })

  it("allows global admin grants from global admins", async () => {
    await adminRequest.send(
      "post",
      "/roles/assign",
      {
        userIds: [targetUser._id],
        admin: true,
      },
      { status: 200 }
    )

    const user = await getGlobalUser(targetUser._id!)
    expect(user.admin?.global).toBe(true)
  })
})
