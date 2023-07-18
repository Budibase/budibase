const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")
import os from "os"

jest.mock("process", () => ({
  arch: "arm64",
  version: "v14.20.1",
  platform: "darwin",
}))

describe("/component", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
    os.cpus = () => [
      {
        model: "test",
        speed: 12323,
        times: {
          user: 0,
          nice: 0,
          sys: 0,
          idle: 0,
          irq: 0,
        },
      },
    ]
    os.uptime = () => 123123123123
    os.totalmem = () => 10000000000
  })

  describe("/api/debug", () => {
    it("should return debug information to the frontend", async () => {
      const res = await request
        .get(`/api/debug/diagnostics`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toEqual({
        budibaseVersion: "0.0.0",
        cpuArch: "arm64",
        cpuCores: 1,
        cpuInfo: "test",
        hosting: "docker-compose",
        nodeVersion: "v14.20.1",
        platform: "darwin",
        totalMemory: "9.313225746154785GB",
        uptime: "1425036 day(s), 3 hour(s), 32 minute(s)",
      })
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/debug/diagnostics`,
      })
    })
  })
})
