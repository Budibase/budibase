import { context } from "@budibase/backend-core"
import {
  DocumentType,
  EscalationAction,
  EscalationContextDoc,
  EscalationNotificationChannel,
  EscalationRecipient,
  EscalationResponse,
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

describe("respond with approvers", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  const A = EscalationAction.APPROVE
  const R = EscalationAction.REJECT
  const users = ["us_1", "us_2", "us_3", "us_4", "us_5"]
  const docId = (escalationId: string) =>
    `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`

  const seed = async ({
    escalationId,
    approvers,
    strategy,
  }: {
    escalationId: string
    approvers: string[]
    strategy?: ResolutionStrategy
  }) => {
    const db = context.getWorkspaceDB()
    await db.put({
      _id: docId(escalationId),
      source: EscalationSource.OPERATION,
      appId: config.getProdWorkspaceId(),
      tenantId: config.getTenantId(),
      delay: 0,
      resolution: "pending",
      recipients: [{ type: EscalationNotificationChannel.SLACK, config: {} }],
      resolutionStrategy: resolutionStrategyBinding(
        strategy ?? ResolutionStrategy.FIRST_RESPONSE
      ),
      policy: {
        id: "policy-1",
        name: "Test policy",
        approvers,
        ...(strategy ? { approvalType: strategy } : {}),
      },
    })
    const notificationDocId = `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}${escalationId}-notif`
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

  // Mirrors the processor: marks the doc resolved so later presses see it closed.
  const resolver = () =>
    jest.fn(async (escalationId: string, response: EscalationResponse) => {
      const db = context.getWorkspaceDB()
      const doc = await getDoc(escalationId)
      await db.put({ ...doc, resolution: "resolved", response })
    })

  const getDoc = async (escalationId: string) => {
    const doc = await context
      .getWorkspaceDB()
      .tryGet<EscalationContextDoc>(docId(escalationId))
    if (!doc) {
      throw new Error(`missing ${escalationId}`)
    }
    return doc
  }

  const approvalsOf = async (escalationId: string) => {
    const doc = await getDoc(escalationId)
    return (doc.approvals ?? []).map(a => `${a.userId}:${a.actionId}`)
  }

  const press = (
    escalationId: string,
    notificationDocId: string,
    userId: string | undefined,
    actionId: string,
    resolve: ReturnType<typeof resolver>
  ) =>
    respond(
      escalationId,
      notificationDocId,
      {
        actionId,
        user: { userId: `slack-${userId ?? "unknown"}` },
        ...(userId ? { userId } : {}),
      },
      resolve
    )

  const runPresses = async ({
    escalationId,
    approvers,
    strategy,
    presses,
  }: {
    escalationId: string
    approvers: string[]
    strategy?: ResolutionStrategy
    presses: [string | undefined, string][]
  }) => {
    const notificationDocId = await seed({ escalationId, approvers, strategy })
    const resolve = resolver()
    const statuses: string[] = []
    for (const [userId, actionId] of presses) {
      const result = await press(
        escalationId,
        notificationDocId,
        userId,
        actionId,
        resolve
      )
      statuses.push(result.status)
    }
    return { resolve, statuses, approvals: await approvalsOf(escalationId) }
  }

  it("any: the first approver resolves and later presses are closed", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { resolve, statuses, approvals } = await runPresses({
        escalationId: "esc-any",
        approvers: users.slice(0, 2),
        presses: [
          [users[0], A],
          [users[1], A],
        ],
      })
      expect(statuses).toEqual(["recorded", "closed"])
      expect(resolve).toHaveBeenCalledTimes(1)
      expect(resolve).toHaveBeenCalledWith(
        "esc-any",
        expect.objectContaining({ accepted: true })
      )
      expect(approvals).toEqual([`${users[0]}:${A}`])
    })
  })

  it("unanimous: waits for every approver", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { resolve, statuses, approvals } = await runPresses({
        escalationId: "esc-unanimous",
        approvers: users.slice(0, 2),
        strategy: ResolutionStrategy.UNANIMOUS,
        presses: [
          [users[0], A],
          [users[1], A],
        ],
      })
      expect(statuses).toEqual(["recorded", "recorded"])
      expect(resolve).toHaveBeenCalledTimes(1)
      expect(resolve).toHaveBeenCalledWith(
        "esc-unanimous",
        expect.objectContaining({ accepted: true })
      )
      expect(approvals).toHaveLength(2)
    })
  })

  it("unanimous: a single reject resolves immediately", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { resolve, statuses, approvals } = await runPresses({
        escalationId: "esc-unanimous-reject",
        approvers: users.slice(0, 3),
        strategy: ResolutionStrategy.UNANIMOUS,
        presses: [
          [users[0], A],
          [users[1], R],
          [users[2], A],
        ],
      })
      expect(statuses).toEqual(["recorded", "recorded", "closed"])
      expect(resolve).toHaveBeenCalledTimes(1)
      expect(resolve).toHaveBeenCalledWith(
        "esc-unanimous-reject",
        expect.objectContaining({ accepted: false })
      )
      expect(approvals).toHaveLength(2)
    })
  })

  it("unanimous: a reject on the last vote resolves as rejected", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { resolve, statuses } = await runPresses({
        escalationId: "esc-unanimous-last",
        approvers: users.slice(0, 3),
        strategy: ResolutionStrategy.UNANIMOUS,
        presses: [
          [users[0], A],
          [users[1], A],
          [users[2], R],
        ],
      })
      expect(statuses).toEqual(["recorded", "recorded", "recorded"])
      expect(resolve).toHaveBeenCalledTimes(1)
      expect(resolve).toHaveBeenCalledWith(
        "esc-unanimous-last",
        expect.objectContaining({ accepted: false })
      )
    })
  })

  it("dedupes repeat presses and keeps the first answer", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { resolve, statuses, approvals } = await runPresses({
        escalationId: "esc-repeat",
        approvers: users.slice(0, 2),
        strategy: ResolutionStrategy.UNANIMOUS,
        presses: [
          [users[0], A],
          [users[0], A],
          [users[0], R],
          [users[1], A],
        ],
      })
      expect(statuses).toEqual([
        "recorded",
        "already_responded",
        "already_responded",
        "recorded",
      ])
      expect(approvals).toEqual([`${users[0]}:${A}`, `${users[1]}:${A}`])
      expect(resolve).toHaveBeenCalledWith(
        "esc-repeat",
        expect.objectContaining({ accepted: true })
      )
    })
  })

  it.each([
    ["3 early", 3, [A, A], true, 2],
    ["3 late", 3, [A, R, A], true, 3],
    ["5 reject early", 5, [R, R, R], false, 3],
    ["5 reject late", 5, [R, A, R, A, R], false, 5],
    ["5 comeback", 5, [A, R, A, R, R], false, 5],
    ["5 late", 5, [A, R, A, R, A], true, 5],
    ["4 even split", 4, [A, R, A, R], false, 4],
  ])("majority %s", async (label, total, actions, accepted, resolvingPress) => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const escalationId = `esc-majority-${label.replace(/\s/g, "-")}`
      const { resolve, statuses } = await runPresses({
        escalationId,
        approvers: users.slice(0, total),
        strategy: ResolutionStrategy.MAJORITY,
        presses: actions.map(
          (actionId, i) => [users[i], actionId] as [string, string]
        ),
      })
      expect(statuses.slice(0, resolvingPress)).toEqual(
        Array(resolvingPress).fill("recorded")
      )
      expect(resolve).toHaveBeenCalledTimes(1)
      expect(resolve).toHaveBeenCalledWith(
        escalationId,
        expect.objectContaining({ accepted })
      )
    })
  })

  it("ignores a linked user who is not an approver", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { resolve, statuses, approvals } = await runPresses({
        escalationId: "esc-bystander",
        approvers: users.slice(0, 2),
        strategy: ResolutionStrategy.UNANIMOUS,
        presses: [
          [users[2], A],
          [users[0], A],
          [users[1], A],
        ],
      })
      expect(statuses).toEqual(["recorded", "recorded", "recorded"])
      expect(approvals).toEqual([`${users[0]}:${A}`, `${users[1]}:${A}`])
      expect(resolve).toHaveBeenCalledTimes(1)
    })
  })

  it("ignores a press with no resolved user", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { resolve, statuses, approvals } = await runPresses({
        escalationId: "esc-unlinked",
        approvers: users.slice(0, 2),
        strategy: ResolutionStrategy.UNANIMOUS,
        presses: [[undefined, A]],
      })
      expect(statuses).toEqual(["unlinked"])
      expect(approvals).toEqual([])
      expect(resolve).not.toHaveBeenCalled()
    })
  })

  it("ignores an unknown action id from an approver", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { resolve, statuses, approvals } = await runPresses({
        escalationId: "esc-bad-action",
        approvers: users.slice(0, 2),
        strategy: ResolutionStrategy.UNANIMOUS,
        presses: [
          [users[0], "constructor"],
          [users[1], A],
        ],
      })
      expect(statuses).toEqual(["recorded", "recorded"])
      expect(approvals).toEqual([`${users[1]}:${A}`])
      expect(resolve).not.toHaveBeenCalled()
    })
  })

  it("counts an approver who links after pressing", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const escalationId = "esc-link-later"
      const notificationDocId = await seed({
        escalationId,
        approvers: users.slice(0, 2),
        strategy: ResolutionStrategy.UNANIMOUS,
      })
      const resolve = resolver()
      const slackUser = { userId: "slack-late" }

      const unlinked = await respond(
        escalationId,
        notificationDocId,
        { actionId: A, user: slackUser },
        resolve
      )
      const linked = await respond(
        escalationId,
        notificationDocId,
        { actionId: A, user: slackUser, userId: users[1] },
        resolve
      )
      await press(escalationId, notificationDocId, users[0], A, resolve)

      expect(unlinked.status).toEqual("unlinked")
      expect(linked.status).toEqual("recorded")
      expect(await approvalsOf(escalationId)).toEqual([
        `${users[1]}:${A}`,
        `${users[0]}:${A}`,
      ])
      expect(resolve).toHaveBeenCalledWith(
        escalationId,
        expect.objectContaining({ accepted: true })
      )
    })
  })

  it("returns closed for a press after resolution", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { resolve, statuses, approvals } = await runPresses({
        escalationId: "esc-closed",
        approvers: users.slice(0, 2),
        presses: [
          [users[0], R],
          [users[1], A],
        ],
      })
      expect(statuses).toEqual(["recorded", "closed"])
      expect(approvals).toEqual([`${users[0]}:${R}`])
      expect(resolve).toHaveBeenCalledTimes(1)
      expect(resolve).toHaveBeenCalledWith(
        "esc-closed",
        expect.objectContaining({ accepted: false })
      )
    })
  })

  it("falls back to first response when the policy has no approvers", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { resolve, statuses, approvals } = await runPresses({
        escalationId: "esc-zero",
        approvers: [],
        presses: [[undefined, A]],
      })
      expect(statuses).toEqual(["recorded"])
      expect(approvals).toEqual([])
      expect(resolve).toHaveBeenCalledWith(
        "esc-zero",
        expect.objectContaining({ accepted: true })
      )
    })
  })

  it("concurrent unanimous presses all land", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const escalationId = "esc-concurrent-unanimous"
      const notificationDocId = await seed({
        escalationId,
        approvers: users,
        strategy: ResolutionStrategy.UNANIMOUS,
      })
      const resolve = resolver()
      const results = await Promise.all(
        users.map(userId =>
          press(escalationId, notificationDocId, userId, A, resolve)
        )
      )
      expect(results.map(r => r.status)).toEqual(Array(5).fill("recorded"))
      expect(await approvalsOf(escalationId)).toHaveLength(5)
      expect(resolve).toHaveBeenCalledTimes(1)
    })
  })

  it("concurrent majority presses stop at the quorum", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const escalationId = "esc-concurrent-majority"
      const notificationDocId = await seed({
        escalationId,
        approvers: users,
        strategy: ResolutionStrategy.MAJORITY,
      })
      const resolve = resolver()
      const results = await Promise.all(
        users.map(userId =>
          press(escalationId, notificationDocId, userId, A, resolve)
        )
      )
      expect(results.map(r => r.status).sort()).toEqual([
        "closed",
        "closed",
        "recorded",
        "recorded",
        "recorded",
      ])
      expect(await approvalsOf(escalationId)).toHaveLength(3)
      expect(resolve).toHaveBeenCalledTimes(1)
    })
  })
})
