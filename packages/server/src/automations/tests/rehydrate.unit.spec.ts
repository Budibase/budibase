import {
  Automation,
  AutomationStepType,
  AutomationTriggerStepId,
} from "@budibase/types"
import env, { setEnv } from "../../environment"
import { context, db as dbCore } from "@budibase/backend-core"
import { automationQueue } from "../bullboard"
import { enableCronOrEmailTrigger } from "../utils"
import { rehydrateScheduledTriggers } from "../rehydrate"

jest.mock("../bullboard", () => ({
  automationQueue: {
    getBullQueue: jest.fn(),
  },
}))

jest.mock("../utils", () => {
  const actual = jest.requireActual("../utils")
  return {
    ...actual,
    enableCronOrEmailTrigger: jest.fn(),
  }
})

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: jest.fn(),
      doInWorkspaceContext: jest.fn((_workspaceId, fn) => fn()),
    },
    db: {
      ...actual.db,
      getAllWorkspaces: jest.fn(),
    },
  }
})

const mockGetBullQueue = automationQueue.getBullQueue as jest.Mock
const mockEnableCronOrEmailTrigger = enableCronOrEmailTrigger as jest.Mock
const mockGetAllWorkspaces = dbCore.getAllWorkspaces as jest.Mock
const mockGetWorkspaceDB = context.getWorkspaceDB as jest.Mock
const mockDoInWorkspaceContext = context.doInWorkspaceContext as jest.Mock

const buildAutomation = (
  stepId: AutomationTriggerStepId,
  inputs: Record<string, unknown>,
  cronJobId?: string,
  extra: Partial<Automation> = {}
): Automation => ({
  _id: `automation_${stepId}`,
  _rev: "1-abc",
  appId: "app_prod",
  name: "Automation",
  definition: {
    steps: [],
    trigger: {
      id: "trigger",
      name: "Trigger",
      tagline: "Trigger",
      icon: "trigger",
      description: "",
      type: AutomationStepType.TRIGGER,
      schema: { inputs: { properties: {} }, outputs: { properties: {} } },
      stepId,
      inputs,
      cronJobId,
    },
  },
  type: "automation",
  ...extra,
})

describe("rehydrateScheduledTriggers unit", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetBullQueue.mockReturnValue({
      getRepeatableJobs: jest.fn().mockResolvedValue([]),
    })
    mockGetAllWorkspaces.mockResolvedValue(["app_prod"])
    mockGetWorkspaceDB.mockReturnValue({
      allDocs: jest.fn().mockResolvedValue({ rows: [] }),
    })
    mockEnableCronOrEmailTrigger.mockImplementation(
      async (_appId, automation) => ({ automation })
    )
  })

  it("does not run when startup rehydration is disabled by environment", async () => {
    const restoreEnv = setEnv({ SELF_HOSTED: undefined, MULTI_TENANCY: "1" })

    try {
      await rehydrateScheduledTriggers()
    } finally {
      restoreEnv()
    }

    expect(mockGetBullQueue).not.toHaveBeenCalled()
  })

  it("rehydrates missing cron and email triggers and skips existing jobs", async () => {
    const restoreEnv = setEnv({ SELF_HOSTED: "1", MULTI_TENANCY: 0 as any })
    const cronAutomation = buildAutomation(
      AutomationTriggerStepId.CRON,
      { cron: "* * * * *" },
      "existing_cron"
    )
    const emailAutomation = buildAutomation(
      AutomationTriggerStepId.EMAIL,
      { host: "imap", port: 993, username: "u", password: "p" },
      "existing_email"
    )
    const alreadyScheduled = buildAutomation(
      AutomationTriggerStepId.CRON,
      { cron: "0 * * * *" },
      "scheduled_cron"
    )
    mockGetBullQueue.mockReturnValue({
      getRepeatableJobs: jest.fn().mockResolvedValue([
        { id: undefined, cron: "* * * * *" },
        { id: "scheduled_cron", cron: "0 * * * *" },
      ]),
    })
    mockGetWorkspaceDB.mockReturnValue({
      allDocs: jest.fn().mockResolvedValue({
        rows: [
          { doc: cronAutomation },
          { doc: emailAutomation },
          { doc: alreadyScheduled },
          { doc: buildAutomation(AutomationTriggerStepId.CRON, {}, undefined, { disabled: true }) },
        ],
      }),
    })
    mockEnableCronOrEmailTrigger.mockImplementation(
      async (_appId, automation: Automation) => {
        automation.definition.trigger.cronJobId = `${automation._id}_new`
        return { automation }
      }
    )
    const consoleLog = jest.spyOn(console, "log").mockImplementation()

    try {
      await rehydrateScheduledTriggers()
    } finally {
      restoreEnv()
      consoleLog.mockRestore()
    }

    expect(mockGetAllWorkspaces).toHaveBeenCalledWith({
      dev: false,
      idsOnly: true,
    })
    expect(mockDoInWorkspaceContext).toHaveBeenCalledWith(
      "app_prod",
      expect.any(Function)
    )
    expect(mockEnableCronOrEmailTrigger).toHaveBeenCalledTimes(2)
    expect(mockEnableCronOrEmailTrigger).toHaveBeenCalledWith(
      "app_prod",
      cronAutomation
    )
    expect(mockEnableCronOrEmailTrigger).toHaveBeenCalledWith(
      "app_prod",
      emailAutomation
    )
  })
})
