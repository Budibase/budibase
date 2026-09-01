import { DEFAULT_FUNCTION_LIMITS, FunctionErrorCode } from "@budibase/types"
import type {
  FunctionCapabilityRequest,
  FunctionRunLimits,
  JSONValue,
} from "@budibase/types"
import {
  createFunctionInvocationScope,
  FunctionCapabilityService,
} from "./capabilities"
import type { FunctionCapabilityServiceDependencies } from "./capabilities"

describe("FunctionCapabilityService", () => {
  const meterQuery = jest.fn(async (execute: () => Promise<object>) =>
    execute()
  )
  const defaultTestLog = jest.fn()
  const capability = {
    capabilityId: "cap_customers",
    queryId: "query_customers",
    datasourceAlias: "CRM",
    queryAlias: "getCustomers",
    parameterNames: ["status"],
  }
  const limits: FunctionRunLimits = {
    ...DEFAULT_FUNCTION_LIMITS.run,
    maxQueryCalls: 2,
    maxConcurrentQueryCalls: 2,
  }
  const scope = (scopeLimits = limits) =>
    createFunctionInvocationScope({
      runId: "run-capabilities",
      workspaceId: "app_workspace",
      functionId: "fn_function",
      sourceHash: "source-hash",
      invocation: {
        type: "automation",
        automationId: "au_automation",
        automationStepId: "step_1",
      },
      executionUser: {
        userId: "us_user",
        email: "builder@example.com",
      },
      capabilities: [capability],
      limits: scopeLimits,
      deadline: Date.now() + 30_000,
    })
  const request = (
    extra: Partial<FunctionCapabilityRequest> = {}
  ): FunctionCapabilityRequest => ({
    runId: "run-capabilities",
    capabilityId: capability.capabilityId,
    parameters: { status: "active" },
    signal: new AbortController().signal,
    ...extra,
  })

  const createService = (
    invocationScope: ReturnType<typeof scope>,
    dependencies: FunctionCapabilityServiceDependencies
  ) =>
    new FunctionCapabilityService(invocationScope, {
      ...dependencies,
      meter: meterQuery,
      log: dependencies.log || defaultTestLog,
    })

  beforeEach(() => {
    meterQuery.mockClear()
    defaultTestLog.mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("copies and freezes the capability allow-list for the invocation", () => {
    const invocationScope = scope()

    expect(Object.isFrozen(invocationScope.capabilities)).toBe(true)
    expect(Object.getPrototypeOf(invocationScope.capabilities)).toBeNull()
    expect(Object.isFrozen(invocationScope.capabilities.cap_customers)).toBe(
      true
    )
    expect(
      Object.isFrozen(invocationScope.capabilities.cap_customers.parameterNames)
    ).toBe(true)
  })

  it("copies and freezes the invocation scope", () => {
    const mutableLimits = { ...limits }
    const mutableInvocation = {
      type: "automation" as const,
      automationId: "au_automation",
      automationStepId: "step_1",
    }
    const mutableExecutionUser = {
      userId: "us_user",
      oauth2: {
        accessToken: "token",
      },
    }
    const invocationScope = createFunctionInvocationScope({
      runId: "run-capabilities",
      workspaceId: "app_workspace",
      functionId: "fn_function",
      sourceHash: "source-hash",
      invocation: mutableInvocation,
      executionUser: mutableExecutionUser,
      capabilities: [capability],
      limits: mutableLimits,
      deadline: 1_000,
    })

    mutableLimits.maxQueryCalls = 0
    mutableInvocation.automationId = "au_changed"
    mutableExecutionUser.oauth2.accessToken = "changed"

    expect(invocationScope.limits.maxQueryCalls).toBe(limits.maxQueryCalls)
    expect(invocationScope.invocation.automationId).toBe("au_automation")
    expect(invocationScope.executionUser?.oauth2?.accessToken).toBe("token")
    expect(Object.isFrozen(invocationScope)).toBe(true)
    expect(Object.isFrozen(invocationScope.limits)).toBe(true)
    expect(Object.isFrozen(invocationScope.invocation)).toBe(true)
    expect(Object.isFrozen(invocationScope.executionUser)).toBe(true)
    expect(Object.isFrozen(invocationScope.executionUser?.oauth2)).toBe(true)
  })

  it("executes the saved query mapped by the capability", async () => {
    const executeQuery = jest.fn(async () => ({ data: [{ id: "row-1" }] }))
    const service = createService(scope(), { executeQuery })

    await expect(service.invokeCapability(request())).resolves.toEqual({
      data: [{ id: "row-1" }],
    })
    expect(executeQuery).toHaveBeenCalledWith({
      scope: expect.objectContaining({
        workspaceId: "app_workspace",
        functionId: "fn_function",
        executionUser: {
          userId: "us_user",
          email: "builder@example.com",
        },
      }),
      capability,
      parameters: { status: "active" },
    })
    expect(meterQuery).toHaveBeenCalledTimes(1)
  })

  it.each([
    ["a guessed capability", { capabilityId: "cap_guessed" }],
    ["an object prototype property", { capabilityId: "toString" }],
    ["the object prototype setter", { capabilityId: "__proto__" }],
    ["a direct saved query ID", { capabilityId: "query_customers" }],
    ["an unknown parameter", { parameters: { secret: "value" } }],
    ["a non-string parameter", { parameters: { status: 1 } }],
    ["another run", { runId: "run_other" }],
  ])("denies %s before query execution", async (_name, extra) => {
    const executeQuery = jest.fn(async () => ({}))
    const service = createService(scope(), { executeQuery })

    await expect(
      service.invokeCapability(request(extra))
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
      message: "Function query denied",
    })
    expect(executeQuery).not.toHaveBeenCalled()
    expect(meterQuery).not.toHaveBeenCalled()
  })

  it("denies calls after the deadline or invocation closes", async () => {
    const expiredScope = { ...scope(), deadline: Date.now() - 1 }
    const expiredService = createService(expiredScope, {
      executeQuery: async () => ({}),
    })
    await expect(
      expiredService.invokeCapability(request())
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
    })

    const closedService = createService(scope(), {
      executeQuery: async () => ({}),
    })
    closedService.close()
    await expect(
      closedService.invokeCapability(request())
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
    })
    expect(meterQuery).not.toHaveBeenCalled()
  })

  it("enforces the total query budget", async () => {
    const service = createService(scope({ ...limits, maxQueryCalls: 1 }), {
      executeQuery: async () => ({ data: [] }),
    })

    await expect(service.invokeCapability(request())).resolves.toEqual({
      data: [],
    })
    await expect(service.invokeCapability(request())).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_LIMIT,
    })
    expect(meterQuery).toHaveBeenCalledTimes(1)
  })

  it("atomically enforces concurrent query limits", async () => {
    let releaseQuery!: (value: object) => void
    let markStarted!: () => void
    const queryStarted = new Promise<void>(resolve => {
      markStarted = resolve
    })
    const queryResult = new Promise<object>(resolve => {
      releaseQuery = resolve
    })
    const executeQuery = async () => {
      markStarted()
      return queryResult
    }
    const service = createService(
      scope({ ...limits, maxConcurrentQueryCalls: 1 }),
      { executeQuery }
    )

    const first = service.invokeCapability(request())
    await queryStarted
    await expect(service.invokeCapability(request())).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_LIMIT,
    })
    releaseQuery({ data: [] })
    await expect(first).resolves.toEqual({ data: [] })
    expect(meterQuery).toHaveBeenCalledTimes(1)
  })

  it("meters failed reached queries and logs only bounded metrics", async () => {
    const log = jest.fn()
    const invocationScope = scope()
    let currentTime = 100
    jest.spyOn(Date, "now").mockImplementation(() => currentTime++)
    const service = createService(invocationScope, {
      executeQuery: async () => {
        throw new Error("credential-secret")
      },
      log,
    })

    await expect(service.invokeCapability(request())).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
      message: "Function query failed",
    })
    expect(meterQuery).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenCalledWith({
      capabilityId: capability.capabilityId,
      durationMs: 1,
      responseBytes: 0,
      result: "error",
    })
    expect(JSON.stringify(log.mock.calls)).not.toContain("credential-secret")
    expect(JSON.stringify(log.mock.calls)).not.toContain("active")
  })

  it("rejects oversized and overly deep responses after metering", async () => {
    const service = createService(
      scope({
        ...limits,
        maxQueryResponseBytes: 10,
        maxQueryResponseDepth: 1,
      }),
      { executeQuery: async () => ({ value: "too large" }) }
    )
    await expect(service.invokeCapability(request())).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_LIMIT,
    })

    const deepService = createService(
      scope({
        ...limits,
        maxQueryResponseBytes: 1_024,
        maxQueryResponseDepth: 1,
      }),
      { executeQuery: async () => ({ nested: { value: 1 } }) }
    )
    await expect(deepService.invokeCapability(request())).rejects.toMatchObject(
      {
        code: FunctionErrorCode.FUNCTION_QUERY_LIMIT,
      }
    )
    expect(meterQuery).toHaveBeenCalledTimes(2)
  })

  it("denies an aborted capability call without metering", async () => {
    const abortController = new AbortController()
    abortController.abort()
    const service = createService(scope(), {
      executeQuery: async () => ({}),
    })

    await expect(
      service.invokeCapability(request({ signal: abortController.signal }))
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
    })
    expect(meterQuery).not.toHaveBeenCalled()
  })

  it("normalizes query responses before returning them to the isolate", async () => {
    const response: Record<string, JSONValue | undefined> = {
      data: [{ id: "row-1" }],
      omitted: undefined,
    }
    const service = createService(scope(), {
      executeQuery: async () => response,
    })

    await expect(service.invokeCapability(request())).resolves.toEqual({
      data: [{ id: "row-1" }],
    })
  })
})
