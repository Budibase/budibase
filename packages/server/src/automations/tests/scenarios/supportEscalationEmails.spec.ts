import { setEnv as setCoreEnv } from "@budibase/backend-core"
import {
  FilterCondition,
  SendEmailResponse,
  SmtpEmailStepInputs,
} from "@budibase/types"
import { setupDefaultCompletionsAIConfig } from "../../../tests/utilities/aiConfig"
import { mockChatGPTResponse } from "../../../tests/utilities/mocks/ai/openai"
import * as workerRequests from "../../../utilities/workerRequests"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

jest.mock("../../../utilities/workerRequests", () => ({
  sendSmtpEmail: jest.fn(),
}))

const emailResponse = (to: string): SendEmailResponse => ({
  message: `Email sent to ${to}.`,
  accepted: [to],
  envelope: {
    from: "support@example.com",
    to: [to],
  },
  messageId: "support-escalation-id",
  pending: [],
  rejected: [],
  response: "queued",
})

describe("Support escalation email automations", () => {
  const config = new TestConfiguration()
  let resetEnv: (() => void) | undefined
  let cleanupDefaultAIConfig: (() => Promise<void>) | undefined

  beforeAll(async () => {
    await config.init()
    await automation.init()
  })

  beforeEach(async () => {
    await config.api.automation.deleteAll()
    resetEnv = setCoreEnv({ SELF_HOSTED: false })
    cleanupDefaultAIConfig = await setupDefaultCompletionsAIConfig(config)
    await config.publish()
    jest.clearAllMocks()
  })

  afterEach(async () => {
    await cleanupDefaultAIConfig?.()
    resetEnv?.()
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("classifies urgent tickets and emails the escalation owner", async () => {
    mockChatGPTResponse("Urgent")
    jest
      .spyOn(workerRequests, "sendSmtpEmail")
      .mockResolvedValueOnce(emailResponse("tier2@example.com"))

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .classify({
        inputType: "text",
        textInput: "{{ trigger.fields.message }}",
        categoryItems: [{ category: "Routine" }, { category: "Urgent" }],
      })
      .filter({
        field: "{{ steps.1.category }}",
        condition: FilterCondition.EQUAL,
        value: "Urgent",
      })
      .sendSmtpEmail({
        to: "tier2@example.com",
        from: "support@example.com",
        subject: "Urgent support ticket",
        contents:
          "<p>{{ trigger.fields.customer }} needs help: {{ trigger.fields.message }}</p>",
      } as SmtpEmailStepInputs)
      .serverLog({
        text: "Escalated {{ trigger.fields.customer }} to tier 2",
      })
      .test({
        fields: {
          customer: "Acme",
          message: "Production users cannot sign in.",
        },
      })

    expect(results.steps[0].outputs.category).toBe("Urgent")
    expect(results.steps[2].outputs.response).toEqual(
      emailResponse("tier2@example.com")
    )
    expect(workerRequests.sendSmtpEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "tier2@example.com",
        from: "support@example.com",
        subject: "Urgent support ticket",
        contents: "<p>Acme needs help: Production users cannot sign in.</p>",
        automation: true,
      })
    )
    expect(results.steps[3].outputs.message).toContain(
      "Escalated Acme to tier 2"
    )
  })
})
