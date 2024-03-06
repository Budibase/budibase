import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import supertest from "supertest"

export * as structures from "../../../../tests/utilities/structures"

function user() {
  return {
    _id: "user",
    _rev: "rev",
    createdAt: Date.now(),
    email: "test@example.com",
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
  config: TestConfiguration | null

export function beforeAll() {
  config = new TestConfiguration()
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
