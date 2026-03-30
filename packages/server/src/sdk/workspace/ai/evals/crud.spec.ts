import type { AgentEvalRun } from "@budibase/types"
import { fetchRuns, saveRun } from "./crud"

let db: {
  allDocs: jest.Mock
  put: jest.Mock
  tryGet: jest.Mock
}

let docIds: {
  getAgentEvalSuiteID: (agentId: string) => string
  getAgentEvalRunPrefix: (agentId: string) => string
  getAgentEvalRunID: (
    agentId: string,
    startedAt?: string,
    runId?: string
  ) => string
}

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: jest.fn(() => db),
    },
  }
})

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
    const runPrefix = docIds.getAgentEvalRunPrefix("agent-1")

    expect(runs.map(run => run.runId)).toEqual(["run-3", "run-2"])
    expect(db.allDocs).toHaveBeenCalledWith({
      startkey: `${runPrefix}\ufff0`,
      endkey: runPrefix,
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

    expect(db.put).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: docIds.getAgentEvalRunID(
          "agent-1",
          "2025-01-01T00:00:00.000Z",
          "run-1"
        ),
      })
    )
  })
})
