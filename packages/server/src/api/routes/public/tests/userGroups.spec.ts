jest.mock("@budibase/pro", () => {
  const actual =
    jest.requireActual<typeof import("@budibase/pro")>("@budibase/pro")
  return {
    ...actual,
    sdk: {
      ...actual.sdk,
      groups: {
        ...actual.sdk.groups,
        addUsers: jest.fn(),
        removeUsers: jest.fn(),
      },
    },
  }
})

import { generator, mocks } from "@budibase/backend-core/tests"
import { Feature, type User } from "@budibase/types"
import { sdk } from "@budibase/pro"
import nock from "nock"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import * as setup from "../../tests/utilities"
import { mockWorkerUserAPI } from "./utils"

describe("public user group memberships", () => {
  const config = new TestConfiguration()
  let admin: User
  let mockedUsers: Record<string, User>

  beforeAll(async () => {
    await config.init()
  })

  afterAll(setup.afterAll)

  beforeEach(async () => {
    mocks.licenses.useUnlimited({
      features: [Feature.EXPANDED_PUBLIC_API, Feature.USER_GROUPS],
    })
    admin = await config.globalUser({
      admin: { global: true },
      builder: { global: true },
    })
    config.user = admin
    nock.cleanAll()
    mockedUsers = mockWorkerUserAPI(admin)
    jest.mocked(sdk.groups.addUsers).mockReset()
    jest.mocked(sdk.groups.removeUsers).mockReset()
  })

  it("returns memberships on creation and retrieval", async () => {
    const group = await config.createGroup()
    const user = await config.api.public.user.create({
      email: generator.email({ domain: "example.com" }),
      roles: {},
      userGroups: [group._id!],
    })
    const retrieved = await config.api.public.user.find(user._id!)

    expect(user.userGroups).toEqual([group._id])
    expect(retrieved.userGroups).toEqual([group._id])
  })

  it("replaces, preserves omitted, and clears memberships", async () => {
    const original = await config.createGroup()
    const replacement = await config.createGroup()
    jest
      .mocked(sdk.groups.addUsers)
      .mockImplementation(async (groupId, userIds) => {
        for (const userId of userIds) {
          const user = mockedUsers[userId]
          if (user) {
            user.userGroups = [...(user.userGroups || []), groupId]
          }
        }
        return []
      })
    jest
      .mocked(sdk.groups.removeUsers)
      .mockImplementation(async (groupId, userIds) => {
        for (const userId of userIds) {
          const user = mockedUsers[userId]
          if (user) {
            user.userGroups = (user.userGroups || []).filter(
              id => id !== groupId
            )
          }
        }
        return []
      })
    const user = await config.api.public.user.create({
      email: generator.email({ domain: "example.com" }),
      roles: {},
      userGroups: [original._id!],
    })
    const replaced = await config.api.public.user.update({
      ...user,
      userGroups: [replacement._id!],
    })
    const preserved = await config.api.public.user.update({
      _id: user._id,
      email: user.email,
      tenantId: user.tenantId,
      roles: user.roles,
      firstName: "Updated",
    })
    const cleared = await config.api.public.user.update({
      ...preserved,
      userGroups: [],
    })

    expect(replaced.userGroups).toEqual([replacement._id])
    expect(preserved.userGroups).toEqual([replacement._id])
    expect(cleared.userGroups).toEqual([])
  })

  it("includes memberships in search results", async () => {
    nock.cleanAll()
    const target = { ...admin, userGroups: ["gr_example"] }
    mockWorkerUserAPI(target)
    const apiKey = await config.generateApiKey(admin._id)
    const response = await config
      .request!.post("/api/public/v1/users/search")
      .set(config.defaultHeaders({ "x-budibase-api-key": apiKey }))
      .send({ name: admin.email })
      .expect(200)

    expect(response.body.data).toEqual([
      expect.objectContaining({ userGroups: ["gr_example"] }),
    ])
  })

  it.each([Feature.USER_GROUPS, Feature.EXPANDED_PUBLIC_API])(
    "requires both licensed features when only %s is enabled",
    async feature => {
      mocks.licenses.useUnlimited({ features: [feature] })
      await config.api.public.user.create(
        {
          email: generator.email({ domain: "example.com" }),
          roles: {},
          userGroups: ["gr_example"],
        },
        { status: 400 }
      )
    }
  )

  it("rejects non-admin API keys", async () => {
    const builder = await config.globalUser({
      admin: { global: false },
      builder: { global: true },
    })
    nock.cleanAll()
    mockWorkerUserAPI(builder)

    await config.withUser(builder, () =>
      config.api.public.user.create(
        {
          email: generator.email({ domain: "example.com" }),
          roles: {},
          userGroups: ["gr_example"],
        },
        { status: 403 }
      )
    )
  })

  it.each([null, "gr_example", [123], [""], ["us_example"], ["gr_a", "gr_a"]])(
    "rejects malformed memberships %j",
    async userGroups => {
      const apiKey = await config.generateApiKey(admin._id)
      await config
        .request!.post("/api/public/v1/users")
        .set(config.defaultHeaders({ "x-budibase-api-key": apiKey }))
        .send({
          email: generator.email({ domain: "example.com" }),
          userGroups,
        })
        .expect(400)
    }
  )
})
