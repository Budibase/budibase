import { structures } from "@budibase/backend-core/tests"
import { withEnv } from "../../environment"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { getState, startup } from "../index"
import {
  users,
  utils,
  tenancy,
  withEnv as withCoreEnv,
} from "@budibase/backend-core"
import nock from "nock"

describe("check BB_ADMIN environment variables", () => {
  const config = new TestConfiguration()
  beforeAll(async () => {
    await config.init()
  })

  beforeEach(() => {
    nock.cleanAll()
    jest.restoreAllMocks()
  })

  it("should be able to create a user with the BB_ADMIN environment variables", async () => {
    nock("http://localhost:10000")
      .get("/api/global/configs/checklist")
      .reply(200, {})
      .post("/api/global/self/api_key")
      .reply(200, {})

    const EMAIL = `${structures.generator.guid()}@budibase.com`
    const PASSWORD = "budibase"
    await tenancy.doInTenant(tenancy.DEFAULT_TENANT_ID, async () => {
      await withEnv(
        {
          MULTI_TENANCY: "0",
          SELF_HOSTED: "1",
        },
        () =>
          withCoreEnv(
            {
              BB_ADMIN_USER_EMAIL: EMAIL,
              BB_ADMIN_USER_PASSWORD: PASSWORD,
            },
            async () => {
              await startup({ force: true })
              const user = await users.getGlobalUserByEmail(EMAIL, {
                cleanup: false,
              })
              expect(user).toBeDefined()
              expect(user?.password).toBeDefined()
              expect(await utils.compare(PASSWORD, user!.password!)).toEqual(
                true
              )
            }
          )
      )
    })
  })

  it("waits for LiteLLM readiness before marking startup as ready", async () => {
    let requestCount = 0
    const liteLLMScope = nock("https://api.openai.com")
      .persist()
      .get("/v1/health/liveliness")
      .reply(() => {
        requestCount++
        return requestCount === 1 ? [503, "not ready"] : [200, "ok"]
      })

    await withEnv(
      {
        LITELLM_MASTER_KEY: "test-master-key",
        LITELLM_READINESS_TIMEOUT_MS: 200,
        LITELLM_READINESS_POLL_MS: 10,
      },
      async () => {
        await startup({ force: true })
      }
    )

    expect(liteLLMScope.isDone()).toBe(true)
    expect(requestCount).toBeGreaterThan(1)
    expect(getState()).toBe("ready")
  })

  it("keeps startup ready when LiteLLM is unavailable", async () => {
    await withEnv(
      {
        LITELLM_READINESS_TIMEOUT_MS: 50,
        LITELLM_READINESS_POLL_MS: 10,
      },
      async () => {
        await startup({ force: true })
      }
    )

    expect(getState()).toBe("ready")
  })

  it("keeps startup ready when LiteLLM is present but does not become ready", async () => {
    nock("https://api.openai.com")
      .persist()
      .get("/v1/health/liveliness")
      .reply(503)

    await withEnv(
      {
        LITELLM_MASTER_KEY: "test-master-key",
        LITELLM_READINESS_TIMEOUT_MS: 50,
        LITELLM_READINESS_POLL_MS: 10,
      },
      async () => {
        await startup({ force: true })
      }
    )

    expect(getState()).toBe("ready")
  })
})
