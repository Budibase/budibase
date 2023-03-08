import TestConfig from "../../../../tests/utilities/TestConfiguration"
import env from "../../../../environment"
import supertest from "supertest"
export * as structures from "../../../../tests/utilities/structures"

function user() {
  return {
    _id: "user",
    _rev: "rev",
    createdAt: Date.now(),
    email: "test@test.com",
    roles: {},
    tenantId: "default",
    status: "active",
  }
}

jest.mock("../../../../utilities/workerRequests", () => ({
  getGlobalUsers: jest.fn(() => {
    return {
      _id: "us_uuid1",
    }
  }),
  getGlobalSelf: jest.fn(() => {
    return {
      _id: "us_uuid1",
    }
  }),
  allGlobalUsers: jest.fn(() => {
    return [user()]
  }),
  readGlobalUser: jest.fn(() => {
    return user()
  }),
  saveGlobalUser: jest.fn(() => {
    return { _id: "user", _rev: "rev" }
  }),
  deleteGlobalUser: jest.fn(() => {
    return { message: "deleted user" }
  }),
  removeAppFromUserRoles: jest.fn(),
}))

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let request: supertest.SuperTest<supertest.Test> | undefined | null,
  config: TestConfig | null

export function beforeAll() {
  config = new TestConfig()
  request = config.getRequest()
}

export function afterAll() {
  if (config) {
    config.end()
  }
  // clear app files

  request = null
  config = null
}

export function getRequest() {
  if (!request) {
    beforeAll()
  }
  return request!
}

export function getConfig() {
  if (!config) {
    beforeAll()
  }
  return config!
}

export async function switchToSelfHosted(func: any) {
  // self hosted stops any attempts to Dynamo
  env._set("NODE_ENV", "production")
  env._set("SELF_HOSTED", true)
  let error
  try {
    await func()
  } catch (err) {
    error = err
  }
  env._set("NODE_ENV", "jest")
  env._set("SELF_HOSTED", false)
  // don't throw error until after reset
  if (error) {
    throw error
  }
}
