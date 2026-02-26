import { runWithReasoningEffortFallback } from "./reasoningFallback"

describe("runWithReasoningEffortFallback", () => {
  it("runs once when reasoning effort is not configured", async () => {
    const run = jest.fn().mockResolvedValue("ok")

    const result = await runWithReasoningEffortFallback({
      providerOptions: undefined,
      run,
    })

    expect(result).toBe("ok")
    expect(run).toHaveBeenCalledTimes(1)
    expect(run).toHaveBeenCalledWith(undefined)
  })

  it("retries without reasoning effort on unsupported reasoning errors", async () => {
    const run = jest
      .fn()
      .mockRejectedValueOnce(
        new Error("reasoning is unsupported for this model")
      )
      .mockResolvedValueOnce("ok")

    const result = await runWithReasoningEffortFallback({
      providerOptions: {
        openai: {
          reasoningEffort: "low",
        },
      },
      run,
    })

    expect(result).toBe("ok")
    expect(run).toHaveBeenCalledTimes(2)
    expect(run).toHaveBeenNthCalledWith(1, {
      openai: { reasoningEffort: "low" },
    })
    expect(run).toHaveBeenNthCalledWith(2, {
      openai: {},
    })
  })

  it("does not retry when the error is unrelated to reasoning effort", async () => {
    const run = jest.fn().mockRejectedValue(new Error("request timed out"))

    await expect(
      runWithReasoningEffortFallback({
        providerOptions: {
          openai: {
            reasoningEffort: "low",
          },
        },
        run,
      })
    ).rejects.toThrow("request timed out")

    expect(run).toHaveBeenCalledTimes(1)
  })
})
