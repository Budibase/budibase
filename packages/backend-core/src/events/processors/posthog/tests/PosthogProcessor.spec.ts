import { testEnv } from "../../../../../tests/extra"
import PosthogProcessor from "../PosthogProcessor"
import { Event, IdentityType, Hosting } from "@budibase/types"
const tk = require("timekeeper")
import * as cache from "../../../../cache/generic"
import { CacheKey } from "../../../../cache/generic"
import * as context from "../../../../context"

const newIdentity = () => {
  return {
    id: "test",
    type: IdentityType.USER,
    hosting: Hosting.SELF,
    environment: "test",
  }
}

describe("PosthogProcessor", () => {
  beforeAll(() => {
    testEnv.singleTenant()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    await cache.bustCache(
      `${CacheKey.EVENTS_RATE_LIMIT}:${Event.SERVED_BUILDER}`
    )
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

    it("removes audited information", async () => {
      const processor = new PosthogProcessor("test")

      const identity = newIdentity()
      const properties = {
        email: "test",
        audited: {
          name: "test",
        },
      }

      await processor.processEvent(Event.USER_CREATED, identity, properties)
      expect(processor.posthog.capture).toHaveBeenCalled()
      // @ts-ignore
      const call = processor.posthog.capture.mock.calls[0][0]
      expect(call.properties.audited).toBeUndefined()
      expect(call.properties.email).toBeUndefined()
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

        expect(processor.posthog.capture).toHaveBeenCalledTimes(3)
      })

      it("sends event again after cache expires", async () => {
        const processor = new PosthogProcessor("test")
        const identity = newIdentity()
        const properties = {}

        tk.freeze(new Date(2022, 0, 1, 14, 0))
        await processor.processEvent(Event.SERVED_BUILDER, identity, properties)

        await cache.bustCache(
          `${CacheKey.EVENTS_RATE_LIMIT}:${Event.SERVED_BUILDER}`
        )

        tk.freeze(new Date(2022, 0, 1, 14, 0))
        await processor.processEvent(Event.SERVED_BUILDER, identity, properties)

        expect(processor.posthog.capture).toHaveBeenCalledTimes(2)
      })

      it("sends per app events once per day per app", async () => {
        const processor = new PosthogProcessor("test")
        const identity = newIdentity()
        const properties = {}

        const runAppEvents = async (appId: string) => {
          await context.doInAppContext(appId, async () => {
            tk.freeze(new Date(2022, 0, 1, 14, 0))
            await processor.processEvent(Event.SERVED_APP, identity, properties)
            await processor.processEvent(
              Event.SERVED_APP_PREVIEW,
              identity,
              properties
            )

            // go forward one hour - should be ignored
            tk.freeze(new Date(2022, 0, 1, 15, 0))
            await processor.processEvent(Event.SERVED_APP, identity, properties)
            await processor.processEvent(
              Event.SERVED_APP_PREVIEW,
              identity,
              properties
            )

            // go forward into next day
            tk.freeze(new Date(2022, 0, 2, 9, 0))

            await processor.processEvent(Event.SERVED_APP, identity, properties)
            await processor.processEvent(
              Event.SERVED_APP_PREVIEW,
              identity,
              properties
            )
          })
        }

        await runAppEvents("app_1")
        expect(processor.posthog.capture).toHaveBeenCalledTimes(4)

        await runAppEvents("app_2")
        expect(processor.posthog.capture).toHaveBeenCalledTimes(8)
      })
    })
  })
})
