import {
  EscalationNotificationChannel,
  EscalationRecipient,
} from "@budibase/types"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { resolveRecipientLabel } from "./escalations"

describe("resolveRecipientLabel", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  const channelRecipient = (
    config: Record<string, any>
  ): EscalationRecipient => ({
    type: EscalationNotificationChannel.SLACK,
    config,
  })

  it("uses the channel name when present", async () => {
    const recipient = channelRecipient({
      channelId: "C123",
      channelName: "operations",
    })

    await expect(resolveRecipientLabel(recipient)).resolves.toEqual(
      "operations"
    )
  })

  it("falls back to the raw channel id when there is no channel name", async () => {
    const recipient = channelRecipient({ channelId: "C123" })

    await expect(resolveRecipientLabel(recipient)).resolves.toEqual("C123")
  })

  it("resolves a recipient's full name from their Budibase profile", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const user = await config.createUser({
        firstName: "Manolo",
        lastName: "Garcia",
      })
      const recipient = channelRecipient({ globalUserId: user._id })

      await expect(resolveRecipientLabel(recipient)).resolves.toEqual(
        "Manolo Garcia"
      )
    })
  })

  it("falls back to the recipient's email when no name is set", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const user = await config.createUser({ firstName: "", lastName: "" })
      const recipient = channelRecipient({ globalUserId: user._id })

      await expect(resolveRecipientLabel(recipient)).resolves.toEqual(
        user.email
      )
    })
  })

  it("falls back to the raw globalUserId when the user can't be resolved", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const recipient = channelRecipient({ globalUserId: "us_nonexistent" })

      await expect(resolveRecipientLabel(recipient)).resolves.toEqual(
        "us_nonexistent"
      )
    })
  })

  it("returns Unknown when the recipient config has no usable field", async () => {
    const recipient = channelRecipient({})

    await expect(resolveRecipientLabel(recipient)).resolves.toEqual("Unknown")
  })

  it("prefers the channel name over a globalUserId on the same recipient", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const user = await config.createUser({
        firstName: "Manolo",
        lastName: "Garcia",
      })
      const recipient = channelRecipient({
        channelName: "operations",
        globalUserId: user._id,
      })

      await expect(resolveRecipientLabel(recipient)).resolves.toEqual(
        "operations"
      )
    })
  })
})
