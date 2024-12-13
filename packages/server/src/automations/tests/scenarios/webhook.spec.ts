import * as automation from "../../index"
import * as setup from "../utilities"
import { Table, Webhook, WebhookActionType } from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

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
  }

  beforeEach(async () => {
    await automation.init()
    await config.init()
    table = await config.createTable()
  })

  afterAll(setup.afterAll)

  it("should run the webhook automation", async () => {})
})
