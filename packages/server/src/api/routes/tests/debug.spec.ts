import * as setup from "./utilities"
import { checkBuilderEndpoint } from "./utilities/TestFunctions"

describe("/component", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  describe("/api/debug", () => {
    it("should return debug information to the frontend", async () => {
      const res = await request
        .get(`/api/debug/diagnostics`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toEqual({
        budibaseVersion: "0.0.0+jest",
        cpuArch: expect.any(String),
        cpuCores: expect.any(Number),
        cpuInfo: expect.any(String),
        hosting: "docker-compose",
        nodeVersion: expect.stringMatching(/^v\d+\.\d+\.\d+$/),
        platform: expect.any(String),
        totalMemory: expect.stringMatching(/^[0-9\\.]+GB$/),
        uptime: expect.stringMatching(
          /^\d+ day\(s\), \d+ hour\(s\), \d+ minute\(s\)$/
        ),
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
