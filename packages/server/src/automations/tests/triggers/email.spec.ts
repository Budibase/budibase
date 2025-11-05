import { configs } from "@budibase/backend-core"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { captureAutomationMessages } from "../utilities"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { ConfigType, IMAPInnerConfig } from "@budibase/types"

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
      .onEmail({})
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
    const toOutputFieldsMock = jest.fn()
    const getLastSeenUidMock = jest.fn().mockResolvedValue(undefined)
    const setLastSeenUidMock = jest.fn().mockResolvedValue(undefined)

    jest.doMock("../../email/utils/getClient", () => ({
      getClient: getClientMock,
    }))
    jest.doMock("../../email/utils/fetchMessages", () => ({
      fetchMessages: fetchMessagesMock,
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

    const result = await checkMail("automation-first")

    expect(result).toEqual({ proceed: false, reason: "init, now waiting" })
    expect(mocks.toOutputFieldsMock).not.toHaveBeenCalled()
    expect(mocks.setLastSeenUidMock).toHaveBeenCalledWith("automation-first", 5)
    expect(mocks.logout).toHaveBeenCalledTimes(1)
  })

  it("should return output fields when a new message arrives", async () => {
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
      bodyText: "Parsed email body",
      bodyTextTruncated: false,
    }

    mocks.fetchMessagesMock
      .mockResolvedValueOnce([initialMessage])
      .mockResolvedValueOnce([initialMessage, newMessage])
    mocks.toOutputFieldsMock.mockResolvedValue(fields)
    mocks.getLastSeenUidMock
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(10)

    await checkMail("automation-new-mail")
    const { messages, proceed } = await checkMail("automation-new-mail")

    const result = messages?.[0]

    expect(proceed).toBeTrue()
    expect(result).toEqual(fields)
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

  it("should process all unseen messages regardless of sender", async () => {
    const { checkMail, mocks } = await loadCheckMail()
    const initialMessage = { uid: 50 }
    const firstNewMessage = {
      uid: 51,
      envelope: { from: [{ address: "sender@example.com" }] },
    }
    const secondNewMessage = {
      uid: 52,
      envelope: { from: [{ address: "other@example.com" }] },
    }
    const firstFields = {
      from: "sender@example.com",
      bodyText: "First body",
      bodyTextTruncated: false,
    }
    const secondFields = {
      from: "other@example.com",
      bodyText: "Second body",
      bodyTextTruncated: false,
    }

    mocks.fetchMessagesMock
      .mockResolvedValueOnce([initialMessage])
      .mockResolvedValueOnce([
        initialMessage,
        firstNewMessage,
        secondNewMessage,
      ])
    mocks.toOutputFieldsMock
      .mockResolvedValueOnce(firstFields)
      .mockResolvedValueOnce(secondFields)
    mocks.getLastSeenUidMock
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(50)

    await checkMail("automation-multi-send")
    const { proceed, messages } = await checkMail("automation-multi-send")

    expect(proceed).toBeTrue()
    expect(messages).toEqual([firstFields, secondFields])
    expect(mocks.toOutputFieldsMock).toHaveBeenNthCalledWith(1, firstNewMessage)
    expect(mocks.toOutputFieldsMock).toHaveBeenNthCalledWith(
      2,
      secondNewMessage
    )
    expect(mocks.setLastSeenUidMock).toHaveBeenNthCalledWith(
      1,
      "automation-multi-send",
      50
    )
    expect(mocks.setLastSeenUidMock).toHaveBeenNthCalledWith(
      2,
      "automation-multi-send",
      52
    )
    expect(mocks.logout).toHaveBeenCalledTimes(2)
  })
})
