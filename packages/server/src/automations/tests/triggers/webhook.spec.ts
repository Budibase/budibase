import { mocks } from "@budibase/backend-core/tests"
import {
  FilterCondition,
  Table,
  Webhook,
  WebhookActionType,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { automationQueue } from "../../bullboard"
import { externalTrigger } from "../../triggers"
import { captureAutomationResults } from "../utilities"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

mocks.licenses.useSyncAutomations()

describe("Webhook trigger test", () => {
  const config = new TestConfiguration()
  let table: Table
  let webhook: Webhook

  async function createWebhookAutomation() {
    const { automation } = await createAutomationBuilder(config)
      .onWebhook({ body: { parameter: "string" } })
      .createRow({
        row: { tableId: table._id!, name: "{{ trigger.parameter }}" },
      })
      .collect({ collection: `{{ trigger.parameter }}` })
      .save()

    webhook = await config.api.webhook.save({
      name: "hook",
      live: true,
      action: {
        type: WebhookActionType.AUTOMATION,
        target: automation._id!,
      },
      bodySchema: {},
    })
    await config.api.webhook.buildSchema(
      config.getDevWorkspaceId(),
      webhook._id!,
      {
        parameter: "string",
      }
    )
    await config.publish()
    return { webhook, automation }
  }

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.api.automation.deleteAll()
    table = await config.createTable()
  })

  afterAll(() => {
    config.end()
  })

  it("should run the webhook automation - checking for parameters", async () => {
    const { webhook } = await createWebhookAutomation()
    const res = await config.withProdApp(() =>
      config.api.webhook.trigger(config.getProdWorkspaceId(), webhook._id!, {
        parameter: "testing",
      })
    )
    expect(typeof res).toBe("object")
    const collectedInfo = res as Record<string, any>
    expect(collectedInfo.value).toEqual("testing")
  })

  it.each([
    { branch: "collect", expected: { success: true, value: "branch value" } },
    { branch: "log", expected: { success: true } },
    { branch: "stop", expected: { success: true } },
    { branch: "error", expected: { success: false } },
  ])(
    "returns a response for the $branch branch",
    async ({ branch, expected }) => {
      const { automation } = await createAutomationBuilder(config)
        .onWebhook({ body: { branch: "string" } })
        .branch({
          collected: {
            condition: { equal: { "{{ trigger.branch }}": "collect" } },
            steps: builder => builder.collect({ collection: "branch value" }),
          },
          uncollected: {
            condition: { equal: { "{{ trigger.branch }}": "log" } },
            steps: builder => builder.serverLog({ text: "Branch completed" }),
          },
          stopped: {
            condition: { equal: { "{{ trigger.branch }}": "stop" } },
            steps: builder =>
              builder.filter({
                field: 1,
                condition: FilterCondition.EQUAL,
                value: 2,
              }),
          },
          failed: {
            condition: { equal: { "{{ trigger.branch }}": "error" } },
            steps: builder =>
              builder.executeScript({
                code: "throw new Error('Branch failed')",
              }),
          },
        })
        .save()
      const webhook = await config.api.webhook.save({
        name: "branching hook",
        live: true,
        action: { type: WebhookActionType.AUTOMATION, target: automation._id! },
        bodySchema: {},
      })
      await config.publish()

      const response = await config.withProdApp(() =>
        config.api.webhook.trigger(config.getProdWorkspaceId(), webhook._id!, {
          branch,
        })
      )
      expect(response).toEqual(expected)
    }
  )

  it("attributes a webhook run to the webhook, not to a person", async () => {
    const { automation } = await createAutomationBuilder(config)
      .onWebhook({ body: {} })
      .serverLog({ text: "hello" })
      .save()
    const webhook = await config.api.webhook.save({
      name: "hook",
      live: true,
      action: {
        type: WebhookActionType.AUTOMATION,
        target: automation._id!,
      },
      bodySchema: {},
    })
    await config.publish()

    const results = await captureAutomationResults(automation, () =>
      config.withProdApp(() =>
        config.api.webhook.trigger(config.getProdWorkspaceId(), webhook._id!, {
          triggeredBy: { type: "user", label: "John Doe" },
        })
      )
    )

    expect(results).toHaveLength(1)
    expect(results[0].data.event.triggeredBy).toEqual({ type: "webhook" })
  })

  it("does not allow webhook fields to override automation execution params", async () => {
    const addMock = jest
      .spyOn(automationQueue, "add")
      .mockResolvedValue({} as Awaited<ReturnType<typeof automationQueue.add>>)

    const { automation } = await createAutomationBuilder(config)
      .onWebhook({ body: {} })
      .serverLog({ text: "{{ trigger.normalData }}" })
      .save()

    await config.doInContext(config.getProdWorkspaceId(), () =>
      externalTrigger(automation, {
        appId: config.getProdWorkspaceId(),
        fields: {
          appId: "app_victim",
          timeout: 1,
          user: { email: "attacker@example.com" },
          metadata: { automationChainCount: -1 },
          triggeredBy: { type: "user", label: "John Doe" },
          normalData: "test",
          body: {
            appId: "app_victim",
            timeout: 1,
            user: { email: "attacker@example.com" },
            metadata: { automationChainCount: -1 },
            normalData: "test",
          },
        },
        triggeredBy: { type: "webhook" },
      })
    )

    const queuedJob = addMock.mock.calls[0][0]
    expect(queuedJob.event.appId).toEqual(config.getProdWorkspaceId())
    expect(queuedJob.event.timeout).toBeUndefined()
    expect(queuedJob.event.user).toBeUndefined()
    expect(queuedJob.event.metadata).toBeUndefined()
    expect(queuedJob.event.triggeredBy).toEqual({ type: "webhook" })
    expect(queuedJob.event).toMatchObject({
      normalData: "test",
      body: {
        appId: "app_victim",
        timeout: 1,
        user: { email: "attacker@example.com" },
        metadata: { automationChainCount: -1 },
        normalData: "test",
      },
    })

    addMock.mockRestore()
  })
})
