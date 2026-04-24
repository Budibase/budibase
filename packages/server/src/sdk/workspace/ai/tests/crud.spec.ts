const mockDbTryGet = jest.fn()
const mockDbPut = jest.fn()

const mockGetWorkspaceDB = jest.fn(() => ({
  tryGet: (...args: unknown[]) => mockDbTryGet(...args),
  put: (...args: unknown[]) => mockDbPut(...args),
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: (...args: Parameters<typeof mockGetWorkspaceDB>) =>
        mockGetWorkspaceDB(...args),
    },
  }
})

import type {
  AgentTestCaseResult,
  AgentTestGroup,
  AgentTestSuite,
} from "@budibase/types"
import * as testsCrud from "./crud"

const makeResult = (
  caseId: string,
  overrides: Partial<AgentTestCaseResult> = {}
): AgentTestCaseResult => ({
  caseId,
  name: `result ${caseId}`,
  caseSnapshot: {
    id: caseId,
    groupId: "default",
    name: `result ${caseId}`,
    input: "in",
    reviewers: [],
  },
  response: "ok",
  status: "passed",
  reviewerResults: [],
  toolCalls: [],
  sessionId: `session-${caseId}`,
  requestIds: [],
  startedAt: "2026-01-01T00:00:00.000Z",
  completedAt: "2026-01-01T00:00:01.000Z",
  durationMs: 1000,
  ...overrides,
})

describe("agent tests crud", () => {
  const agentId = "agent_test_crud"
  const groups: AgentTestGroup[] = [
    {
      id: "default",
      name: "Default test group",
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockDbPut.mockResolvedValue({ rev: "2-newrev" })
  })

  describe("fetchSuite", () => {
    it("normalizes legacy suites into the default group", async () => {
      mockDbTryGet.mockResolvedValue({
        _id: `suite_${agentId}`,
        _rev: "1-old",
        agentId,
        cases: [
          {
            id: "case-1",
            name: "Legacy",
            input: "hello",
            reviewers: [],
          },
        ],
      })

      const suite = await testsCrud.fetchSuite(agentId)

      expect(suite.groups).toEqual(groups)
      expect(suite.cases[0]?.groupId).toBe("default")
    })
  })

  describe("saveSuite", () => {
    it("rejects a suite without groups", async () => {
      await expect(
        testsCrud.saveSuite({
          agentId,
          request: {
            groups: [],
            cases: [],
          },
        })
      ).rejects.toThrow("At least one test group is required.")
    })

    it("preserves existing lastResult when the case definition is unchanged", async () => {
      const reviewers = [
        {
          id: "reviewer-1",
          type: "contains_text" as const,
          text: "hello",
        },
      ]
      const caseSnapshot = {
        id: "case-1",
        groupId: "default",
        name: "T1",
        input: "hello",
        reviewers,
      }
      const persistedResult = makeResult("case-1", {
        response: "persisted",
        caseSnapshot,
      })
      const existing: AgentTestSuite = {
        _id: `suite_${agentId}`,
        _rev: "1-old",
        agentId,
        groups,
        cases: [
          {
            id: "case-1",
            groupId: "default",
            name: "T1",
            input: "hello",
            reviewers,
            lastResult: persistedResult,
          },
        ],
      }
      mockDbTryGet.mockResolvedValue(existing)

      const request = {
        _rev: "1-old",
        groups,
        cases: [
          {
            id: "case-1",
            groupId: "default",
            name: "T1",
            input: "hello",
            reviewers,
          },
        ],
      }

      const saved = await testsCrud.saveSuite({ agentId, request })

      expect(saved.cases[0]?.lastResult).toEqual(persistedResult)
    })

    it("clears the existing lastResult when the case definition changes", async () => {
      const reviewers = [
        {
          id: "reviewer-1",
          type: "contains_text" as const,
          text: "hello",
        },
      ]
      const existing: AgentTestSuite = {
        _id: `suite_${agentId}`,
        _rev: "1-old",
        agentId,
        groups,
        cases: [
          {
            id: "case-1",
            groupId: "default",
            name: "T1",
            input: "hello",
            reviewers,
            lastResult: makeResult("case-1", {
              caseSnapshot: {
                id: "case-1",
                groupId: "default",
                name: "T1",
                input: "hello",
                reviewers,
              },
            }),
          },
        ],
      }
      mockDbTryGet.mockResolvedValue(existing)

      const request = {
        _rev: "1-old",
        groups,
        cases: [
          {
            id: "case-1",
            groupId: "default",
            name: "T1",
            input: "hello again",
            reviewers,
          },
        ],
      }

      const saved = await testsCrud.saveSuite({ agentId, request })

      expect(saved.cases[0]?.lastResult).toBeUndefined()
    })

    it("rejects cases that reference a missing group", async () => {
      await expect(
        testsCrud.saveSuite({
          agentId,
          request: {
            groups,
            cases: [
              {
                id: "case-1",
                groupId: "missing",
                name: "T1",
                input: "hello",
                reviewers: [
                  {
                    id: "reviewer-1",
                    type: "exact_match",
                    text: "hello",
                  },
                ],
              },
            ],
          },
        })
      ).rejects.toThrow("Each test must belong to a valid test group.")
    })
  })

  describe("persistRunResults", () => {
    const existing: AgentTestSuite = {
      _id: `suite_${agentId}`,
      _rev: "1-old",
      agentId,
      groups,
      cases: [
        {
          id: "case-1",
          groupId: "default",
          name: "T1",
          input: "hello",
          reviewers: [],
          lastResult: makeResult("case-1", { response: "old-1" }),
        },
        {
          id: "case-2",
          groupId: "default",
          name: "T2",
          input: "hi",
          reviewers: [],
        },
      ],
    }

    it("writes lastResult onto cases that ran and leaves others alone", async () => {
      mockDbTryGet.mockResolvedValue(structuredClone(existing))

      await testsCrud.persistRunResults({
        agentId,
        results: [makeResult("case-2", { response: "new-2" })],
      })

      const putDoc = mockDbPut.mock.calls[0][0] as AgentTestSuite
      expect(putDoc.cases[0]?.lastResult?.response).toBe("old-1")
      expect(putDoc.cases[1]?.lastResult?.response).toBe("new-2")
    })

    it("truncates oversized responses with a marker", async () => {
      mockDbTryGet.mockResolvedValue(structuredClone(existing))

      const huge = "a".repeat(40 * 1024)
      await testsCrud.persistRunResults({
        agentId,
        results: [makeResult("case-1", { response: huge })],
      })

      const putDoc = mockDbPut.mock.calls[0][0] as AgentTestSuite
      const saved = putDoc.cases[0]?.lastResult?.response ?? ""
      expect(saved.length).toBeLessThan(huge.length)
      expect(saved).toMatch(/\[response truncated\]$/)
    })

    it("is a no-op when no results are provided", async () => {
      await testsCrud.persistRunResults({ agentId, results: [] })
      expect(mockDbTryGet).not.toHaveBeenCalled()
      expect(mockDbPut).not.toHaveBeenCalled()
    })

    it("is a no-op when the suite document does not exist", async () => {
      mockDbTryGet.mockResolvedValue(undefined)
      await testsCrud.persistRunResults({
        agentId,
        results: [makeResult("case-1")],
      })
      expect(mockDbPut).not.toHaveBeenCalled()
    })
  })
})
