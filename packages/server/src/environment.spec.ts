import { DEFAULT_FUNCTION_LIMITS, type FunctionLimits } from "@budibase/types"
import { getConfiguredFunctionLimits } from "./environment"

describe("getConfiguredFunctionLimits", () => {
  it("returns the shared defaults when no overrides are configured", () => {
    expect(getConfiguredFunctionLimits({})).toEqual(DEFAULT_FUNCTION_LIMITS)
  })

  it("applies positive integer environment overrides", () => {
    const limits = getConfiguredFunctionLimits({
      BUDIBASE_FUNCTIONS_COMPILE_MEMORY_LIMIT_MB: "512",
      BUDIBASE_FUNCTIONS_RUN_TIMEOUT_MS: "60000",
      BUDIBASE_FUNCTIONS_SERVICE_MAX_CONCURRENT_RUNS: "8",
    })

    const expected: FunctionLimits = {
      ...DEFAULT_FUNCTION_LIMITS,
      compile: {
        ...DEFAULT_FUNCTION_LIMITS.compile,
        memoryLimitMb: 512,
      },
      run: {
        ...DEFAULT_FUNCTION_LIMITS.run,
        timeoutMs: 60000,
      },
      service: {
        ...DEFAULT_FUNCTION_LIMITS.service,
        maxConcurrentRuns: 8,
      },
    }

    expect(limits).toEqual(expected)
  })

  it("uses defaults for invalid or non-positive overrides", () => {
    const limits = getConfiguredFunctionLimits({
      BUDIBASE_FUNCTIONS_COMPILE_MEMORY_LIMIT_MB: "false",
      BUDIBASE_FUNCTIONS_RUN_TIMEOUT_MS: "0",
      BUDIBASE_FUNCTIONS_SERVICE_MAX_CONCURRENT_RUNS: "1.5",
    })

    expect(limits).toEqual(DEFAULT_FUNCTION_LIMITS)
  })
})
