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
  AgentTestSuite,
  UpdateAgentTestSuiteRequest,
} from "@budibase/types"
import * as testsCrud from "./crud"

describe("agent tests crud", () => {
  const agentId = "agent_test_crud"

  beforeEach(() => {
    jest.clearAllMocks()
    mockDbPut.mockResolvedValue({ rev: "2-newrev" })
  })

  describe("saveSuite", () => {
    it("preserves reviewer ids from the stored suite when the request omits them", async () => {
      const existing: AgentTestSuite = {
        _id: `suite_${agentId}`,
        _rev: "1-old",
        agentId,
        cases: [
          {
            id: "case-1",
            name: "T1",
            input: "hello",
            reviewers: [
              {
                id: "reviewer-persisted",
                type: "exact_match",
                text: "expected",
              },
            ],
          },
        ],
      }
      mockDbTryGet.mockResolvedValue(existing)

      const request = {
        _rev: "1-old",
        cases: [
          {
            id: "case-1",
            name: "T1",
            input: "hello",
            reviewers: [
              {
                type: "exact_match",
                text: "expected",
              },
            ],
          },
        ],
      } as unknown as UpdateAgentTestSuiteRequest

      const saved = await testsCrud.saveSuite({ agentId, request })

      expect(saved.cases[0]?.reviewers[0]?.id).toBe("reviewer-persisted")
      expect(mockDbPut).toHaveBeenCalledWith(
        expect.objectContaining({
          cases: [
            expect.objectContaining({
              reviewers: [
                expect.objectContaining({ id: "reviewer-persisted" }),
              ],
            }),
          ],
        })
      )
    })
  })
})
