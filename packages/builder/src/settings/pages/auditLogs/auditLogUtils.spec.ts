import { describe, expect, it, vi } from "vitest"
import { createLatestRequestQueue } from "./auditLogUtils"

describe("createLatestRequestQueue", () => {
  it("runs the latest pending query after the active request", async () => {
    let finishFirst = () => {}
    const firstRequest = new Promise<void>(resolve => {
      finishFirst = resolve
    })
    const run = vi
      .fn<(query: string) => Promise<void>>()
      .mockReturnValueOnce(firstRequest)
      .mockResolvedValue(undefined)
    const queue = createLatestRequestQueue(run)

    const activeRequest = queue("first")
    await vi.waitFor(() => expect(run).toHaveBeenCalledWith("first"))
    await queue("superseded")
    await queue("latest")
    finishFirst()
    await activeRequest

    expect(run).toHaveBeenCalledTimes(2)
    expect(run).toHaveBeenLastCalledWith("latest")
  })
})
