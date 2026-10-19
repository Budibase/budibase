import { Event, Hosting, Identity, IdentityType } from "@budibase/types"
import tk from "timekeeper"
import { publishEvent } from "./events"
import identification from "./identification"
import { processors } from "./processors"
import { publishAsyncEvent } from "./asyncEvents"
import * as backfill from "./backfill"

jest.mock("./processors", () => ({
  processors: { processEvent: jest.fn().mockResolvedValue(undefined) },
}))
jest.mock("./asyncEvents", () => ({
  publishAsyncEvent: jest.fn().mockResolvedValue(undefined),
}))
jest.mock("./backfill", () => ({
  isBackfillingEvent: jest.fn().mockResolvedValue(false),
  isAlreadySent: jest.fn().mockResolvedValue(false),
  recordEvent: jest.fn().mockResolvedValue(undefined),
}))

describe("publishEvent timestamps", () => {
  const publishedAt = "2026-10-16T10:00:00.000Z"
  const identity: Identity = {
    id: "test-tenant",
    type: IdentityType.TENANT,
    hosting: Hosting.CLOUD,
    environment: "production",
  }
  let originalTime: Date

  beforeEach(() => {
    originalTime = new Date()
    jest.clearAllMocks()
    tk.freeze(new Date(publishedAt))
    jest
      .spyOn(identification, "getCurrentIdentity")
      .mockImplementation(async () => {
        tk.freeze(new Date("2026-10-16T10:00:05.000Z"))
        return identity
      })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    tk.freeze(originalTime)
  })

  it.each([Event.ACTION_AI_AGENT_EXECUTED, Event.WORKSPACE_CREATED])(
    "captures %s publication time before resolving identity",
    async event => {
      await publishEvent(event, {})

      expect(publishAsyncEvent).toHaveBeenCalledWith({
        event,
        identity,
        properties: {},
        timestamp: publishedAt,
      })
      expect(processors.processEvent).toHaveBeenCalledWith(
        event,
        identity,
        {},
        publishedAt
      )
    }
  )

  it.each([0, 1700000000000, "2020-01-01T00:00:00.000Z"])(
    "preserves explicit timestamp %s",
    async timestamp => {
      await publishEvent(Event.WORKSPACE_CREATED, {}, timestamp)

      expect(publishAsyncEvent).toHaveBeenCalledWith({
        event: Event.WORKSPACE_CREATED,
        identity,
        properties: {},
        timestamp,
      })
      expect(processors.processEvent).toHaveBeenCalledWith(
        Event.WORKSPACE_CREATED,
        identity,
        {},
        timestamp
      )
    }
  )

  it("preserves historical timestamps during backfill", async () => {
    jest.mocked(backfill.isBackfillingEvent).mockResolvedValueOnce(true)
    const timestamp = "2020-01-01T00:00:00.000Z"

    await publishEvent(Event.WORKSPACE_CREATED, {}, timestamp)

    expect(processors.processEvent).toHaveBeenCalledWith(
      Event.WORKSPACE_CREATED,
      identity,
      {},
      timestamp
    )
    expect(publishAsyncEvent).not.toHaveBeenCalled()
    expect(backfill.recordEvent).toHaveBeenCalledWith(
      Event.WORKSPACE_CREATED,
      {}
    )
  })
})
