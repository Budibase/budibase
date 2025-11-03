import { configs } from "@budibase/backend-core"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { captureAutomationMessages } from "../utilities"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import {
  AutomationTriggerSchema,
  AutomationTriggerStepId,
  ConfigType,
  IMAPInnerConfig,
} from "@budibase/types"
import { FetchMessageObject } from "imapflow"

jest.mock("../../email/utils/fetchMessages", () => ({
  fetchMessages: jest.fn(),
}))

const imapConfig: IMAPInnerConfig = {
  host: "localhost",
  port: 993,
  secure: false,
  auth: {
    user: "dom",
    pass: "dom",
  },
}

describe("email trigger", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  beforeEach(async () => {
    await config.doInTenant(() =>
      configs.save({
        type: ConfigType.IMAP,
        config: imapConfig,
      })
    )
    const { automations } = await config.api.automation.fetch()
    for (const automation of automations) {
      await config.api.automation.delete(automation)
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should queue a Bull cron job", async () => {
    const { automation } = await createAutomationBuilder(config)
      .onEmail({ from: "dom@dom.dom" })
      .serverLog({
        text: "Hello, world!",
      })
      .save()

    const messages = await captureAutomationMessages(automation, () =>
      config.api.workspace.publish()
    )
    expect(messages).toHaveLength(1)

    const repeat = messages[0].opts?.repeat
    expect(repeat).toEqual({ every: 30_000 })
  })
})

describe("checkMail behaviour", () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  const loadCheckMail = async () => {
    jest.resetModules()

    const logout = jest.fn().mockResolvedValue(undefined)
    const getClientMock = jest.fn().mockResolvedValue({ logout })
    const fetchMessagesMock = jest.fn()
    const checkSenderMock = jest.fn()
    const toOutputFieldsMock = jest.fn()
    const getLastSeenUidMock = jest.fn().mockResolvedValue(undefined)
    const setLastSeenUidMock = jest.fn().mockResolvedValue(undefined)

    jest.doMock("../../email/utils/getClient", () => ({
      getClient: getClientMock,
    }))
    jest.doMock("../../email/utils/fetchMessages", () => ({
      fetchMessages: fetchMessagesMock,
    }))
    jest.doMock("../../email/utils/checkSender", () => ({
      checkSender: checkSenderMock,
    }))
    jest.doMock("../../email/utils/toOutputFields", () => ({
      toOutputFields: toOutputFieldsMock,
    }))
    jest.doMock("../../email/state", () => ({
      getLastSeenUid: getLastSeenUidMock,
      setLastSeenUid: setLastSeenUidMock,
    }))

    const { checkMail } = await import("../../email")
    return {
      checkMail,
      mocks: {
        getClientMock,
        fetchMessagesMock,
        checkSenderMock,
        toOutputFieldsMock,
        getLastSeenUidMock,
        setLastSeenUidMock,
        logout,
      },
    }
  }

  it("should initialise mailbox state on first run", async () => {
    const { checkMail, mocks } = await loadCheckMail()
    const message = { uid: 5 }
    mocks.fetchMessagesMock.mockResolvedValue([message])
    mocks.getLastSeenUidMock.mockResolvedValueOnce(undefined)

    const result = await checkMail(
      {
        inputs: { from: "sender@example.com" },
      } as AutomationTriggerSchema<AutomationTriggerStepId.EMAIL>,
      "automation-first"
    )

    expect(result).toEqual({ proceed: false, reason: "init, now waiting" })
    expect(mocks.checkSenderMock).not.toHaveBeenCalled()
    expect(mocks.toOutputFieldsMock).not.toHaveBeenCalled()
    expect(mocks.setLastSeenUidMock).toHaveBeenCalledWith("automation-first", 5)
    expect(mocks.logout).toHaveBeenCalledTimes(1)
  })

  it("should return output fields when a new message arrives from the expected sender", async () => {
    const { checkMail, mocks } = await loadCheckMail()
    const initialMessage = { uid: 10 }
    const newMessage = {
      uid: 11,
      envelope: { from: [{ address: "sender@example.com" }] },
    }
    const fields = {
      from: "sender@example.com",
      to: "recipient@example.com",
      subject: "Hello",
      sentAt: "2024-01-01T00:00:00.000Z",
    }

    mocks.fetchMessagesMock
      .mockResolvedValueOnce([initialMessage])
      .mockResolvedValueOnce([initialMessage, newMessage])
    mocks.checkSenderMock.mockReturnValue(true)
    mocks.toOutputFieldsMock.mockReturnValue(fields)
    mocks.getLastSeenUidMock
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(10)

    await checkMail(
      {
        inputs: { from: "sender@example.com" },
      } as AutomationTriggerSchema<AutomationTriggerStepId.EMAIL>,
      "automation-new-mail"
    )
    const { messages, proceed } = await checkMail(
      {
        inputs: { from: "sender@example.com" },
      } as AutomationTriggerSchema<AutomationTriggerStepId.EMAIL>,
      "automation-new-mail"
    )

    const result = messages?.[0]

    expect(proceed).toBeTrue()
    expect(result).toEqual(fields)
    expect(mocks.checkSenderMock).toHaveBeenCalledWith(
      "sender@example.com",
      newMessage
    )
    expect(mocks.toOutputFieldsMock).toHaveBeenCalledWith(newMessage)
    expect(mocks.setLastSeenUidMock).toHaveBeenNthCalledWith(
      1,
      "automation-new-mail",
      10
    )
    expect(mocks.setLastSeenUidMock).toHaveBeenNthCalledWith(
      2,
      "automation-new-mail",
      11
    )
    expect(mocks.logout).toHaveBeenCalledTimes(2)
  })

  it("should skip processing when the sender does not match the configured address", async () => {
    const { checkMail, mocks } = await loadCheckMail()
    const initialMessage = { uid: 20 }
    const unexpectedSenderMessage = {
      uid: 21,
      envelope: { from: [{ address: "other@example.com" }] },
    }

    mocks.fetchMessagesMock
      .mockResolvedValueOnce([initialMessage])
      .mockResolvedValueOnce([unexpectedSenderMessage])
    mocks.checkSenderMock.mockReturnValue(false)
    mocks.getLastSeenUidMock
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(20)

    await checkMail(
      {
        inputs: { from: "sender@example.com" },
      } as AutomationTriggerSchema<AutomationTriggerStepId.EMAIL>,
      "automation-sender-check"
    )
    const result = await checkMail(
      {
        inputs: { from: "sender@example.com" },
      } as AutomationTriggerSchema<AutomationTriggerStepId.EMAIL>,
      "automation-sender-check"
    )

    expect(result).toEqual({
      proceed: false,
      reason: "sender email does not match expected",
    })
    expect(mocks.toOutputFieldsMock).not.toHaveBeenCalled()
    expect(mocks.setLastSeenUidMock).toHaveBeenNthCalledWith(
      1,
      "automation-sender-check",
      20
    )
    expect(mocks.setLastSeenUidMock).toHaveBeenNthCalledWith(
      2,
      "automation-sender-check",
      21
    )
    expect(mocks.logout).toHaveBeenCalledTimes(2)
  })

  it("should allow any sender when no filter is configured", async () => {
    const { checkMail, mocks } = await loadCheckMail()
    const initialMessage = { uid: 30 }
    const newMessage = {
      uid: 31,
      envelope: { from: [{ address: "anyone@example.com" }] },
    }
    const fields = {
      from: "anyone@example.com",
      to: "recipient@example.com",
      subject: "Hello from anyone",
      sentAt: "2024-02-02T00:00:00.000Z",
    }

    mocks.fetchMessagesMock
      .mockResolvedValueOnce([initialMessage])
      .mockResolvedValueOnce([initialMessage, newMessage])
    mocks.checkSenderMock.mockReturnValue(true)
    mocks.toOutputFieldsMock.mockReturnValue(fields)
    mocks.getLastSeenUidMock
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(30)

    await checkMail(
      {
        inputs: {},
      } as AutomationTriggerSchema<AutomationTriggerStepId.EMAIL>,
      "automation-no-filter"
    )
    const { proceed, messages } = await checkMail(
      { inputs: {} } as any,
      "automation-no-filter"
    )

    expect(proceed).toBeTrue()
    expect(messages?.[0]).toEqual(fields)
    expect(mocks.checkSenderMock).toHaveBeenCalledWith(undefined, newMessage)
    expect(mocks.setLastSeenUidMock).toHaveBeenNthCalledWith(
      1,
      "automation-no-filter",
      30
    )
    expect(mocks.setLastSeenUidMock).toHaveBeenNthCalledWith(
      2,
      "automation-no-filter",
      31
    )
    expect(mocks.logout).toHaveBeenCalledTimes(2)
  })

  it("should emit matching messages even when later emails fail the sender check", async () => {
    const { checkMail, mocks } = await loadCheckMail()
    const initialMessage = { uid: 40 }
    const matchingMessage = {
      uid: 41,
      envelope: { from: [{ address: "sender@example.com" }] },
    }
    const unexpectedMessage = {
      uid: 42,
      envelope: { from: [{ address: "other@example.com" }] },
    }
    const fields = { from: "sender@example.com" }

    mocks.fetchMessagesMock
      .mockResolvedValueOnce([initialMessage])
      .mockResolvedValueOnce([matchingMessage, unexpectedMessage])
    mocks.checkSenderMock.mockReturnValueOnce(true).mockReturnValueOnce(false)
    mocks.toOutputFieldsMock.mockReturnValueOnce(fields)
    mocks.getLastSeenUidMock
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(40)

    await checkMail(
      {
        inputs: { from: "sender@example.com" },
      } as AutomationTriggerSchema<AutomationTriggerStepId.EMAIL>,
      "automation-mixed-send"
    )
    const { proceed, messages } = await checkMail(
      {
        inputs: { from: "sender@example.com" },
      } as AutomationTriggerSchema<AutomationTriggerStepId.EMAIL>,
      "automation-mixed-send"
    )

    expect(proceed).toBeTrue()
    expect(messages).toEqual([fields])
    expect(mocks.checkSenderMock).toHaveBeenNthCalledWith(
      1,
      "sender@example.com",
      matchingMessage
    )
    expect(mocks.checkSenderMock).toHaveBeenNthCalledWith(
      2,
      "sender@example.com",
      unexpectedMessage
    )
    expect(mocks.toOutputFieldsMock).toHaveBeenCalledTimes(1)
    expect(mocks.setLastSeenUidMock).toHaveBeenNthCalledWith(
      1,
      "automation-mixed-send",
      40
    )
    expect(mocks.setLastSeenUidMock).toHaveBeenNthCalledWith(
      2,
      "automation-mixed-send",
      42
    )
  })

  it("should filter out non-matching senders when a later email matches", async () => {
    const { checkMail, mocks } = await loadCheckMail()
    const initialMessage = { uid: 50 }
    const unexpectedMessage = {
      uid: 51,
      envelope: { from: [{ address: "other@example.com" }] },
    }
    const matchingMessage = {
      uid: 52,
      envelope: { from: [{ address: "sender@example.com" }] },
    }
    const fields = { from: "sender@example.com" }

    mocks.fetchMessagesMock
      .mockResolvedValueOnce([initialMessage])
      .mockResolvedValueOnce([unexpectedMessage, matchingMessage])
    mocks.checkSenderMock.mockReturnValueOnce(false).mockReturnValueOnce(true)
    mocks.toOutputFieldsMock.mockReturnValueOnce(fields)
    mocks.getLastSeenUidMock
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(50)

    await checkMail(
      {
        inputs: { from: "sender@example.com" },
      } as AutomationTriggerSchema<AutomationTriggerStepId.EMAIL>,
      "automation-filtered-send"
    )
    const { proceed, messages } = await checkMail(
      {
        inputs: { from: "sender@example.com" },
      } as AutomationTriggerSchema<AutomationTriggerStepId.EMAIL>,
      "automation-filtered-send"
    )

    expect(proceed).toBeTrue()
    expect(messages).toEqual([fields])
    expect(mocks.checkSenderMock).toHaveBeenNthCalledWith(
      1,
      "sender@example.com",
      unexpectedMessage
    )
    expect(mocks.checkSenderMock).toHaveBeenNthCalledWith(
      2,
      "sender@example.com",
      matchingMessage
    )
    expect(mocks.toOutputFieldsMock).toHaveBeenCalledTimes(1)
    expect(mocks.setLastSeenUidMock).toHaveBeenNthCalledWith(
      1,
      "automation-filtered-send",
      50
    )
    expect(mocks.setLastSeenUidMock).toHaveBeenNthCalledWith(
      2,
      "automation-filtered-send",
      52
    )
  })
})

describe("checkSender", () => {
  const { checkSender } = jest.requireActual<
    typeof import("../../email/utils/checkSender")
  >("../../email/utils/checkSender")

  it("returns true when no expected sender is provided", () => {
    const message = {
      envelope: { from: [{ address: "sender@example.com" }] },
    } as FetchMessageObject

    expect(checkSender(undefined, message)).toBeTrue()
    expect(checkSender("   ", message)).toBeTrue()
  })

  it("performs a trimmed, case-insensitive comparison", () => {
    const message = {
      envelope: { from: [{ address: "sender@example.com" }] },
    } as FetchMessageObject

    expect(checkSender("SENDER@EXAMPLE.COM", message)).toBeTrue()
    expect(checkSender("other@example.com", message)).toBeFalse()
  })
})
