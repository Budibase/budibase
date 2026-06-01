import { mocks } from "@budibase/backend-core/tests"
import { Table, Webhook, WebhookActionType } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { automationQueue } from "../../bullboard"
import { externalTrigger } from "../../triggers"
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
          normalData: "test",
          body: {
            appId: "app_victim",
            timeout: 1,
            user: { email: "attacker@example.com" },
            metadata: { automationChainCount: -1 },
            normalData: "test",
          },
        },
      })
    )

    const queuedJob = addMock.mock.calls[0][0]
    expect(queuedJob.event.appId).toEqual(config.getProdWorkspaceId())
    expect(queuedJob.event.timeout).toBeUndefined()
    expect(queuedJob.event.user).toBeUndefined()
    expect(queuedJob.event.metadata).toBeUndefined()
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
