const supertest = require("supertest")
const { BUILTIN_ROLE_IDS } = require("../../../../utilities/security/roles")
const jwt = require("jsonwebtoken")
const env = require("../../../../environment")

const TEST_CLIENT_ID = "test-client-id"

exports.TEST_CLIENT_ID = TEST_CLIENT_ID
exports.supertest = async () => {
  let request
  let server
  env.PORT = 4002
  server = require("../../../../app")

  request = supertest(server)
  return { request, server }
}

exports.defaultHeaders = appId => {
  const builderUser = {
    userId: "BUILDER",
    roleId: BUILTIN_ROLE_IDS.BUILDER,
  }

  const builderToken = jwt.sign(builderUser, env.JWT_SECRET)

  const headers = {
    Accept: "application/json",
    Cookie: [`budibase:builder:local=${builderToken}`],
  }
  if (appId) {
    headers["x-budibase-app-id"] = appId
  }

  return headers
}

exports.publicHeaders = appId => {
  const headers = {
    Accept: "application/json",
  }
  if (appId) {
    headers["x-budibase-app-id"] = appId
  }

  return headers
}
