import {
  cleanupAutomations,
  clearMetadata,
  disableAllCrons,
  disableCronById,
  enableCronOrEmailTrigger,
  isRebootTrigger,
  processEvent,
  updateTestHistory,
} from "../utils"
import {
  ActionType,
  Automation,
  AutomationJob,
  AutomationStepType,
  AutomationTriggerStepId,
  EmailTriggerInputs,
  MetadataType,
} from "@budibase/types"
import { automationQueue } from "../bullboard"
import {
  context,
  db as dbCore,
  utils as coreUtils,
} from "@budibase/backend-core"
import { REBOOT_CRON } from "@budibase/shared-core"
import { quotas } from "@budibase/pro"
import { checkMail } from "../email"
import { updateEntityMetadata } from "../../utilities"
import type { MockedFunction } from "jest-mock"

let mockRunnerRun = jest.fn()

jest.mock("../../features", () => ({
  automationsEnabled: () => true,
}))

jest.mock("@budibase/pro", () => ({
  quotas: {
    addAutomation: jest.fn(
      async <T>(fn: () => Promise<T> | T) => fn()
    ),
    addAction: jest.fn(
      async <T>(_type: ActionType, fn: () => Promise<T> | T) => fn()
    ),
  },
}))

jest.mock("../bullboard", () => ({
  automationQueue: {
    add: jest.fn(),
    getBullQueue: jest.fn(),
  },
}))

jest.mock("../email", () => ({
  checkMail: jest.fn(),
}))

jest.mock("../../threads", () => ({
  Thread: jest.fn().mockImplementation(() => ({
    run: (...args: unknown[]) => mockRunnerRun(...args),
  })),
  ThreadType: {
    AUTOMATION: "automation",
  },
}))

jest.mock("../../utilities", () => ({
  updateEntityMetadata: jest.fn(),
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    db: {
      ...actual.db,
      doWithDB: jest.fn(),
    },
    context: {
      ...actual.context,
      doInAutomationContext: jest.fn(({ task }) => task()),
      getProdWorkspaceDB: jest.fn(),
    },
    utils: {
      ...actual.utils,
      newid: jest.fn(() => "mockid"),
    },
  }
})

const mockAdd = automationQueue.add as MockedFunction<
  typeof automationQueue.add
>
const mockGetBullQueue = automationQueue.getBullQueue as MockedFunction<
  typeof automationQueue.getBullQueue
>
const mockDoWithDB = dbCore.doWithDB as MockedFunction<typeof dbCore.doWithDB>
const mockNewId = coreUtils.newid as MockedFunction<typeof coreUtils.newid>
const mockAddAutomation = quotas.addAutomation as jest.MockedFunction<
  typeof quotas.addAutomation
>
const mockCheckMail = checkMail as jest.MockedFunction<typeof checkMail>
const mockDoInAutomationContext =
  context.doInAutomationContext as MockedFunction<
    typeof context.doInAutomationContext
  >
const mockGetProdWorkspaceDB = context.getProdWorkspaceDB as MockedFunction<
  typeof context.getProdWorkspaceDB
>
const mockUpdateEntityMetadata = updateEntityMetadata as jest.Mock

const buildCronAutomation = (cronJobId?: string): Automation => ({
  _id: "automation_1",
  _rev: "1-abc",
  appId: "app_dev_123",
  name: "Cron automation",
  definition: {
    steps: [],
    trigger: {
      id: "trigger_1",
      name: "Cron",
      tagline: "Cron",
      icon: "cron",
      description: "",
      type: AutomationStepType.TRIGGER,
      schema: { inputs: { properties: {} }, outputs: { properties: {} } },
      stepId: AutomationTriggerStepId.CRON,
      inputs: { cron: "* * * * *" },
      cronJobId,
    },
  },
  type: "automation",
})

const buildEmailAutomation = (
  inputs: EmailTriggerInputs,
  cronJobId?: string
): Automation => ({
  _id: "automation_2",
  _rev: "1-abc",
  appId: "app_dev_123",
  name: "Email automation",
  definition: {
    steps: [],
    trigger: {
      id: "trigger_2",
      name: "Email",
      tagline: "Email",
      icon: "email",
      description: "",
      type: AutomationStepType.TRIGGER,
      schema: { inputs: { properties: {} }, outputs: { properties: {} } },
      stepId: AutomationTriggerStepId.EMAIL,
      inputs,
      cronJobId,
    },
  },
  type: "automation",
})

const validEmailInputs: EmailTriggerInputs = {
  host: "localhost",
  port: 993,
  secure: false,
  username: "dom",
  password: "dom",
}

describe("enableCronOrEmailTrigger", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRunnerRun.mockResolvedValue({ success: true })
    mockAdd.mockResolvedValue({ id: "job" } as Awaited<
      ReturnType<typeof mockAdd>
    >)
    mockNewId.mockReturnValue("mockid")
  })

  it("does not persist when an existing cron job id is reused", async () => {
    const automation = buildCronAutomation("app_dev_123_cron_existing")

    await enableCronOrEmailTrigger("app_dev_123", automation)

    expect(mockAdd).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ jobId: "app_dev_123_cron_existing" })
    )
    expect(mockDoWithDB).not.toHaveBeenCalled()
  })

  it("returns disabled for automations without runnable scheduled triggers", async () => {
    const noTrigger = buildCronAutomation()
    noTrigger.definition.trigger = undefined as any

    await expect(
      enableCronOrEmailTrigger("app_dev_123", noTrigger)
    ).resolves.toEqual({
      enabled: false,
      automation: noTrigger,
      clearedRepeatableJobs: 0,
    })

    const disabled = buildCronAutomation()
    disabled.disabled = true
    const disabledResult = await enableCronOrEmailTrigger(
      "app_dev_123",
      disabled
    )
    expect(disabledResult.enabled).toEqual(false)

    const reboot = buildCronAutomation()
    reboot.definition.trigger.inputs = { cron: REBOOT_CRON }
    expect(isRebootTrigger(reboot)).toEqual(true)
    const rebootResult = await enableCronOrEmailTrigger("app_dev_123", reboot)
    expect(rebootResult.enabled).toEqual(false)

    expect(mockAdd).not.toHaveBeenCalled()
  })

  it("throws when cron validation fails", async () => {
    const automation = buildCronAutomation()
    automation.definition.trigger.inputs = { cron: "* * * * * *" }

    await expect(
      enableCronOrEmailTrigger("app_dev_123", automation)
    ).rejects.toThrow(
      'Invalid automation CRON "* * * * * *" - Expected 5 values, but got 6.'
    )
  })

  it("migrates legacy cron repeatable job ids", async () => {
    const automation = buildCronAutomation("repeat:legacy:123")
    const mockRemoveRepeatableByKey = jest.fn()
    const mockGetRepeatableJobs = jest
      .fn()
      .mockResolvedValue([
        { key: "repeat:legacy:123:::* * * * 0" },
        { key: "repeat:legacy:123:::* * * * 1" },
        { key: "repeat:legacy2:123:::0 0 * * *" },
      ])
    mockGetBullQueue.mockReturnValue({
      ...(automationQueue.getBullQueue() ?? {}),
      removeRepeatableByKey: mockRemoveRepeatableByKey,
      getRepeatableJobs: mockGetRepeatableJobs,
    } as unknown as ReturnType<typeof automationQueue.getBullQueue>)

    await enableCronOrEmailTrigger("app_dev_123", automation)

    expect(mockGetRepeatableJobs).toHaveBeenCalledTimes(1)

    expect(mockRemoveRepeatableByKey).toHaveBeenCalledWith(
      "repeat:legacy:123:::* * * * 0"
    )
    expect(mockRemoveRepeatableByKey).toHaveBeenCalledWith(
      "repeat:legacy:123:::* * * * 1"
    )
    expect(mockRemoveRepeatableByKey).toHaveBeenCalledTimes(2)

    expect(mockAdd).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ jobId: "app_dev_123_cron_mockid" })
    )
    expect(mockAdd).toHaveBeenCalledTimes(1)

    expect(mockDoWithDB).toHaveBeenCalledTimes(1)
  })

  it("continues when legacy repeatable cleanup fails", async () => {
    const automation = buildCronAutomation("repeat:legacy:123")
    mockGetBullQueue.mockReturnValue({
      getRepeatableJobs: jest.fn().mockRejectedValue(new Error("redis failed")),
      removeRepeatableByKey: jest.fn(),
    } as unknown as ReturnType<typeof automationQueue.getBullQueue>)
    const consoleLog = jest.spyOn(console, "log").mockImplementation()

    const result = await enableCronOrEmailTrigger("app_dev_123", automation)

    consoleLog.mockRestore()
    expect(result.enabled).toEqual(true)
    expect(result.clearedRepeatableJobs).toEqual(0)
    expect(mockAdd).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ jobId: "app_dev_123_cron_mockid" })
    )
  })

  it("persists when a cron job id needs generated", async () => {
    const automation = buildCronAutomation()
    const mockPut = jest
      .fn()
      .mockResolvedValue({ id: automation._id, rev: "2" })
    mockDoWithDB.mockImplementation(async (_appId, task) => {
      const fakeDb = { put: mockPut } as unknown as Parameters<
        NonNullable<Parameters<typeof mockDoWithDB>[1]>
      >[0]
      return task(fakeDb)
    })

    await enableCronOrEmailTrigger("app_dev_123", automation)

    expect(mockAdd).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ jobId: "app_dev_123_cron_mockid" })
    )
    expect(mockDoWithDB).toHaveBeenCalledTimes(1)
    expect(mockPut).toHaveBeenCalledWith(automation)
  })

  it("does not queue email triggers with invalid inputs", async () => {
    const automation = buildEmailAutomation({} as EmailTriggerInputs)

    const result = await enableCronOrEmailTrigger("app_dev_123", automation)

    expect(result.enabled).toBe(false)
    expect(mockAdd).not.toHaveBeenCalled()
    expect(mockDoWithDB).not.toHaveBeenCalled()
  })

  it("queues email triggers with valid inputs", async () => {
    const automation = buildEmailAutomation(validEmailInputs)
    const mockPut = jest
      .fn()
      .mockResolvedValue({ id: automation._id, rev: "2" })
    mockDoWithDB.mockImplementation(async (_appId, task) => {
      const fakeDb = { put: mockPut } as unknown as Parameters<
        NonNullable<Parameters<typeof mockDoWithDB>[1]>
      >[0]
      return task(fakeDb)
    })

    const result = await enableCronOrEmailTrigger("app_dev_123", automation)

    expect(result.enabled).toBe(true)
    expect(mockAdd).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        repeat: { every: 30_000 },
        jobId: "app_dev_123_email_mockid",
      })
    )
    expect(mockDoWithDB).toHaveBeenCalledTimes(1)
    expect(mockPut).toHaveBeenCalledWith(automation)
  })

  it("reuses existing email trigger job ids without persisting", async () => {
    const automation = buildEmailAutomation(
      validEmailInputs,
      "app_dev_123_email_existing"
    )

    const result = await enableCronOrEmailTrigger("app_dev_123", automation)

    expect(result.enabled).toEqual(true)
    expect(mockAdd).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        repeat: { every: 30_000 },
        jobId: "app_dev_123_email_existing",
      })
    )
    expect(mockDoWithDB).not.toHaveBeenCalled()
  })

  it("migrates legacy email repeatable job ids", async () => {
    const automation = buildEmailAutomation(
      validEmailInputs,
      "repeat:email:123"
    )
    const mockRemoveRepeatableByKey = jest.fn()
    const mockGetRepeatableJobs = jest
      .fn()
      .mockResolvedValue([
        { key: "repeat:email:123:::30000" },
        { key: "repeat:other:123:::30000" },
      ])
    mockGetBullQueue.mockReturnValue({
      removeRepeatableByKey: mockRemoveRepeatableByKey,
      getRepeatableJobs: mockGetRepeatableJobs,
    } as unknown as ReturnType<typeof automationQueue.getBullQueue>)

    const result = await enableCronOrEmailTrigger("app_dev_123", automation)

    expect(result.clearedRepeatableJobs).toEqual(1)
    expect(mockRemoveRepeatableByKey).toHaveBeenCalledWith(
      "repeat:email:123:::30000"
    )
    expect(mockAdd).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ jobId: "app_dev_123_email_mockid" })
    )
  })
})

describe("automation utils process helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRunnerRun.mockResolvedValue({ success: true })
    mockAddAutomation.mockImplementation(async (fn: () => Promise<any>) => fn())
    mockDoInAutomationContext.mockImplementation(({ task }: any) => task())
  })

  const buildJob = (
    automation: Automation,
    event: Record<string, any> = { appId: "app_prod" },
    opts: Record<string, any> = {}
  ) =>
    ({
      id: "job_1",
      name: "job",
      attemptsMade: 0,
      opts,
      data: {
        automation,
        event,
      },
    }) as AutomationJob

  it("adds timestamps and runs cron jobs", async () => {
    const automation = buildCronAutomation("job_1")
    const job = buildJob(automation, { appId: "app_prod" })
    const consoleLog = jest.spyOn(console, "log").mockImplementation()

    const result = await processEvent(job)

    consoleLog.mockRestore()
    expect(result).toEqual({ success: true })
    expect(job.data.event.timestamp).toBeDefined()
    expect(mockRunnerRun).toHaveBeenCalledWith(job)
    expect(mockAddAutomation).toHaveBeenCalled()
  })

  it("skips email jobs when mail polling should not proceed", async () => {
    const automation = buildEmailAutomation(validEmailInputs)
    const job = buildJob(automation)
    mockCheckMail.mockResolvedValue({ proceed: false, reason: "not due" })

    const result = await processEvent(job)

    expect(result).toEqual({ skipped: true })
    expect(mockRunnerRun).not.toHaveBeenCalled()
  })

  it("runs one automation per fetched email message", async () => {
    const automation = buildEmailAutomation(validEmailInputs)
    const job = buildJob(automation)
    mockCheckMail.mockResolvedValue({
      proceed: true,
      messages: [{ bodyText: "one" }, { bodyText: "two" }] as any,
    })

    const result = await processEvent(job)

    expect(result).toEqual({})
    expect(mockRunnerRun).toHaveBeenCalledTimes(2)
    expect(mockRunnerRun.mock.calls[0][0].data.event.bodyText).toEqual("one")
    expect(mockRunnerRun.mock.calls[1][0].data.event.bodyText).toEqual("two")
  })

  it("disables repeated cron jobs when the workspace database is missing", async () => {
    const automation = buildCronAutomation("job_1")
    const job = buildJob(automation, { appId: "app_prod" }, { repeat: {} })
    mockRunnerRun.mockRejectedValue({
      reason: "Database does not exist.",
    })
    const mockRemoveRepeatableByKey = jest.fn()
    mockGetBullQueue.mockReturnValue({
      getRepeatableJobs: jest.fn().mockResolvedValue([
        { id: "job_1", key: "job_1:key" },
        { id: "other", key: "other:key" },
      ]),
      removeRepeatableByKey: mockRemoveRepeatableByKey,
    } as unknown as ReturnType<typeof automationQueue.getBullQueue>)
    const consoleWarn = jest.spyOn(console, "warn").mockImplementation()
    const consoleLog = jest.spyOn(console, "log").mockImplementation()

    const result = await processEvent(job)

    consoleWarn.mockRestore()
    consoleLog.mockRestore()
    expect(result.err).toEqual({ reason: "Database does not exist." })
    expect(mockRemoveRepeatableByKey).toHaveBeenCalledWith("job_1:key")
  })

  it("updates test history metadata", async () => {
    const automation = buildCronAutomation()
    const history = { occurredAt: 1, fields: {} } as any
    mockUpdateEntityMetadata.mockImplementation((_type, _id, updater) =>
      updater({ history: [] })
    )

    const result = await updateTestHistory(automation, history)

    expect(mockUpdateEntityMetadata).toHaveBeenCalledWith(
      MetadataType.AUTOMATION_TEST_HISTORY,
      automation._id,
      expect.any(Function)
    )
    expect(result).toEqual({ history: [history] })
  })

  it("clears automation metadata docs", async () => {
    const docs = [{ _id: "m1" }, { _id: "m2" }]
    const mockBulkDocs = jest.fn()
    mockGetProdWorkspaceDB.mockReturnValue({
      allDocs: jest.fn().mockResolvedValue({
        rows: docs.map(doc => ({ doc })),
      }),
      bulkDocs: mockBulkDocs,
    } as any)

    await clearMetadata()

    expect(docs).toEqual([
      { _id: "m1", _deleted: true },
      { _id: "m2", _deleted: true },
    ])
    expect(mockBulkDocs).toHaveBeenCalledWith(docs)
  })

  it("disables all crons and supports cleanup", async () => {
    const mockRemoveRepeatableByKey = jest.fn()
    const mockRemoveJobs = jest.fn()
    mockGetBullQueue.mockReturnValue({
      getRepeatableJobs: jest
        .fn()
        .mockResolvedValue([
          { key: "app_1_cron_a", id: "cron_job" },
          { key: "app_1_email_a" },
          { key: "other_cron_a", id: "other" },
        ]),
      removeRepeatableByKey: mockRemoveRepeatableByKey,
      removeJobs: mockRemoveJobs,
    } as unknown as ReturnType<typeof automationQueue.getBullQueue>)

    const result = await disableAllCrons("app_1")
    await cleanupAutomations("app_1")

    expect(result).toEqual({ count: 1.5 })
    expect(mockRemoveRepeatableByKey).toHaveBeenCalledWith("app_1_cron_a")
    expect(mockRemoveRepeatableByKey).toHaveBeenCalledWith("app_1_email_a")
    expect(mockRemoveJobs).toHaveBeenCalledWith("cron_job")
  })

  it("disables a cron by id", async () => {
    const mockRemoveRepeatableByKey = jest.fn()
    mockGetBullQueue.mockReturnValue({
      getRepeatableJobs: jest
        .fn()
        .mockResolvedValue([{ id: "job_1", key: "job_1:key" }]),
      removeRepeatableByKey: mockRemoveRepeatableByKey,
    } as unknown as ReturnType<typeof automationQueue.getBullQueue>)
    const consoleLog = jest.spyOn(console, "log").mockImplementation()

    await disableCronById("job_1")

    consoleLog.mockRestore()
    expect(mockRemoveRepeatableByKey).toHaveBeenCalledWith("job_1:key")
  })
})
