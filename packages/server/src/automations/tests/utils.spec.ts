import { enableCronOrEmailTrigger } from "../utils"
import {
  Automation,
  AutomationStepType,
  AutomationTriggerStepId,
  EmailTriggerInputs,
} from "@budibase/types"
import { automationQueue } from "../bullboard"
import { db as dbCore, utils as coreUtils } from "@budibase/backend-core"
import type { MockedFunction } from "jest-mock"

jest.mock("../../features", () => ({
  automationsEnabled: () => false,
}))

jest.mock("@budibase/pro", () => ({
  quotas: {
    addAutomation: async <T>(fn: () => Promise<T> | T) => fn(),
    addAction: async <T>(fn: () => Promise<T> | T) => fn(),
  },
}))

jest.mock("../bullboard", () => ({
  automationQueue: {
    add: jest.fn(),
    getBullQueue: jest.fn(),
  },
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    db: {
      ...actual.db,
      doWithDB: jest.fn(),
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
const mockDoWithDB = dbCore.doWithDB as MockedFunction<typeof dbCore.doWithDB>
const mockNewId = coreUtils.newid as MockedFunction<typeof coreUtils.newid>

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
})
