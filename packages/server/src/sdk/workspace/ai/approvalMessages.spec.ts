import { context } from "@budibase/backend-core"
import {
  DocumentType,
  EscalationAction,
  EscalationNotificationChannel,
  EscalationSource,
  ResolutionStrategy,
  SEPARATOR,
} from "@budibase/types"
import type { Agent, EscalationContextDoc } from "@budibase/types"
import { MockLanguageModelV4 } from "ai/test"
import type { UIMessage } from "ai"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { escalationProcessor } from "../../../escalation/processor"
import { resolutionStrategyBinding } from "../../../escalation/resolutionStrategies"
import { respondToApprovalMessage } from "./approvalMessages"
import { createLLM } from "./llm"

jest.mock("./llm", () => ({ createLLM: jest.fn() }))
jest.mock("../../../escalation/processor", () => ({
  escalationProcessor: { resolve: jest.fn() },
}))

describe("approval messages", () => {
  const config = new TestConfiguration()
  const model = new MockLanguageModelV4()
  const agent: Agent = {
    _id: "agent_1",
    name: "Buyer",
    aiconfig: "config_1",
    operations: [],
  }
  const text = (message?: UIMessage) =>
    message?.parts
      .flatMap(part => (part.type === "text" ? [part.text] : []))
      .join("\n")
  const inputs: Parameters<typeof respondToApprovalMessage>[0] = {
    agent,
    userId: "approver_1",
    sessionId: "slack:conversation_1",
    latestPrompt: "Go ahead, buy it",
    messages: [],
  }
  const createApproval = async ({
    id,
    price,
    approvers = ["approver_1"],
    strategy = ResolutionStrategy.FIRST_RESPONSE,
  }: {
    id: string
    price: number
    approvers?: string[]
    strategy?: ResolutionStrategy
  }) => {
    const db = context.getWorkspaceDB()
    const requestId = `agentrequest_${id}`
    await db.put({
      _id: requestId,
      agentId: "agent_1",
      userId: "requester_1",
      initialPrompt: `Laptop costing ${price}`,
      entries: [],
      status: "needs_input",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    const doc: EscalationContextDoc = {
      _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${id}`,
      appId: config.getProdWorkspaceId(),
      tenantId: config.getTenantId(),
      agentId: "agent_1",
      source: EscalationSource.OPERATION,
      requestId,
      resolution: "pending",
      policy: {
        id: "policy_1",
        name: "Purchase",
        approvers,
        approvalType: strategy,
      },
      resolutionStrategy: resolutionStrategyBinding(strategy),
    }
    await db.put(doc)
  }
  const decide = (decision: object) => {
    model.doGenerate = async () => ({
      content: [{ type: "text", text: JSON.stringify(decision) }],
      finishReason: { unified: "stop", raw: "stop" },
      usage: {
        inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
        outputTokens: { total: 1, text: 1, reasoning: 0 },
      },
      warnings: [],
    })
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    await config.newTenant()
    jest
      .mocked(createLLM)
      .mockResolvedValue({ chat: model, uploadFile: jest.fn() })
    jest.mocked(escalationProcessor.resolve).mockImplementation(async id => {
      const db = context.getWorkspaceDB()
      const doc = await db.get<EscalationContextDoc>(
        `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${id}`
      )
      await db.put({ ...doc, resolution: "resolved" })
    })
  })
  afterAll(() => config.end())

  it("approves the original escalation for an approver who did not create the request", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await createApproval({ id: "esc_200", price: 200 })
      decide({ decision: "approve", escalationId: "esc_200" })
      const result = await respondToApprovalMessage(inputs)
      const doc = await context
        .getWorkspaceDB()
        .get<EscalationContextDoc>("escalation_context_esc_200")
      expect(text(result)).toContain(
        "Your approval was recorded for: Laptop costing 200"
      )
      expect(doc.resolution).toEqual("resolved")
      expect(doc.approvals).toEqual([
        expect.objectContaining({
          userId: "approver_1",
          actionId: EscalationAction.APPROVE,
        }),
      ])
      expect(escalationProcessor.resolve).toHaveBeenCalledTimes(1)
      expect(escalationProcessor.resolve).toHaveBeenCalledWith(
        "esc_200",
        expect.objectContaining({ accepted: true })
      )
    })
  })

  it("asks which laptop to approve, preserves the displayed mapping and never approves twice", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await createApproval({ id: "esc_200", price: 200 })
      await createApproval({ id: "esc_500", price: 500 })
      decide({
        decision: "ambiguous",
        action: "approve",
        escalationIds: ["esc_200", "esc_500"],
      })
      const clarification = await respondToApprovalMessage(inputs)
      expect(text(clarification)).toContain(
        "Which request do you want to approve?"
      )
      const options =
        clarification?.metadata?.approvalClarification?.options || []
      const index =
        options.findIndex(option => option.escalationId === "esc_200") + 1
      if (!clarification) throw new Error("Expected approval clarification")
      const selection = {
        ...inputs,
        latestPrompt: String(index),
        messages: [clarification],
      }
      await respondToApprovalMessage(selection)
      await respondToApprovalMessage(selection)
      const db = context.getWorkspaceDB()
      expect(
        (await db.get<EscalationContextDoc>("escalation_context_esc_200"))
          .resolution
      ).toEqual("resolved")
      expect(
        (await db.get<EscalationContextDoc>("escalation_context_esc_500"))
          .resolution
      ).toEqual("pending")
      expect(escalationProcessor.resolve).toHaveBeenCalledTimes(1)
    })
  })

  it("does not approve an escalation assigned to another user even if the model selects it", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await createApproval({
        id: "esc_200",
        price: 200,
        approvers: ["another_user"],
      })
      decide({ decision: "approve", escalationId: "esc_200" })
      const result = await respondToApprovalMessage(inputs)
      expect(text(result)).toContain("assigned to you")
      expect(
        (
          await context
            .getWorkspaceDB()
            .get<EscalationContextDoc>("escalation_context_esc_200")
        ).approvals
      ).toBeUndefined()
      expect(escalationProcessor.resolve).not.toHaveBeenCalled()
    })
  })

  it.each([
    {
      decision: "approve",
      label: "approval",
      actionId: EscalationAction.APPROVE,
      accepted: true,
    },
    {
      decision: "reject",
      label: "rejection",
      actionId: EscalationAction.REJECT,
      accepted: false,
    },
  ])(
    "records $decision through the original notification",
    async ({ decision, label, actionId, accepted }) => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await createApproval({ id: "esc_200", price: 200, approvers: [] })
        const db = context.getWorkspaceDB()
        const recipient = {
          type: EscalationNotificationChannel.SLACK,
          config: { globalUserId: "approver_1" },
        }
        const doc = await db.get<EscalationContextDoc>(
          "escalation_context_esc_200"
        )
        await db.put({ ...doc, recipients: [recipient] })
        const notificationId = `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}notification_200`
        await db.put({
          _id: notificationId,
          escalationId: "esc_200",
          appId: config.getProdWorkspaceId(),
          tenantId: config.getTenantId(),
          recipient,
          status: "sent",
        })
        decide({ decision, escalationId: "esc_200" })
        const result = await respondToApprovalMessage(inputs)
        expect(text(result)).toContain(`Your ${label} was recorded`)
        expect(
          (await db.get<EscalationContextDoc>("escalation_context_esc_200"))
            .resolution
        ).toEqual("resolved")
        expect(await db.get(notificationId)).toEqual(
          expect.objectContaining({
            responses: [
              expect.objectContaining({
                userId: "approver_1",
                actionId,
              }),
            ],
          })
        )
        expect(escalationProcessor.resolve).toHaveBeenCalledTimes(1)
        expect(escalationProcessor.resolve).toHaveBeenCalledWith(
          "esc_200",
          expect.objectContaining({ accepted })
        )
      })
    }
  )

  it("counts a recipient's repeated text approval once while other recipients are pending", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await createApproval({
        id: "esc_200",
        price: 200,
        approvers: [],
        strategy: ResolutionStrategy.UNANIMOUS,
      })
      const db = context.getWorkspaceDB()
      const recipients = ["approver_1", "approver_2"].map(userId => ({
        type: EscalationNotificationChannel.SLACK,
        config: { globalUserId: userId, externalUserId: `slack_${userId}` },
      }))
      const doc = await db.get<EscalationContextDoc>(
        "escalation_context_esc_200"
      )
      await db.put({ ...doc, recipients })
      for (const recipient of recipients) {
        await db.put({
          _id: `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}${recipient.config.globalUserId}`,
          escalationId: "esc_200",
          appId: config.getProdWorkspaceId(),
          tenantId: config.getTenantId(),
          recipient,
          status: "sent",
        })
      }
      decide({ decision: "approve", escalationId: "esc_200" })
      await respondToApprovalMessage(inputs)
      await respondToApprovalMessage(inputs)
      expect(
        (await db.get<EscalationContextDoc>("escalation_context_esc_200"))
          .resolution
      ).toEqual("pending")
      expect(escalationProcessor.resolve).not.toHaveBeenCalled()
      await respondToApprovalMessage({ ...inputs, userId: "approver_2" })
      expect(
        (await db.get<EscalationContextDoc>("escalation_context_esc_200"))
          .resolution
      ).toEqual("resolved")
      expect(escalationProcessor.resolve).toHaveBeenCalledTimes(1)
    })
  })

  it("rejects the original purchase by message without approving it", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await createApproval({ id: "esc_200", price: 200 })
      decide({ decision: "reject", escalationId: "esc_200" })
      const result = await respondToApprovalMessage({
        ...inputs,
        latestPrompt: "Rechaza la compra del portátil de 200 euros",
      })
      const doc = await context
        .getWorkspaceDB()
        .get<EscalationContextDoc>("escalation_context_esc_200")
      expect(text(result)).toContain(
        "Your rejection was recorded for: Laptop costing 200"
      )
      expect(doc.approvals).toEqual([
        expect.objectContaining({
          userId: "approver_1",
          actionId: EscalationAction.REJECT,
        }),
      ])
      expect(escalationProcessor.resolve).toHaveBeenCalledTimes(1)
      expect(escalationProcessor.resolve).toHaveBeenCalledWith(
        "esc_200",
        expect.objectContaining({ accepted: false })
      )
    })
  })

  it("preserves rejection intent when choosing a numbered option", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await createApproval({ id: "esc_200", price: 200 })
      await createApproval({ id: "esc_500", price: 500 })
      decide({
        decision: "ambiguous",
        action: "reject",
        escalationIds: ["esc_200", "esc_500"],
      })
      const clarification = await respondToApprovalMessage({
        ...inputs,
        latestPrompt: "Rechaza la compra del portátil",
      })
      const options =
        clarification?.metadata?.approvalClarification?.options || []
      if (!clarification || !options.length)
        throw new Error("Expected rejection clarification")
      const index =
        options.findIndex(option => option.escalationId === "esc_200") + 1
      const selection = {
        ...inputs,
        latestPrompt: String(index),
        messages: [clarification],
      }
      await respondToApprovalMessage(selection)
      await respondToApprovalMessage(selection)
      const db = context.getWorkspaceDB()
      expect(
        (await db.get<EscalationContextDoc>("escalation_context_esc_200"))
          .approvals
      ).toEqual([
        expect.objectContaining({ actionId: EscalationAction.REJECT }),
      ])
      expect(
        (await db.get<EscalationContextDoc>("escalation_context_esc_500"))
          .resolution
      ).toEqual("pending")
      expect(escalationProcessor.resolve).toHaveBeenCalledTimes(1)
      expect(escalationProcessor.resolve).toHaveBeenCalledWith(
        "esc_200",
        expect.objectContaining({ accepted: false })
      )
    })
  })

  it("preserves unanimous approval requirements", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await createApproval({
        id: "esc_200",
        price: 200,
        approvers: ["approver_1", "approver_2"],
        strategy: ResolutionStrategy.UNANIMOUS,
      })
      decide({ decision: "approve", escalationId: "esc_200" })
      await respondToApprovalMessage(inputs)
      const db = context.getWorkspaceDB()
      expect(
        (await db.get<EscalationContextDoc>("escalation_context_esc_200"))
          .resolution
      ).toEqual("pending")
      expect(escalationProcessor.resolve).not.toHaveBeenCalled()
      decide({ decision: "approve", escalationId: "esc_200" })
      await respondToApprovalMessage({ ...inputs, userId: "approver_2" })
      expect(
        (await db.get<EscalationContextDoc>("escalation_context_esc_200"))
          .resolution
      ).toEqual("resolved")
      expect(escalationProcessor.resolve).toHaveBeenCalledTimes(1)
    })
  })

  it("does not rerun a purchase when no pending approval remains", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      decide({ decision: "approve", escalationId: "unavailable" })
      const result = await respondToApprovalMessage(inputs)
      expect(text(result)).toContain("No approval was changed")
      expect(escalationProcessor.resolve).not.toHaveBeenCalled()
    })
  })

  it("rechecks permissions after displaying approval options", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await createApproval({ id: "esc_200", price: 200 })
      await createApproval({ id: "esc_500", price: 500 })
      decide({
        decision: "ambiguous",
        action: "approve",
        escalationIds: ["esc_200", "esc_500"],
      })
      const clarification = await respondToApprovalMessage(inputs)
      if (!clarification) throw new Error("Expected approval clarification")
      const db = context.getWorkspaceDB()
      const doc = await db.get<EscalationContextDoc>(
        "escalation_context_esc_200"
      )
      await db.put({
        ...doc,
        policy: {
          id: "policy_1",
          name: "Purchase",
          approvers: ["another_user"],
        },
      })
      const options =
        clarification.metadata?.approvalClarification?.options || []
      const index =
        options.findIndex(option => option.escalationId === "esc_200") + 1
      const result = await respondToApprovalMessage({
        ...inputs,
        latestPrompt: String(index),
        messages: [clarification],
      })
      expect(text(result)).toContain("assigned to you")
      expect(
        (await db.get<EscalationContextDoc>("escalation_context_esc_200"))
          .approvals
      ).toBeUndefined()
      expect(escalationProcessor.resolve).not.toHaveBeenCalled()
    })
  })

  it("does not interpret an independent new purchase as approval", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await createApproval({ id: "esc_200", price: 200 })
      decide({ decision: "not_approval" })
      expect(
        await respondToApprovalMessage({
          ...inputs,
          latestPrompt: "Also buy a laptop costing 500",
        })
      ).toBeUndefined()
      expect(escalationProcessor.resolve).not.toHaveBeenCalled()
    })
  })

  it("changes nothing when interpretation fails or returns an unknown approval", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await createApproval({ id: "esc_200", price: 200 })
      model.doGenerate = async () => {
        throw new Error("Model unavailable")
      }
      expect(text(await respondToApprovalMessage(inputs))).toContain(
        "No approval was changed"
      )
      decide({ decision: "approve", escalationId: "esc_unknown" })
      expect(text(await respondToApprovalMessage(inputs))).toContain(
        "No approval was changed"
      )
      expect(escalationProcessor.resolve).not.toHaveBeenCalled()
    })
  })
})
