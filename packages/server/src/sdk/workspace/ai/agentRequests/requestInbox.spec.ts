import { context } from "@budibase/backend-core"
import {
  DocumentType,
  EscalationSource,
  prefixed,
  SEPARATOR,
  SortOrder,
} from "@budibase/types"
import type { AgentRequest, EscalationContextDoc } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import migration from "../../../../workspaceMigrations/migrations/20261015162044_move_agent_requests_to_tenant_db"
import { fetchRequestsForUser, findRequestForUser } from "./requestInbox"

const REQUESTER = `${prefixed(DocumentType.USER)}requester`
const OTHER_REQUESTER = `${prefixed(DocumentType.USER)}other`
const RESPONDED_APPROVER = `${prefixed(DocumentType.USER)}responded`
const PENDING_APPROVER = `${prefixed(DocumentType.USER)}pending`
const OUTSIDER = `${prefixed(DocumentType.USER)}outsider`

describe("request inbox", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  const seedLegacyRequest = async (
    id: string,
    overrides: Partial<AgentRequest> & { createdAt: string }
  ) => {
    await context.getWorkspaceDB().put({
      _id: `${DocumentType.AGENT_REQUEST}${SEPARATOR}${id}`,
      agentId: "agent_1",
      userId: REQUESTER,
      operationId: "op_1",
      title: `Request ${id}`,
      status: "completed",
      entries: [{ sessionId: "session_1", source: "Slack", status: "active" }],
      actions: [],
      updatedAt: overrides.createdAt,
      ...overrides,
    })
  }

  const seedEscalation = async (
    escalationId: string,
    requestId: string,
    overrides: Partial<EscalationContextDoc>
  ) => {
    await context.getWorkspaceDB().put({
      _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`,
      source: EscalationSource.OPERATION,
      appId: context.getWorkspaceId(),
      tenantId: config.getTenantId(),
      agentId: "agent_1",
      sessionId: "session_1",
      requestId,
      resolution: "pending",
      ...overrides,
    })
  }

  const escalationRaised = (escalationId: string, timestamp: string) => ({
    id: `action_${escalationId}`,
    type: "escalation_raised" as const,
    escalationId,
    recipients: [],
    sessionId: "session_1",
    timestamp,
  })

  // Three requests:
  //  - "shared": REQUESTER asked, RESPONDED_APPROVER has approved, PENDING_APPROVER still owed
  //  - "done": REQUESTER asked, completed, no escalation
  //  - "theirs": OTHER_REQUESTER asked, PENDING_APPROVER owed
  const seedInbox = async () => {
    await seedLegacyRequest("shared", {
      status: "needs_input",
      createdAt: "2026-10-01T10:00:00.000Z",
      actions: [escalationRaised("esc_shared", "2026-10-01T10:00:01.000Z")],
    })
    await seedEscalation("esc_shared", "agentrequest_shared", {
      policy: {
        id: "policy_1",
        name: "Two approvers",
        approvers: [RESPONDED_APPROVER, PENDING_APPROVER],
      },
      approvals: [
        {
          userId: RESPONDED_APPROVER,
          actionId: "approve",
          respondedAt: "2026-10-01T11:00:00.000Z",
        },
      ],
    })
    await seedLegacyRequest("done", {
      createdAt: "2026-10-02T10:00:00.000Z",
    })
    await seedLegacyRequest("theirs", {
      userId: OTHER_REQUESTER,
      status: "needs_input",
      createdAt: "2026-10-03T10:00:00.000Z",
      actions: [escalationRaised("esc_theirs", "2026-10-03T10:00:01.000Z")],
    })
    await seedEscalation("esc_theirs", "agentrequest_theirs", {
      policy: {
        id: "policy_2",
        name: "One approver",
        approvers: [PENDING_APPROVER],
      },
    })
    await migration()
  }

  const list = (
    globalUserId: string,
    filters: Parameters<typeof fetchRequestsForUser>[0]["filters"] = {},
    opts: { order?: SortOrder; page?: number; limit?: number } = {}
  ) =>
    fetchRequestsForUser({
      globalUserId,
      filters,
      order: opts.order ?? SortOrder.DESCENDING,
      page: opts.page ?? 1,
      limit: opts.limit ?? 10,
    })

  describe("fetchRequestsForUser", () => {
    it("shows a requester only their own requests, needs input first", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await seedInbox()

        const { requests, hasNextPage } = await list(REQUESTER)

        expect(hasNextPage).toBe(false)
        expect(requests.map(r => r.requestId)).toEqual([
          "req_shared",
          "req_done",
        ])
        expect(requests[0]).toEqual(
          expect.objectContaining({
            workspaceId: config.getProdWorkspaceId(),
            status: "needs_input",
            isRequester: true,
            isApprover: false,
            awaitingMe: false,
            awaitingOthers: true,
            responded: false,
          })
        )
        expect(requests[1]).toEqual(
          expect.objectContaining({
            status: "completed",
            isRequester: true,
            awaitingOthers: false,
          })
        )
      })
    })

    it("shows an approver every request they approve on, with the ones awaiting them first", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await seedInbox()

        const { requests } = await list(PENDING_APPROVER)
        expect(requests.map(r => r.requestId)).toEqual([
          "req_theirs",
          "req_shared",
        ])
        expect(requests.every(r => r.awaitingMe && r.isApprover)).toBe(true)

        const responded = await list(RESPONDED_APPROVER)
        expect(responded.requests.map(r => r.requestId)).toEqual(["req_shared"])
        expect(responded.requests[0]).toEqual(
          expect.objectContaining({
            isApprover: true,
            awaitingMe: false,
            awaitingOthers: true,
            responded: true,
          })
        )
      })
    })

    it("filters by awaitingMe, awaitingOthers, responded and isRequester", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await seedInbox()

        const ids = async (user: string, filters: Parameters<typeof list>[1]) =>
          (await list(user, filters)).requests.map(r => r.requestId)

        expect(await ids(PENDING_APPROVER, { awaitingMe: true })).toEqual([
          "req_theirs",
          "req_shared",
        ])
        expect(await ids(RESPONDED_APPROVER, { awaitingMe: true })).toEqual([])
        expect(await ids(RESPONDED_APPROVER, { responded: true })).toEqual([
          "req_shared",
        ])
        expect(await ids(REQUESTER, { awaitingOthers: true })).toEqual([
          "req_shared",
        ])
        expect(await ids(REQUESTER, { awaitingOthers: false })).toEqual([
          "req_done",
        ])
        expect(await ids(PENDING_APPROVER, { isRequester: true })).toEqual([])
        expect(await ids(REQUESTER, { status: "completed" })).toEqual([
          "req_done",
        ])
      })
    })

    it("marks a channel-only escalation as awaiting others for its requester only", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await seedLegacyRequest("channel", {
          status: "needs_input",
          createdAt: "2026-10-04T10:00:00.000Z",
          actions: [
            escalationRaised("esc_channel", "2026-10-04T10:00:01.000Z"),
          ],
        })
        await seedEscalation("esc_channel", "agentrequest_channel", {
          policy: { id: "policy_3", name: "Slack channel", approvers: [] },
        })
        await migration()

        const awaitingOthers = await list(REQUESTER, { awaitingOthers: true })
        expect(awaitingOthers.requests).toEqual([
          expect.objectContaining({
            requestId: "req_channel",
            awaitingOthers: true,
            awaitingMe: false,
          }),
        ])
        expect((await list(OUTSIDER)).requests).toEqual([])
      })
    })

    it("returns nothing for a user who is neither requester nor approver", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await seedInbox()

        expect(await list(OUTSIDER)).toEqual({
          requests: [],
          page: 1,
          hasNextPage: false,
        })
      })
    })

    it("pages with a next-page flag", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await seedInbox()

        const first = await list(REQUESTER, {}, { limit: 1 })
        const second = await list(REQUESTER, {}, { limit: 1, page: 2 })

        expect(first.requests.map(r => r.requestId)).toEqual(["req_shared"])
        expect(first.hasNextPage).toBe(true)
        expect(second.requests.map(r => r.requestId)).toEqual(["req_done"])
        expect(second.hasNextPage).toBe(false)
      })
    })
  })

  describe("findRequestForUser", () => {
    it("returns the detail with escalations for someone involved", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await seedInbox()

        const detail = await findRequestForUser({
          requestId: "req_shared",
          globalUserId: PENDING_APPROVER,
        })

        expect(detail).toEqual(
          expect.objectContaining({
            requestId: "req_shared",
            workspaceId: config.getProdWorkspaceId(),
            status: "needs_input",
            isRequester: false,
            source: "Slack",
          })
        )
        expect(detail?.escalations).toHaveLength(1)
        expect(detail?.escalations[0]).toEqual(
          expect.objectContaining({
            escalationId: "esc_shared",
            isApprover: true,
            responded: false,
            approverCount: 2,
          })
        )
        expect(detail?.escalations[0].approvals.map(a => a.userId)).toEqual([
          RESPONDED_APPROVER,
        ])
      })
    })

    it("hides the request from anyone not involved", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await seedInbox()

        expect(
          await findRequestForUser({
            requestId: "req_shared",
            globalUserId: OUTSIDER,
          })
        ).toBeUndefined()
        expect(
          await findRequestForUser({
            requestId: "agentrequest_shared",
            globalUserId: REQUESTER,
          })
        ).toBeUndefined()
      })
    })
  })
})
