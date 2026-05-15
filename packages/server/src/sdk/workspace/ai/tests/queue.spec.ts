import type { ContextUser } from "@budibase/types"

const mockAddedJobs: Array<{ data: any; opts: any }> = []
let mockProcessCallback: ((job: any) => Promise<void>) | undefined

class MockBudibaseQueue {
  process = jest.fn(async (...args: any[]) => {
    mockProcessCallback = args.length === 2 ? args[1] : args[0]
  })

  add = jest.fn(async (data: any, opts: any) => {
    mockAddedJobs.push({ data, opts })
    return { id: opts?.jobId, data }
  })
}

const mockQueue = new MockBudibaseQueue()

jest.mock("@budibase/backend-core", () => ({
  context: {
    getWorkspaceId: jest.fn().mockReturnValue("app_1"),
    doInWorkspaceContext: jest.fn((_appId: string, fn: () => Promise<void>) =>
      fn()
    ),
  },
  getErrorMessage: jest.fn((error: unknown) =>
    error instanceof Error ? error.message : String(error)
  ),
  queue: {
    BudibaseQueue: jest.fn(() => mockQueue),
    JobQueue: {
      AGENT_TEST_RUN: "agentTestRunQueue",
    },
  },
  utils: {
    Duration: {
      fromSeconds: jest.fn(() => ({ toMs: () => 10_000 })),
      fromMinutes: jest.fn(() => ({ toMs: () => 1_200_000 })),
    },
  },
}))

jest.mock("./crud", () => ({
  completeRun: jest.fn().mockResolvedValue(undefined),
  createRun: jest.fn(),
  failRun: jest.fn().mockResolvedValue(undefined),
}))

jest.mock("./run", () => ({
  runSuite: jest.fn(),
}))

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("run-1"),
}))

import { context } from "@budibase/backend-core"
import { completeRun, createRun, failRun } from "./crud"
import { runSuite } from "./run"
import { init, startRunSuite } from "./queue"

describe("agent test run queue", () => {
  const user = { _id: "user_1" } as ContextUser
  const mockCreateRun = createRun as jest.Mock
  const mockRunSuite = runSuite as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockAddedJobs.length = 0
    mockRunSuite.mockReset()
    mockCreateRun.mockImplementation(
      async ({
        agentId,
        runId,
        startedAt,
      }: {
        agentId: string
        runId: string
        startedAt: string
      }) => ({
        agentId,
        runId,
        status: "running",
        startedAt,
      })
    )
  })

  it("creates a run document and enqueues the run job", async () => {
    const run = await startRunSuite({
      agentId: "agent-1",
      user,
      caseId: "case-1",
    })

    expect(run).toMatchObject({
      agentId: "agent-1",
      runId: "run-1",
      status: "running",
    })
    expect(mockAddedJobs[0]).toEqual({
      data: expect.objectContaining({
        workspaceId: "app_1",
        agentId: "agent-1",
        runId: "run-1",
        user,
        caseId: "case-1",
      }),
      opts: { jobId: "run-1" },
    })
  })

  it("processes queued runs in the workspace context", async () => {
    const completedRun = {
      agentId: "agent-1",
      runId: "run-1",
      total: 1,
      passed: 1,
      failed: 0,
      startedAt: "2026-01-01T00:00:00.000Z",
      completedAt: "2026-01-01T00:00:01.000Z",
      snapshot: {
        agentId: "agent-1",
        agentName: "Agent",
        aiconfig: "config-1",
        enabledTools: [],
        knowledgeBases: [],
      },
      results: [],
    }
    mockRunSuite.mockResolvedValue(completedRun)

    init()
    await mockProcessCallback?.({
      id: "run-1",
      data: {
        workspaceId: "app_1",
        agentId: "agent-1",
        runId: "run-1",
        startedAt: "2026-01-01T00:00:00.000Z",
        user,
      },
      opts: {},
      attemptsMade: 0,
    })

    expect(context.doInWorkspaceContext).toHaveBeenCalledWith(
      "app_1",
      expect.any(Function)
    )
    expect(completeRun).toHaveBeenCalledWith({
      agentId: "agent-1",
      runId: "run-1",
      completedAt: completedRun.completedAt,
    })
  })

  it("marks the run as failed when processing errors", async () => {
    const error = new Error("No tests found")
    mockRunSuite.mockRejectedValue(error)

    init()
    await expect(
      mockProcessCallback?.({
        id: "run-1",
        data: {
          workspaceId: "app_1",
          agentId: "agent-1",
          runId: "run-1",
          startedAt: "2026-01-01T00:00:00.000Z",
          user,
        },
        opts: {},
        attemptsMade: 0,
      })
    ).rejects.toThrow("No tests found")

    expect(failRun).toHaveBeenCalledWith({
      agentId: "agent-1",
      runId: "run-1",
      error: "No tests found",
    })
  })
})
