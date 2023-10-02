import * as setup from "../../tests/utilities"
import { generateMakeRequest, MakeRequestResponse } from "./utils"
import { User } from "@budibase/types"
import { mocks } from "@budibase/backend-core/tests"

import * as workerRequests from "../../../../utilities/workerRequests"

const mockedWorkerReq = jest.mocked(workerRequests)

let config = setup.getConfig()
let apiKey: string, globalUser: User, makeRequest: MakeRequestResponse

beforeAll(async () => {
  await config.init()
  globalUser = await config.globalUser()
  apiKey = await config.generateApiKey(globalUser._id)
  makeRequest = generateMakeRequest(apiKey)
  mockedWorkerReq.readGlobalUser.mockImplementation(() =>
    Promise.resolve(globalUser)
  )
})

afterAll(setup.afterAll)

function base() {
  return {
    tenantId: config.getTenantId(),
    firstName: "Test",
    lastName: "Test",
  }
}

function updateMock() {
  mockedWorkerReq.readGlobalUser.mockImplementation(ctx => ctx.request.body)
}

describe("check user endpoints", () => {
  it("should not allow a user to update their own roles", async () => {
    const res = await makeRequest("put", `/users/${globalUser._id}`, {
      ...globalUser,
      roles: {
        app_1: "ADMIN",
      },
    })
    expect(
      mockedWorkerReq.saveGlobalUser.mock.lastCall?.[0].body.data.roles["app_1"]
    ).toBeUndefined()
    expect(res.status).toBe(200)
    expect(res.body.data.roles["app_1"]).toBeUndefined()
  })

  it("should not allow a user to delete themselves", async () => {
    const res = await makeRequest("delete", `/users/${globalUser._id}`)
    expect(res.status).toBe(405)
    expect(mockedWorkerReq.deleteGlobalUser.mock.lastCall).toBeUndefined()
  })
})

describe("no user role update in free", () => {
  beforeAll(() => {
    updateMock()
  })

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
    updateMock()
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
