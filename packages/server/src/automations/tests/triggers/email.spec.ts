import { setEnv } from "@budibase/backend-core"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { captureAutomationMessages } from "../utilities"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

jest.mock("../../email/utils/fetchMessages", () => ({
  fetchMessages: jest.fn(),
}))

const smtpFallbackEnv = {
  SMTP_FALLBACK_ENABLED: "1",
  SMTP_HOST: "localhost",
  SMTP_PORT: 1025,
  SMTP_FROM_ADDRESS: "dom@dom.dom",
  SMTP_USER: "dom",
  SMTP_PASSWORD: "dom",
}

describe("email trigger", () => {
  const config = new TestConfiguration()
  let resetEnv: (() => void) | undefined

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  beforeEach(async () => {
    resetEnv = setEnv(smtpFallbackEnv)
    const { automations } = await config.api.automation.fetch()
    for (const automation of automations) {
      await config.api.automation.delete(automation)
    }
  })

  afterEach(() => {
    resetEnv?.()
    resetEnv = undefined
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

    const { checkMail } = await import("../../email")
    return {
      checkMail,
      mocks: {
        getClientMock,
        fetchMessagesMock,
        checkSenderMock,
        toOutputFieldsMock,
        logout,
      },
    }
  }

  it("should initialise mailbox state on first run", async () => {
    const { checkMail, mocks } = await loadCheckMail()
    const message = { uid: 5 }
    mocks.fetchMessagesMock.mockResolvedValue([message])

    const result = await checkMail(
      { inputs: { from: "sender@example.com" } } as any,
      "automation-first"
    )

    expect(result).toEqual({ proceed: false, reason: "init, now waiting" })
    expect(mocks.checkSenderMock).not.toHaveBeenCalled()
    expect(mocks.toOutputFieldsMock).not.toHaveBeenCalled()
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
    }

    mocks.fetchMessagesMock
      .mockResolvedValueOnce([initialMessage])
      .mockResolvedValueOnce([initialMessage, newMessage])
    mocks.checkSenderMock.mockReturnValue(true)
    mocks.toOutputFieldsMock.mockReturnValue(fields)

    await checkMail(
      { inputs: { from: "sender@example.com" } } as any,
      "automation-new-mail"
    )
    const { messages, proceed } = await checkMail(
      { inputs: { from: "sender@example.com" } } as any,
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

    await checkMail(
      { inputs: { from: "sender@example.com" } } as any,
      "automation-sender-check"
    )
    const result = await checkMail(
      { inputs: { from: "sender@example.com" } } as any,
      "automation-sender-check"
    )

    expect(result).toEqual({
      proceed: false,
      reason: "sender email does not match expected",
    })
    expect(mocks.toOutputFieldsMock).not.toHaveBeenCalled()
    expect(mocks.logout).toHaveBeenCalledTimes(2)
  })
})
