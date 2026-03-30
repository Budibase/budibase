import type { AgentEvalRun } from "@budibase/types"
import { fetchRuns, saveRun } from "./crud"

let db: {
  allDocs: jest.Mock
  put: jest.Mock
  tryGet: jest.Mock
}

let docIds: {
  getAgentEvalSuiteID: jest.Mock
  getAgentEvalRunPrefix: jest.Mock
  getAgentEvalRunID: jest.Mock
}

jest.mock("@budibase/backend-core", () => ({
  context: {
    getWorkspaceDB: jest.fn(() => db),
  },
  docIds: {
    getAgentEvalSuiteID: jest.fn((agentId: string) => `suite_${agentId}`),
    getAgentEvalRunPrefix: jest.fn((agentId: string) => `run_${agentId}_`),
    getAgentEvalRunID: jest.fn(
      (agentId: string, startedAt?: string, runId?: string) => {
        if (!startedAt) {
          return `run_${agentId}`
        }

        if (!runId) {
          return `run_${agentId}_${startedAt}`
        }

        return `run_${agentId}_${startedAt}_${runId}`
      }
    ),
  },
  HTTPError: class HTTPError extends Error {
    status: number

    constructor(message: string, status: number) {
      super(message)
      this.status = status
    }
  },
}))

db = {
  allDocs: jest.fn(),
  put: jest.fn(),
  tryGet: jest.fn(),
}

docIds = jest.requireMock("@budibase/backend-core").docIds

const createRun = ({
  runId,
  completedAt,
}: {
  runId: string
  completedAt: string
}): AgentEvalRun => ({
  _id: `run_agent-1_${runId}`,
  agentId: "agent-1",
  runId,
  total: 1,
  passed: 1,
  failed: 0,
  startedAt: "2025-01-01T00:00:00.000Z",
  completedAt,
  snapshot: {
    agentId: "agent-1",
    agentName: "Support Agent",
    aiconfig: "config-1",
    enabledTools: [],
    knowledgeBases: [],
  },
  results: [],
})

describe("agent eval crud", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("sorts runs by completion time before applying the limit", async () => {
    db.allDocs.mockResolvedValue({
      rows: [
        {
          doc: createRun({
            runId: "run-2",
            completedAt: "2025-01-01T00:00:02.000Z",
          }),
        },
        {
          doc: createRun({
            runId: "run-1",
            completedAt: "2025-01-01T00:00:01.000Z",
          }),
        },
        {
          doc: createRun({
            runId: "run-3",
            completedAt: "2025-01-01T00:00:03.000Z",
          }),
        },
      ],
    })

    const runs = await fetchRuns("agent-1", 2)

    expect(runs.map(run => run.runId)).toEqual(["run-3", "run-2"])
    expect(db.allDocs).toHaveBeenCalledWith({
      startkey: "run_agent-1_\ufff0",
      endkey: "run_agent-1_",
      include_docs: true,
      descending: true,
    })
  })

  it("stores run documents under a sortable id", async () => {
    db.put.mockResolvedValue({
      rev: "rev-1",
    })

    await saveRun({
      agentId: "agent-1",
      runId: "run-1",
      total: 1,
      passed: 1,
      failed: 0,
      startedAt: "2025-01-01T00:00:00.000Z",
      completedAt: "2025-01-01T00:00:01.000Z",
      snapshot: {
        agentId: "agent-1",
        agentName: "Support Agent",
        aiconfig: "config-1",
        enabledTools: [],
        knowledgeBases: [],
      },
      results: [],
    })

    expect(docIds.getAgentEvalRunID).toHaveBeenCalledWith(
      "agent-1",
      "2025-01-01T00:00:00.000Z",
      "run-1"
    )
    expect(db.put).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "run_agent-1_2025-01-01T00:00:00.000Z_run-1",
      })
    )
  })
})
