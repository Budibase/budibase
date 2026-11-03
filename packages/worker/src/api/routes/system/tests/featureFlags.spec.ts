import { constants, features, HTTPError, withEnv } from "@budibase/backend-core"
import { TestConfiguration } from "../../../../tests"

jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return { ...core, features: { ...core.features, reload: jest.fn() } }
})

describe("POST /api/internal/features/reload", () => {
  const config = new TestConfiguration()
  const reload = jest.mocked(features.reload)
  const path = "/api/internal/features/reload"

  beforeEach(() => {
    reload.mockReset().mockResolvedValue()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it.each([{}, { [constants.Header.API_KEY]: "invalid" }])(
    "requires an internal key: %j",
    async headers => {
      await config.getRequest().post(path).set(headers).expect(403)
      expect(reload).not.toHaveBeenCalled()
    }
  )

  it("reloads without tenant or user context", async () => {
    await withEnv({ INTERNAL_API_KEY: "reload-test-key" }, async () => {
      await config
        .getRequest()
        .post(path)
        .set(constants.Header.API_KEY, "reload-test-key")
        .expect(204)
      expect(reload).toHaveBeenCalledTimes(1)
    })
  })

  it("reports an unsuccessful refresh", async () => {
    reload.mockRejectedValue(new HTTPError("Feature flag reload failed", 503))
    await withEnv({ INTERNAL_API_KEY: "reload-test-key" }, async () => {
      await config
        .getRequest()
        .post(path)
        .set(constants.Header.API_KEY, "reload-test-key")
        .expect(503)
    })
  })
})
