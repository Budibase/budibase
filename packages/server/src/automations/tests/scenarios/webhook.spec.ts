import * as automation from "../../index"
import * as setup from "../utilities"
import { Table, Webhook, WebhookActionType } from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { mocks } from "@budibase/backend-core/tests"

mocks.licenses.useSyncAutomations()

describe("Branching automations", () => {
  let config = setup.getConfig(),
    table: Table,
    webhook: Webhook

  async function createWebhookAutomation(testName: string) {
    const builder = createAutomationBuilder({
      name: testName,
    })
    const automation = await builder
      .webhook({ fields: { parameter: "string" } })
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
    await automation.init()
    await config.init()
    table = await config.createTable()
  })

  afterAll(setup.afterAll)

  it("should run the webhook automation - checking for parameters", async () => {
    const { webhook } = await createWebhookAutomation(
      "Check a basic webhook works as expected"
    )
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
