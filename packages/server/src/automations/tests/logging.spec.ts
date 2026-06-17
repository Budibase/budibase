import { logging } from "@budibase/backend-core"
import { automations } from "@budibase/pro"
import {
  Automation,
  AutomationActionStepId,
  AutomationResults,
  AutomationStatus,
  AutomationTriggerStepId,
  Workspace,
} from "@budibase/types"
import { setEnv } from "../../environment"
import { publishAutomationLogUpdate } from "../../utilities/automationLogEvents"
import { checkAppMetadata, storeLog } from "../logging"

jest.mock("@budibase/pro", () => ({
  automations: {
    logs: {
      storeLog: jest.fn(),
      oldestLogDate: jest.fn(),
    },
  },
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    logging: {
      ...actual.logging,
      logAlert: jest.fn(),
    },
  }
})

jest.mock("../../utilities/automationLogEvents", () => ({
  publishAutomationLogUpdate: jest.fn(),
}))

const mockStoreLog = automations.logs.storeLog as jest.Mock
const mockOldestLogDate = automations.logs.oldestLogDate as jest.Mock
const mockLogAlert = logging.logAlert as jest.Mock
const mockPublishAutomationLogUpdate = publishAutomationLogUpdate as jest.Mock

const automation = {
  _id: "au_1",
  appId: "app_1",
  name: "Test automation",
} as Automation

const buildResults = (): AutomationResults => ({
  status: AutomationStatus.SUCCESS,
  trigger: {
    id: "trigger",
    stepId: AutomationTriggerStepId.APP,
    outputs: {
      success: true,
    },
  },
  steps: [
    {
      id: "trigger",
      stepId: AutomationTriggerStepId.APP,
      outputs: {
        success: true,
      },
    },
    {
      id: "step_1",
      stepId: AutomationActionStepId.SERVER_LOG,
      inputs: {
        value: "input",
      },
      outputs: {
        value: "output",
        success: true,
      },
    },
    {
      id: "step_2",
      stepId: AutomationActionStepId.SERVER_LOG,
      inputs: {
        value: "input",
      },
      outputs: {
        value: "output",
        success: false,
      },
    },
  ],
})

describe("automation logging", () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it("does not store logs when automation logs are disabled", async () => {
    const restoreEnv = setEnv({ DISABLE_AUTOMATION_LOGS: "1" })
    mockStoreLog.mockResolvedValue(undefined)

    try {
      await storeLog(automation, buildResults())
    } finally {
      restoreEnv()
    }

    expect(mockStoreLog).not.toHaveBeenCalled()
  })

  it("stores automation logs", async () => {
    mockStoreLog.mockResolvedValue(undefined)
    const results = buildResults()

    await storeLog(automation, results)

    expect(mockStoreLog).toHaveBeenCalledWith(automation, results)
  })

  it("publishes an automation log update after storing logs", async () => {
    mockStoreLog.mockResolvedValue(undefined)

    await storeLog(automation, buildResults())

    expect(mockPublishAutomationLogUpdate).toHaveBeenCalledWith(automation)
  })

  it("sanitises oversized logs before storing them", async () => {
    const restoreEnv = setEnv({ AUTOMATION_MAX_LOG_SIZE_MB: 0 })
    mockStoreLog.mockResolvedValue(undefined)
    const results = buildResults()

    try {
      await storeLog(automation, results)
    } finally {
      restoreEnv()
    }

    expect(mockStoreLog).toHaveBeenCalledWith(automation, results)
    expect(results.steps[0].inputs).toEqual({
      message: "[removed] - max results size of 0MB exceeded",
    })
    expect(results.steps[0].outputs).toEqual({
      message: "[removed] - max results size of 0MB exceeded",
      success: true,
    })
    expect(results.steps[2].outputs).toEqual({
      message: "[removed] - max results size of 0MB exceeded",
      success: false,
    })
  })

  it("removes large request data from logging errors before alerting", async () => {
    const error = {
      status: 413,
      request: {
        data: {
          large: "payload",
        },
      },
    }
    mockStoreLog.mockRejectedValue(error)

    await storeLog(automation, buildResults())

    expect(mockPublishAutomationLogUpdate).not.toHaveBeenCalled()
    expect(error.request.data).toEqual({
      message: "removed due to large size",
    })
    expect(mockLogAlert).toHaveBeenCalledWith(
      "Error writing automation log",
      error
    )
  })

  it("alerts when log storage fails for non-size errors", async () => {
    const error = new Error("storage failed")
    mockStoreLog.mockRejectedValue(error)

    await storeLog(automation, buildResults())

    expect(mockPublishAutomationLogUpdate).not.toHaveBeenCalled()
    expect(mockLogAlert).toHaveBeenCalledWith(
      "Error writing automation log",
      error
    )
  })

  it("removes stale automation errors from app metadata", async () => {
    mockOldestLogDate.mockResolvedValue("2024-01-02T00:00:00.000Z")
    const apps = [
      {
        automationErrors: {
          au1: [
            "tenant_au1_2024-01-01T00:00:00.000Z",
            "tenant_au1_2024-01-03T00:00:00.000Z",
            "",
          ],
        },
      },
      {},
    ] as Workspace[]

    const result = await checkAppMetadata(apps)

    expect(result).toBe(apps)
    expect(apps[0].automationErrors).toEqual({
      au1: ["tenant_au1_2024-01-03T00:00:00.000Z"],
    })
  })
})
