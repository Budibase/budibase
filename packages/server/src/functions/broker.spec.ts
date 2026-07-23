import { redis, type RedisClient } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import {
  ActionType,
  FUNCTION_RUN_REQUEST_FIXTURE,
  FunctionErrorCode,
} from "@budibase/types"
import type {
  FunctionQueryBrokerRequest,
  FunctionRunLimits,
} from "@budibase/types"
import { executeFunctionQuery, type FunctionQueryExecution } from "./broker"
import {
  createFunctionRunGrant,
  deleteFunctionRunGrant,
  getFunctionRunGrant,
  type FunctionRunGrantScope,
} from "./grants"
import * as queryController from "../api/controllers/query"

jest.mock("@budibase/pro", () => ({
  quotas: {
    addAction: jest.fn(),
  },
}))

jest.mock("../api/controllers/query", () => ({
  executeV2AsAutomation: jest.fn(),
}))

describe("Function query broker", () => {
  let client: RedisClient
  let grantToken: string
  const addAction = jest.mocked(quotas.addAction)
  const executeV2AsAutomation = jest.mocked(
    queryController.executeV2AsAutomation
  )

  const scope = {
    runId: "run-query-broker",
    workspaceId: "app_workspace",
    functionId: "fn_function",
    sourceHash: "source-hash",
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

  const limits: FunctionRunLimits = {
    ...FUNCTION_RUN_REQUEST_FIXTURE.limits,
    maxQueryCalls: 2,
    maxConcurrentQueryCalls: 2,
  }

  const request = (
    extra: Partial<FunctionQueryBrokerRequest> = {}
  ): FunctionQueryBrokerRequest => ({
    runId: scope.runId,
    capabilityId: "cap_customers",
    parameters: { status: "active" },
    grantToken,
    ...extra,
  })

  const dependencies = (
    executeQuery: (
      execution: FunctionQueryExecution
    ) => Promise<object> = async _execution => ({ data: [{ id: 1 }] })
  ) => ({
    client,
    executeQuery,
    functionsEnabled: async (_workspaceId: string) => true,
    validateScope: async (_grant: FunctionRunGrantScope) => true,
    record: jest.fn(),
  })

  const createGrant = async (grantLimits = limits) => {
    const created = await createFunctionRunGrant(scope, grantLimits, client)
    grantToken = created.grantToken
  }

  beforeAll(async () => {
    client = await redis.Client.init(redis.utils.Databases.FUNCTION_RUN_GRANTS)
  })

  beforeEach(async () => {
    addAction.mockClear()
    executeV2AsAutomation.mockClear()
    addAction.mockImplementation(
      async (_actionType, addActionFn) => await addActionFn()
    )
    executeV2AsAutomation.mockImplementation(async ctx => {
      ctx.body = { data: [] }
    })
    await client.clear()
    await createGrant()
  })

  afterAll(async () => {
    await client.finish()
  })

  it("executes only the saved query mapped by the capability", async () => {
    const executeQuery = jest.fn(
      async (_execution: FunctionQueryExecution) => ({
        data: [{ id: 1 }],
        omitted: undefined,
      })
    )

    await expect(
      executeFunctionQuery(
        request(),
        scope.workspaceId,
        dependencies(executeQuery)
      )
    ).resolves.toEqual({ data: [{ id: 1 }] })
    expect(executeQuery).toHaveBeenCalledWith({
      grant: expect.objectContaining({
        functionId: scope.functionId,
        sourceHash: scope.sourceHash,
      }),
      capability: scope.capabilities.cap_customers,
      parameters: { status: "active" },
    })
    expect(addAction).toHaveBeenCalledWith(
      ActionType.AUTOMATION_STEP,
      expect.any(Function)
    )
  })

  it.each([
    ["a guessed capability", { capabilityId: "cap_guessed" }, undefined],
    ["a direct saved query ID", { capabilityId: "query_customers" }, undefined],
    ["an unknown parameter", { parameters: { secret: "value" } }, undefined],
    ["another workspace", {}, "app_other"],
    ["the wrong token", { grantToken: "wrong-token" }, undefined],
  ])("denies %s", async (_name, extra, appId) => {
    await expect(
      executeFunctionQuery(
        request(extra),
        appId || scope.workspaceId,
        dependencies()
      )
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
    })
    expect(addAction).not.toHaveBeenCalled()
  })

  it("does not consume query budget for pre-execution rejection", async () => {
    await expect(
      executeFunctionQuery(
        request({ parameters: { secret: "value" } }),
        scope.workspaceId,
        dependencies()
      )
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
    })
    await expect(
      getFunctionRunGrant(scope.runId, grantToken, client)
    ).resolves.toMatchObject({ remainingQueryCalls: limits.maxQueryCalls })
    expect(addAction).not.toHaveBeenCalled()
  })

  it("rejects direct query ID fields in the request", async () => {
    const unsafeRequest = {
      ...request(),
      queryId: "query_customers",
    }

    await expect(
      executeFunctionQuery(unsafeRequest, scope.workspaceId, dependencies())
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
    })
    expect(addAction).not.toHaveBeenCalled()
  })

  it("denies an invalid Function source without consuming query budget", async () => {
    const deps = {
      ...dependencies(),
      validateScope: async (_grant: FunctionRunGrantScope) => false,
    }

    await expect(
      executeFunctionQuery(request(), scope.workspaceId, deps)
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
    })
    await expect(
      getFunctionRunGrant(scope.runId, grantToken, client)
    ).resolves.toMatchObject({ remainingQueryCalls: limits.maxQueryCalls })
    expect(addAction).not.toHaveBeenCalled()
  })

  it("executes with the containing automation user", async () => {
    const { executeQuery: _executeQuery, ...deps } = dependencies()

    await expect(
      executeFunctionQuery(request(), scope.workspaceId, deps)
    ).resolves.toEqual({ data: [] })
    expect(executeV2AsAutomation).toHaveBeenCalledWith(
      expect.objectContaining({
        appId: scope.workspaceId,
        user: scope.executionUser,
        request: {
          body: {
            parameters: { status: "active" },
          },
        },
        params: {
          queryId: scope.capabilities.cap_customers.queryId,
        },
      })
    )
  })

  it("meters every reached query execution", async () => {
    await executeFunctionQuery(request(), scope.workspaceId, dependencies())
    await executeFunctionQuery(request(), scope.workspaceId, dependencies())

    expect(addAction).toHaveBeenCalledTimes(2)
    expect(addAction).toHaveBeenNthCalledWith(
      1,
      ActionType.AUTOMATION_STEP,
      expect.any(Function)
    )
    expect(addAction).toHaveBeenNthCalledWith(
      2,
      ActionType.AUTOMATION_STEP,
      expect.any(Function)
    )
  })

  it("denies expired and replayed grants", async () => {
    await client.clear()
    await createGrant({ ...limits, timeoutMs: -4_999 })
    await new Promise(resolve => setTimeout(resolve, 5))
    await expect(
      executeFunctionQuery(request(), scope.workspaceId, dependencies())
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
    })

    await client.clear()
    await createGrant()
    await deleteFunctionRunGrant(scope.runId, client)
    await expect(
      executeFunctionQuery(request(), scope.workspaceId, dependencies())
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
    })
    expect(addAction).not.toHaveBeenCalled()
  })

  it("atomically prevents concurrent calls from exceeding the query budget", async () => {
    await client.clear()
    await createGrant({ ...limits, maxQueryCalls: 1 })
    let releaseQuery: (() => void) | undefined
    const queryStarted = new Promise<void>(resolve => {
      releaseQuery = resolve
    })
    const executeQuery = jest.fn(async (_execution: FunctionQueryExecution) => {
      await queryStarted
      return { data: [] }
    })
    const deps = dependencies(executeQuery)

    const first = executeFunctionQuery(request(), scope.workspaceId, deps)
    const second = executeFunctionQuery(request(), scope.workspaceId, deps)
    await Promise.resolve()
    releaseQuery?.()
    const results = await Promise.allSettled([first, second])

    expect(
      results.filter(result => result.status === "fulfilled")
    ).toHaveLength(1)
    expect(results.filter(result => result.status === "rejected")).toHaveLength(
      1
    )
    expect(executeQuery).toHaveBeenCalledTimes(1)
  })

  it("enforces the concurrent query limit", async () => {
    await client.clear()
    await createGrant({ ...limits, maxConcurrentQueryCalls: 1 })
    let releaseQuery: (() => void) | undefined
    const holdQuery = new Promise<void>(resolve => {
      releaseQuery = resolve
    })
    const executeQuery = jest.fn(async (_execution: FunctionQueryExecution) => {
      await holdQuery
      return { data: [] }
    })
    const deps = dependencies(executeQuery)

    const first = executeFunctionQuery(request(), scope.workspaceId, deps)
    await new Promise(resolve => setImmediate(resolve))
    await expect(
      executeFunctionQuery(request(), scope.workspaceId, deps)
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_LIMIT,
    })
    releaseQuery?.()
    await expect(first).resolves.toEqual({ data: [] })
  })

  it("rejects oversized and overly deep query responses", async () => {
    await client.clear()
    await createGrant({
      ...limits,
      maxQueryResponseBytes: 10,
      maxQueryResponseDepth: 1,
    })

    await expect(
      executeFunctionQuery(
        request(),
        scope.workspaceId,
        dependencies(async () => ({ value: "too large" }))
      )
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_LIMIT,
    })
    await expect(
      executeFunctionQuery(
        request(),
        scope.workspaceId,
        dependencies(async () => ({ nested: { value: 1 } }))
      )
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_LIMIT,
    })
    expect(addAction).toHaveBeenCalledTimes(2)
  })

  it("meters failed queries without recording sensitive data", async () => {
    const record = jest.fn()
    const secretError = new Error("credential-secret")
    const deps = {
      ...dependencies(async () => {
        throw secretError
      }),
      record,
    }

    await expect(
      executeFunctionQuery(request(), scope.workspaceId, deps)
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
      message: "The Function query failed",
    })
    expect(JSON.stringify(record.mock.calls)).not.toContain(grantToken)
    expect(JSON.stringify(record.mock.calls)).not.toContain("active")
    expect(JSON.stringify(record.mock.calls)).not.toContain("credential-secret")
    expect(record).toHaveBeenCalledWith({
      capabilityId: "cap_customers",
      durationMs: expect.any(Number),
      responseBytes: 0,
      result: "error",
    })
    expect(addAction).toHaveBeenCalledWith(
      ActionType.AUTOMATION_STEP,
      expect.any(Function)
    )
  })
})
