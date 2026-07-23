import { redis, type RedisClient } from "@budibase/backend-core"
import {
  FUNCTION_RUN_REQUEST_FIXTURE,
  FUNCTION_RUN_RESULT_FIXTURE,
  FunctionErrorCode,
} from "@budibase/types"
import type { FunctionRunRequest } from "@budibase/types"
import {
  createFunctionRunGrant,
  executeWithFunctionRunGrant,
  getFunctionRunGrant,
  type FunctionRunGrantScope,
} from "./grants"

describe("Function run grants", () => {
  let client: RedisClient

  const scope = {
    runId: FUNCTION_RUN_REQUEST_FIXTURE.runId,
    workspaceId: "app_workspace",
    functionId: "fn_function",
    sourceHash: FUNCTION_RUN_REQUEST_FIXTURE.artifact.sourceHash,
    automationId: "au_automation",
    automationStepId: "step_1",
    executionUser: {
      _id: "us_user",
      email: "builder@example.com",
    },
    capabilities: {
      cap_customers: {
        capabilityId: "cap_customers",
        queryId: "query_customers",
        datasourceAlias: "CRM",
        queryAlias: "getCustomers",
        parameterNames: ["status"],
      },
    },
  } satisfies FunctionRunGrantScope

  beforeEach(async () => {
    client = await redis.Client.init(redis.utils.Databases.FUNCTION_RUN_GRANTS)
    await client.clear()
  })

  afterEach(async () => {
    await client.finish()
  })

  it("stores a random, scoped, short-lived grant without the bearer token", async () => {
    const first = await createFunctionRunGrant(
      scope,
      FUNCTION_RUN_REQUEST_FIXTURE.limits,
      client
    )
    const second = await createFunctionRunGrant(
      { ...scope, runId: "run-fixture-2" },
      FUNCTION_RUN_REQUEST_FIXTURE.limits,
      client
    )

    expect(first.grantToken).not.toBe(second.grantToken)
    expect(first.grantToken.length).toBeGreaterThanOrEqual(32)
    expect(first.grant).toMatchObject({
      ...scope,
      remainingQueryCalls: FUNCTION_RUN_REQUEST_FIXTURE.limits.maxQueryCalls,
      limits: FUNCTION_RUN_REQUEST_FIXTURE.limits,
    })
    expect(first.grant.expiresAt).toBeGreaterThan(Date.now())
    expect(await client.getTTL(scope.runId)).toBeGreaterThan(0)

    const storedGrant = await client.get(scope.runId)
    expect(storedGrant).not.toHaveProperty("grantToken")
    expect(storedGrant).toHaveProperty("tokenHash")
  })

  it("requires the token belonging to the run", async () => {
    const { grant, grantToken } = await createFunctionRunGrant(
      scope,
      FUNCTION_RUN_REQUEST_FIXTURE.limits,
      client
    )

    await expect(
      getFunctionRunGrant(scope.runId, "incorrect-token", client)
    ).resolves.toBeNull()
    await expect(
      getFunctionRunGrant(scope.runId, grantToken, client)
    ).resolves.toEqual(grant)
  })

  it("does not replace an existing run grant", async () => {
    await createFunctionRunGrant(
      scope,
      FUNCTION_RUN_REQUEST_FIXTURE.limits,
      client
    )

    await expect(
      createFunctionRunGrant(scope, FUNCTION_RUN_REQUEST_FIXTURE.limits, client)
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
    })
  })

  it("adds the token to the runner request and cleans up after success", async () => {
    const { grantToken: _grantToken, ...request } = FUNCTION_RUN_REQUEST_FIXTURE
    const execute = jest.fn(
      async (_request: FunctionRunRequest) => FUNCTION_RUN_RESULT_FIXTURE
    )

    await expect(
      executeWithFunctionRunGrant({ execute }, request, scope, client)
    ).resolves.toEqual(FUNCTION_RUN_RESULT_FIXTURE)
    expect(execute).toHaveBeenCalledWith({
      ...request,
      grantToken: expect.any(String),
    })
    expect(await client.get(scope.runId)).toBeNull()
  })

  it("cleans up after runner failure", async () => {
    const { grantToken: _grantToken, ...request } = FUNCTION_RUN_REQUEST_FIXTURE
    const execute = jest.fn(async (_request: FunctionRunRequest) => {
      throw new Error("runner failed")
    })

    await expect(
      executeWithFunctionRunGrant({ execute }, request, scope, client)
    ).rejects.toThrow("runner failed")
    expect(await client.get(scope.runId)).toBeNull()
  })
})
