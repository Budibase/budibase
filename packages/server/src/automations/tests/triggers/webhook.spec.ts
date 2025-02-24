import { Table, Webhook, WebhookActionType } from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { mocks } from "@budibase/backend-core/tests"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

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
    await config.api.webhook.buildSchema(config.getAppId(), webhook._id!, {
      parameter: "string",
    })
    await config.publish()
    return { webhook, automation }
  }

  beforeEach(async () => {
    await config.init()
    table = await config.createTable()
  })

  afterAll(() => {
    config.end()
  })

  it("should run the webhook automation - checking for parameters", async () => {
    const { webhook } = await createWebhookAutomation()
    const res = await config.api.webhook.trigger(
      config.getProdAppId(),
      webhook._id!,
      {
        parameter: "testing",
      }
    )
    expect(typeof res).toBe("object")
    const collectedInfo = res as Record<string, any>
    expect(collectedInfo.value).toEqual("testing")
  })
})
