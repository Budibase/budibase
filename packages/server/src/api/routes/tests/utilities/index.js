const supertest = require("supertest")
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
