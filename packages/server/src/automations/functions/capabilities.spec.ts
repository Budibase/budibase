import { quotas } from "@budibase/pro"
import { ActionType, FunctionErrorCode } from "@budibase/types"
import type {
  FunctionCapabilityRequest,
  FunctionRunLimits,
  JSONValue,
} from "@budibase/types"
import {
  createFunctionInvocationScope,
  FunctionCapabilityService,
} from "./capabilities"
import { FUNCTION_RUN_REQUEST_FIXTURE } from "./testFixtures"

jest.mock("@budibase/pro", () => ({
  quotas: {
    addAction: jest.fn(),
  },
}))

describe("FunctionCapabilityService", () => {
  const addAction = jest.mocked(quotas.addAction)
  const capability = {
    capabilityId: "cap_customers",
    queryId: "query_customers",
    datasourceAlias: "CRM",
    queryAlias: "getCustomers",
    parameterNames: ["status"],
  }
  const limits: FunctionRunLimits = {
    ...FUNCTION_RUN_REQUEST_FIXTURE.limits,
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

  beforeEach(() => {
    addAction.mockReset()
    addAction.mockImplementation(
      async (_actionType, addActionFn) => await addActionFn()
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("copies and freezes the capability allow-list for the invocation", () => {
    const invocationScope = scope()

    expect(Object.isFrozen(invocationScope.capabilities)).toBe(true)
    expect(Object.isFrozen(invocationScope.capabilities.cap_customers)).toBe(
      true
    )
    expect(
      Object.isFrozen(invocationScope.capabilities.cap_customers.parameterNames)
    ).toBe(true)
  })

  it("executes the saved query mapped by the capability", async () => {
    const executeQuery = jest.fn(async () => ({ data: [{ id: "row-1" }] }))
    const service = new FunctionCapabilityService(scope(), { executeQuery })

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
    expect(addAction).toHaveBeenCalledWith(
      ActionType.AUTOMATION_STEP,
      expect.any(Function)
    )
  })

  it.each([
    ["a guessed capability", { capabilityId: "cap_guessed" }],
    ["a direct saved query ID", { capabilityId: "query_customers" }],
    ["an unknown parameter", { parameters: { secret: "value" } }],
    ["a non-string parameter", { parameters: { status: 1 } }],
    ["another run", { runId: "run_other" }],
  ])("denies %s before query execution", async (_name, extra) => {
    const executeQuery = jest.fn(async () => ({}))
    const service = new FunctionCapabilityService(scope(), { executeQuery })

    await expect(
      service.invokeCapability(request(extra))
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
      message: "Function query denied",
    })
    expect(executeQuery).not.toHaveBeenCalled()
    expect(addAction).not.toHaveBeenCalled()
  })

  it("denies calls after the deadline or invocation closes", async () => {
    const expiredScope = { ...scope(), deadline: Date.now() - 1 }
    const expiredService = new FunctionCapabilityService(expiredScope, {
      executeQuery: async () => ({}),
    })
    await expect(
      expiredService.invokeCapability(request())
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
    })

    const closedService = new FunctionCapabilityService(scope(), {
      executeQuery: async () => ({}),
    })
    closedService.close()
    await expect(
      closedService.invokeCapability(request())
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
    })
    expect(addAction).not.toHaveBeenCalled()
  })

  it("enforces the total query budget", async () => {
    const service = new FunctionCapabilityService(
      scope({ ...limits, maxQueryCalls: 1 }),
      { executeQuery: async () => ({ data: [] }) }
    )

    await expect(service.invokeCapability(request())).resolves.toEqual({
      data: [],
    })
    await expect(service.invokeCapability(request())).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_LIMIT,
    })
    expect(addAction).toHaveBeenCalledTimes(1)
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
    const service = new FunctionCapabilityService(
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
    expect(addAction).toHaveBeenCalledTimes(1)
  })

  it("meters failed reached queries and logs only bounded metrics", async () => {
    const log = jest.fn()
    const invocationScope = scope()
    jest
      .spyOn(Date, "now")
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(101)
      .mockReturnValueOnce(102)
    const service = new FunctionCapabilityService(invocationScope, {
      executeQuery: async () => {
        throw new Error("credential-secret")
      },
      log,
    })

    await expect(service.invokeCapability(request())).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
      message: "Function query failed",
    })
    expect(addAction).toHaveBeenCalledTimes(1)
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
    const service = new FunctionCapabilityService(
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

    const deepService = new FunctionCapabilityService(
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
    expect(addAction).toHaveBeenCalledTimes(2)
  })

  it("denies an aborted capability call without metering", async () => {
    const abortController = new AbortController()
    abortController.abort()
    const service = new FunctionCapabilityService(scope(), {
      executeQuery: async () => ({}),
    })

    await expect(
      service.invokeCapability(request({ signal: abortController.signal }))
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
    })
    expect(addAction).not.toHaveBeenCalled()
  })

  it("normalizes query responses before returning them to the isolate", async () => {
    const response: Record<string, JSONValue | undefined> = {
      data: [{ id: "row-1" }],
      omitted: undefined,
    }
    const service = new FunctionCapabilityService(scope(), {
      executeQuery: async () => response,
    })

    await expect(service.invokeCapability(request())).resolves.toEqual({
      data: [{ id: "row-1" }],
    })
  })
})
