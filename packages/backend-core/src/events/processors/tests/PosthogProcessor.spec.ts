import PosthogProcessor from "../PosthogProcessor"
import { Event, IdentityType, Hosting } from "@budibase/types"

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
    it("processes event", () => {
      const processor = new PosthogProcessor("test")

      const identity = newIdentity()
      const properties = {}

      processor.processEvent(Event.APP_CREATED, identity, properties)

      expect(processor.posthog.capture).toHaveBeenCalledTimes(1)
    })

    it("honours exclusions", () => {
      const processor = new PosthogProcessor("test")

      const identity = newIdentity()
      const properties = {}

      processor.processEvent(Event.AUTH_SSO_UPDATED, identity, properties)
      expect(processor.posthog.capture).toHaveBeenCalledTimes(0)
    })
  })
})
