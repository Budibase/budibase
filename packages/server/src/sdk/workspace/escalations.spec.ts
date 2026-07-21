import { context } from "@budibase/backend-core"
import {
  DocumentType,
  EscalationAction,
  EscalationNotificationChannel,
  EscalationRecipient,
  EscalationSource,
  ResolutionStrategy,
  SEPARATOR,
} from "@budibase/types"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { resolveRecipientLabel, respond } from "./escalations"
import { resolutionStrategyBinding } from "../../escalation/resolutionStrategies"

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

describe("respond", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  const seedPendingEscalation = async (escalationId: string) => {
    const db = context.getWorkspaceDB()
    await db.put({
      _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`,
      source: EscalationSource.OPERATION,
      appId: config.getProdWorkspaceId(),
      tenantId: config.getTenantId(),
      delay: 0,
      resolution: "pending",
      resolutionStrategy: resolutionStrategyBinding(
        ResolutionStrategy.FIRST_RESPONSE
      ),
    })
    const notificationDocId = `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}notif-1`
    await db.put({
      _id: notificationDocId,
      escalationId,
      appId: config.getProdWorkspaceId(),
      tenantId: config.getTenantId(),
      recipient: { type: EscalationNotificationChannel.SLACK, config: {} },
      sentAt: new Date().toISOString(),
    })
    return notificationDocId
  }

  it("does not resolve when the action id is an inherited object property", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const escalationId = "esc-proto"
      const notificationDocId = await seedPendingEscalation(escalationId)
      const resolve = jest.fn()

      const result = await respond(
        escalationId,
        notificationDocId,
        { actionId: "constructor" },
        resolve
      )

      expect(resolve).not.toHaveBeenCalled()
      expect(result.status).toEqual("recorded")
    })
  })

  it("resolves as approved for the canonical approve action", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const escalationId = "esc-approve"
      const notificationDocId = await seedPendingEscalation(escalationId)
      const resolve = jest.fn()

      await respond(
        escalationId,
        notificationDocId,
        { actionId: EscalationAction.APPROVE },
        resolve
      )

      expect(resolve).toHaveBeenCalledWith(escalationId, {
        accepted: true,
        actionId: EscalationAction.APPROVE,
      })
    })
  })

  it("rejects a notification that belongs to a different escalation", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const escalationId = "esc-target"
      await db.put({
        _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`,
        source: EscalationSource.OPERATION,
        appId: config.getProdWorkspaceId(),
        tenantId: config.getTenantId(),
        delay: 0,
        resolution: "pending",
      })
      const notificationDocId = `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}notif-1`
      await db.put({
        _id: notificationDocId,
        escalationId: "esc-other",
        appId: config.getProdWorkspaceId(),
        tenantId: config.getTenantId(),
        recipient: {
          type: EscalationNotificationChannel.SLACK,
          config: {},
        },
        sentAt: new Date().toISOString(),
      })
      const resolve = jest.fn()

      await expect(
        respond(escalationId, notificationDocId, { accepted: true }, resolve)
      ).rejects.toThrow(
        `Notification ${notificationDocId} does not belong to escalation ${escalationId}`
      )
      expect(resolve).not.toHaveBeenCalled()
    })
  })
})
