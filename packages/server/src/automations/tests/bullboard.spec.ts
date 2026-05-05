import type { AutomationData } from "@budibase/types"

let mockQueueInstances: {
  name: string
  options: {
    removeStalledCb: (job: unknown) => unknown
    jobTags: (job: AutomationData) => Record<string, string | undefined>
  }
  getBullQueue: jest.Mock
}[] = []
let mockShutdown = jest.fn()
let mockRegisterPlugin = jest.fn(() => "plugin")
let mockSetBasePath = jest.fn()

jest.mock("@budibase/backend-core", () => ({
  queue: {
    BudibaseQueue: class {
      public readonly name: string
      public readonly options: {
        removeStalledCb: (job: unknown) => unknown
        jobTags: (job: AutomationData) => Record<string, string | undefined>
      }
      getBullQueue = jest.fn(() => ({ name: "queue" }))

      constructor(
        name: string,
        options: {
          removeStalledCb: (job: unknown) => unknown
          jobTags: (job: AutomationData) => Record<string, string | undefined>
        }
      ) {
        this.name = name
        this.options = options
        mockQueueInstances.push(this)
      }
    },
    JobQueue: {
      AUTOMATION: "automation",
    },
    shutdown: (...args: unknown[]) => mockShutdown(...args),
  },
}))

jest.mock("@budibase/pro", () => ({
  backups: {
    getBackupQueue: jest.fn(),
  },
}))

jest.mock("@bull-board/api", () => ({
  createBullBoard: jest.fn(),
}))

jest.mock("@bull-board/api/bullAdapter", () => ({
  BullAdapter: jest.fn(),
}))

jest.mock("@bull-board/koa", () => ({
  KoaAdapter: jest.fn().mockImplementation(() => ({
    registerPlugin: mockRegisterPlugin,
    setBasePath: mockSetBasePath,
  })),
}))

jest.mock("../../events/docUpdates/syncUsers", () => ({
  UserSyncProcessor: {
    queue: {
      getBullQueue: jest.fn(() => ({ name: "userSync" })),
    },
  },
}))

jest.mock("../../threads/automation", () => ({
  removeStalled: jest.fn(),
}))

jest.mock("../../workspaceMigrations/queue", () => ({
  getAppMigrationQueue: jest.fn(),
}))

jest.mock("../../sdk/workspace/ai", () => ({
  rag: {
    ragQueue: {
      getQueue: jest.fn(() => ({
        getBullQueue: jest.fn(() => ({ name: "rag" })),
      })),
    },
    knowledgeSourceSyncQueue: {
      getQueue: jest.fn(() => ({
        getBullQueue: jest.fn(() => ({ name: "knowledgeSourceSync" })),
      })),
    },
  },
}))

const { backups } = require("@budibase/pro")
const { queue } = require("@budibase/backend-core")
const { createBullBoard } = require("@bull-board/api")
const { BullAdapter } = require("@bull-board/api/bullAdapter")
const { KoaAdapter } = require("@bull-board/koa")
const { UserSyncProcessor } = require("../../events/docUpdates/syncUsers")
const { getAppMigrationQueue } = require("../../workspaceMigrations/queue")
const { rag } = require("../../sdk/workspace/ai")
const { automationQueue, init, shutdown } = require("../bullboard")
const automation = require("../../threads/automation")

describe("bullboard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("configures automation queue callbacks", () => {
    const job = {
      automation: {
        _id: "au_1",
        name: "Automation",
        appId: "app_1",
        createdAt: "2024-01-01T00:00:00.000Z",
        definition: {
          trigger: {
            stepId: "trigger_1",
          },
        },
      },
    } as AutomationData

    const typedQueue = mockQueueInstances[0]

    expect(automationQueue).toBe(typedQueue)
    expect(typedQueue.name).toEqual(queue.JobQueue.AUTOMATION)
    expect(typedQueue.options.jobTags(job)).toEqual({
      "automation.id": "au_1",
      "automation.name": "Automation",
      "automation.appId": "app_1",
      "automation.createdAt": "2024-01-01T00:00:00.000Z",
      "automation.trigger": "trigger_1",
    })

    typedQueue.options.removeStalledCb(job)
    expect(automation.removeStalled).toHaveBeenCalledWith(job)
  })

  it("initialises bull board with optional queues", async () => {
    const backupQueue = {
      getBullQueue: jest.fn(() => ({ name: "backup" })),
    }
    const appMigrationQueue = {
      getBullQueue: jest.fn(() => ({ name: "appMigration" })),
    }
    ;(backups.getBackupQueue as jest.Mock).mockReturnValue(backupQueue)
    ;(getAppMigrationQueue as jest.Mock).mockReturnValue(appMigrationQueue)

    const result = await init()

    expect(result).toEqual("plugin")
    expect(BullAdapter).toHaveBeenCalledTimes(6)
    expect(createBullBoard).toHaveBeenCalledWith({
      queues: expect.any(Array),
      serverAdapter: expect.any(Object),
    })
    expect(mockSetBasePath).toHaveBeenCalledWith("/bulladmin")
    expect(mockRegisterPlugin).toHaveBeenCalled()
    expect(KoaAdapter).toHaveBeenCalled()
    expect(UserSyncProcessor.queue.getBullQueue).toHaveBeenCalled()
    expect(rag.ragQueue.getQueue).toHaveBeenCalled()
    expect(rag.knowledgeSourceSyncQueue.getQueue).toHaveBeenCalled()
  })

  it("initialises bull board without optional queues", async () => {
    ;(backups.getBackupQueue as jest.Mock).mockReturnValue(undefined)
    ;(getAppMigrationQueue as jest.Mock).mockReturnValue(undefined)

    await init()

    expect(BullAdapter).toHaveBeenCalledTimes(4)
  })

  it("shuts down queues", async () => {
    await shutdown()

    expect(mockShutdown).toHaveBeenCalled()
  })
})
