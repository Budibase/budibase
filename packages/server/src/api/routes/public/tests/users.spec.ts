import * as setup from "../../tests/utilities"
import { User } from "@budibase/types"
import { mocks } from "@budibase/backend-core/tests"
import nock from "nock"
import environment from "../../../../environment"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

const config = new TestConfiguration()
let globalUser: User

beforeAll(async () => {
  await config.init()
})

afterAll(setup.afterAll)

beforeEach(async () => {
  globalUser = await config.globalUser()

  nock.cleanAll()
  nock(environment.WORKER_URL!)
    .get(`/api/global/users/${globalUser._id}`)
    .reply(200, (uri, body) => {
      return globalUser
    })
    .persist()

  nock(environment.WORKER_URL!)
    .post(`/api/global/users`)
    .reply(200, (uri, body) => {
      const updatedUser = body as User
      if (updatedUser._id === globalUser._id) {
        globalUser = updatedUser
        return globalUser
      } else {
        throw new Error("User not found")
      }
    })
    .persist()
})

function base() {
  return {
    tenantId: config.getTenantId(),
    firstName: "Test",
    lastName: "Test",
  }
}

describe.only("check user endpoints", () => {
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

describe("no user role update in free", () => {
  it("should not allow 'roles' to be updated", async () => {
    const res = await makeRequest("post", "/users", {
      ...base(),
      roles: { app_a: "BASIC" },
    })
    expect(res.status).toBe(200)
    expect(res.body.data.roles["app_a"]).toBeUndefined()
    expect(res.body.message).toBeDefined()
  })

  it("should not allow 'admin' to be updated", async () => {
    const res = await makeRequest("post", "/users", {
      ...base(),
      admin: { global: true },
    })
    expect(res.status).toBe(200)
    expect(res.body.data.admin).toBeUndefined()
    expect(res.body.message).toBeDefined()
  })

  it("should not allow 'builder' to be updated", async () => {
    const res = await makeRequest("post", "/users", {
      ...base(),
      builder: { global: true },
    })
    expect(res.status).toBe(200)
    expect(res.body.data.builder).toBeUndefined()
    expect(res.body.message).toBeDefined()
  })
})

describe("no user role update in business", () => {
  beforeAll(() => {
    mocks.licenses.useExpandedPublicApi()
  })

  it("should allow 'roles' to be updated", async () => {
    const res = await makeRequest("post", "/users", {
      ...base(),
      roles: { app_a: "BASIC" },
    })
    expect(res.status).toBe(200)
    expect(res.body.data.roles["app_a"]).toBe("BASIC")
    expect(res.body.message).toBeUndefined()
  })

  it("should allow 'admin' to be updated", async () => {
    mocks.licenses.useExpandedPublicApi()
    const res = await makeRequest("post", "/users", {
      ...base(),
      admin: { global: true },
    })
    expect(res.status).toBe(200)
    expect(res.body.data.admin.global).toBe(true)
    expect(res.body.message).toBeUndefined()
  })

  it("should allow 'builder' to be updated", async () => {
    mocks.licenses.useExpandedPublicApi()
    const res = await makeRequest("post", "/users", {
      ...base(),
      builder: { global: true },
    })
    expect(res.status).toBe(200)
    expect(res.body.data.builder.global).toBe(true)
    expect(res.body.message).toBeUndefined()
  })
})
