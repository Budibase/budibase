import PosthogProcessor from "../PosthogProcessor"
import { Event, IdentityType, Hosting } from "@budibase/types"
const tk = require("timekeeper")
import * as Cache from "../../../../cache/generic"

const newIdentity = () => {
  return {
    id: "test",
    type: IdentityType.USER,
    hosting: Hosting.SELF,
    environment: "test",
  }
}

describe("PosthogProcessor", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("processEvent", () => {
    it("processes event", async () => {
      const processor = new PosthogProcessor("test")

      const identity = newIdentity()
      const properties = {}

      await processor.processEvent(Event.APP_CREATED, identity, properties)

      expect(processor.posthog.capture).toHaveBeenCalledTimes(1)
    })

    it("honours exclusions", async () => {
      const processor = new PosthogProcessor("test")

      const identity = newIdentity()
      const properties = {}

      await processor.processEvent(Event.AUTH_SSO_UPDATED, identity, properties)
      expect(processor.posthog.capture).toHaveBeenCalledTimes(0)
    })

    describe("rate limiting", () => {
      it("sends daily event once in same day", async () => {
        const processor = new PosthogProcessor("test")
        const identity = newIdentity()
        const properties = {}

        tk.freeze(new Date(2022, 0, 1, 14, 0))
        await processor.processEvent(Event.SERVED_BUILDER, identity, properties)
        // go forward one hour
        tk.freeze(new Date(2022, 0, 1, 15, 0))
        await processor.processEvent(Event.SERVED_BUILDER, identity, properties)

        expect(processor.posthog.capture).toHaveBeenCalledTimes(1)
      })

      it("sends daily event once per unique day", async () => {
        const processor = new PosthogProcessor("test")
        const identity = newIdentity()
        const properties = {}

        tk.freeze(new Date(2022, 0, 1, 14, 0))
        await processor.processEvent(Event.SERVED_BUILDER, identity, properties)
        // go forward into next day
        tk.freeze(new Date(2022, 0, 2, 9, 0))
        await processor.processEvent(Event.SERVED_BUILDER, identity, properties)
        // go forward into next day
        tk.freeze(new Date(2022, 0, 3, 5, 0))
        await processor.processEvent(Event.SERVED_BUILDER, identity, properties)
        // go forward one hour
        tk.freeze(new Date(2022, 0, 3, 6, 0))
        await processor.processEvent(Event.SERVED_BUILDER, identity, properties)

        expect(processor.posthog.capture).toHaveBeenCalledTimes(4)
      })

      it("sends event again after cache expires", async () => {
        const processor = new PosthogProcessor("test")
        const identity = newIdentity()
        const properties = {}

        tk.freeze(new Date(2022, 0, 1, 14, 0))
        await processor.processEvent(Event.SERVED_BUILDER, identity, properties)

        await Cache.bustCache(
          `${Cache.CacheKeys.EVENTS_RATE_LIMIT}:${Event.SERVED_BUILDER}`
        )

        tk.freeze(new Date(2022, 0, 1, 14, 0))
        await processor.processEvent(Event.SERVED_BUILDER, identity, properties)

        expect(processor.posthog.capture).toHaveBeenCalledTimes(2)
      })
    })
  })
})
