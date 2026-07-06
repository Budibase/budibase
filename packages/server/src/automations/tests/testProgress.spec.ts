import {
  clearTestProgress,
  getTestProgress,
  recordTestProgress,
  stopCleanup,
} from "../testProgress"

describe("automation test progress cache", () => {
  const appId = "app1"
  const automationId = "auto1"
  const userId = "user1"

  afterEach(() => {
    clearTestProgress(appId, automationId)
    clearTestProgress(appId, automationId, userId)
    clearTestProgress(appId, automationId, "user2")
  })

  afterAll(() => {
    stopCleanup()
  })

  it("records step progress and exposes it via getter", () => {
    const occurredAt = Date.now()
    recordTestProgress(appId, automationId, {
      automationId,
      appId,
      blockId: "block-1",
      stepId: "STEP",
      status: "running",
      occurredAt,
    })

    const state = getTestProgress(appId, automationId)
    expect(state?.events["block-1"]).toBeDefined()
    expect(state?.events["block-1"].status).toEqual("running")
  })

  it("clears stored progress", () => {
    recordTestProgress(appId, automationId, {
      automationId,
      appId,
      blockId: "block-1",
      stepId: "STEP",
      status: "success",
      occurredAt: Date.now(),
    })

    clearTestProgress(appId, automationId)
    const state = getTestProgress(appId, automationId)
    expect(state).toBeUndefined()
  })

  it("isolates progress by user", () => {
    recordTestProgress(
      appId,
      automationId,
      {
        automationId,
        appId,
        blockId: "block-1",
        stepId: "STEP",
        status: "success",
        occurredAt: Date.now(),
      },
      userId
    )

    expect(getTestProgress(appId, automationId, userId)).toBeDefined()
    expect(getTestProgress(appId, automationId, "user2")).toBeUndefined()
  })
})
