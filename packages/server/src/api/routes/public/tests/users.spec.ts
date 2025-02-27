import * as setup from "../../tests/utilities"
import { User } from "@budibase/types"
import { generator, mocks } from "@budibase/backend-core/tests"
import nock from "nock"
import environment from "../../../../environment"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

const config = new TestConfiguration()
let globalUser: User
let users: Record<string, User> = {}

beforeAll(async () => {
  await config.init()
})

afterAll(setup.afterAll)

beforeEach(async () => {
  globalUser = await config.globalUser()
  users[globalUser._id!] = globalUser

  nock.cleanAll()
  nock(environment.WORKER_URL!)
    .get(new RegExp(`/api/global/users/.*`))
    .reply(200, (uri, body) => {
      const id = uri.split("/").pop()
      return users[id!]
    })
    .persist()

  nock(environment.WORKER_URL!)
    .post(`/api/global/users`)
    .reply(200, (uri, body) => {
      const newUser = body as User
      if (!newUser._id) {
        newUser._id = `us_${generator.guid()}`
      }
      users[newUser._id!] = newUser
      return newUser
    })
    .persist()
})

describe("check user endpoints", () => {
  it("should not allow a user to update their own roles", async () => {
    await config.withUser(globalUser, () =>
      config.api.public.user.update({
        ...globalUser,
        roles: { app_1: "ADMIN" },
      })
    )
    const updatedUser = await config.api.user.find(globalUser._id!)
    expect(updatedUser.roles?.app_1).toBeUndefined()
  })

  it("should not allow a user to delete themselves", async () => {
    await config.withUser(globalUser, () =>
      config.api.public.user.destroy(globalUser._id!, { status: 405 })
    )
  })
})

describe("role updating on free tier", () => {
  it("should not allow 'roles' to be updated", async () => {
    const newUser = await config.api.public.user.create({
      email: generator.email({ domain: "example.com" }),
      roles: { app_a: "BASIC" },
    })
    expect(newUser.roles["app_a"]).toBeUndefined()
  })

  it("should not allow 'admin' to be updated", async () => {
    const newUser = await config.api.public.user.create({
      email: generator.email({ domain: "example.com" }),
      roles: {},
      admin: { global: true },
    })
    expect(newUser.admin).toBeUndefined()
  })

  it("should not allow 'builder' to be updated", async () => {
    const newUser = await config.api.public.user.create({
      email: generator.email({ domain: "example.com" }),
      roles: {},
      builder: { global: true },
    })
    expect(newUser.builder).toBeUndefined()
  })
})

describe("role updating on business tier", () => {
  beforeAll(() => {
    mocks.licenses.useExpandedPublicApi()
  })

  it("should allow 'roles' to be updated", async () => {
    const newUser = await config.api.public.user.create({
      email: generator.email({ domain: "example.com" }),
      roles: { app_a: "BASIC" },
    })
    expect(newUser.roles["app_a"]).toBe("BASIC")
  })

  it("should allow 'admin' to be updated", async () => {
    const newUser = await config.api.public.user.create({
      email: generator.email({ domain: "example.com" }),
      roles: {},
      admin: { global: true },
    })
    expect(newUser.admin?.global).toBe(true)
  })

  it("should allow 'builder' to be updated", async () => {
    const newUser = await config.api.public.user.create({
      email: generator.email({ domain: "example.com" }),
      roles: {},
      builder: { global: true },
    })
    expect(newUser.builder?.global).toBe(true)
  })
})
