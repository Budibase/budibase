import { getWebhookParams } from "../../db/utils"
import * as triggers from "../../automations/triggers"
import { db as dbCore, context } from "@budibase/backend-core"
import {
  Webhook,
  WebhookActionType,
  Ctx,
  Automation,
  AutomationActionStepId,
  FetchWebhooksResponse,
  SaveWebhookResponse,
  SaveWebhookRequest,
  DeleteWebhookResponse,
  BuildWebhookSchemaRequest,
  BuildWebhookSchemaResponse,
  TriggerWebhookRequest,
  TriggerWebhookResponse,
  AutomationIOType,
} from "@budibase/types"
import sdk from "../../sdk"
import * as pro from "@budibase/pro"

const toJsonSchema = require("to-json-schema")
const validate = require("jsonschema").validate

const AUTOMATION_DESCRIPTION = "Generated from Webhook Schema"

export async function fetch(ctx: Ctx<void, FetchWebhooksResponse>) {
  const db = context.getAppDB()
  const response = await db.allDocs<Webhook>(
    getWebhookParams(null, {
      include_docs: true,
    })
  )
  ctx.body = response.rows.filter(row => row.doc).map(row => row.doc!)
}

export async function save(ctx: Ctx<SaveWebhookRequest, SaveWebhookResponse>) {
  const webhook = await sdk.automations.webhook.save(ctx.request.body)
  ctx.body = {
    message: "Webhook created successfully",
    webhook,
  }
}

export async function destroy(ctx: Ctx<void, DeleteWebhookResponse>) {
  ctx.body = await sdk.automations.webhook.destroy(
    ctx.params.id,
    ctx.params.rev
  )
}

export async function buildSchema(
  ctx: Ctx<BuildWebhookSchemaRequest, BuildWebhookSchemaResponse>
) {
  await context.doInAppContext(ctx.params.instance, async () => {
    const db = context.getAppDB()
    const webhook = await db.get<Webhook>(ctx.params.id)
    webhook.bodySchema = toJsonSchema(ctx.request.body)
    // update the automation outputs
    if (webhook.action.type === WebhookActionType.AUTOMATION) {
      let automation = await db.get<Automation>(webhook.action.target)
      const autoOutputs = automation.definition.trigger.schema.outputs
      let properties = webhook.bodySchema?.properties
      // reset webhook outputs
      autoOutputs.properties = {
        body: autoOutputs.properties.body,
      }
      for (let prop of Object.keys(properties || {})) {
        if (properties?.[prop] == null) {
          continue
        }
        const def = properties[prop]
        if (typeof def === "boolean") {
          continue
        }
        autoOutputs.properties[prop] = {
          type: def.type as AutomationIOType,
          description: AUTOMATION_DESCRIPTION,
        }
      }
      await db.put(automation)
    }
    ctx.body = await db.put(webhook)
  })
}

export async function trigger(
  ctx: Ctx<TriggerWebhookRequest, TriggerWebhookResponse>
) {
  const prodAppId = dbCore.getProdAppID(ctx.params.instance)
  const appNotDeployed = () => {
    ctx.body = {
      message: "Application not deployed yet.",
    }
  }
  await context.doInAppContext(prodAppId, async () => {
    const db = context.getAppDB()
    const webhook = await db.tryGet<Webhook>(ctx.params.id)
    if (!webhook) {
      return appNotDeployed()
    }
    // validate against the schema
    if (webhook.bodySchema) {
      validate(ctx.request.body, webhook.bodySchema)
    }
    const target = await db.tryGet<Automation>(webhook.action.target)
    if (!target) {
      return appNotDeployed()
    }
    if (webhook.action.type === WebhookActionType.AUTOMATION) {
      // trigger with both the pure request and then expand it
      // incase the user has produced a schema to bind to
      let hasCollectStep = sdk.automations.utils.checkForCollectStep(target)

      if (hasCollectStep && (await pro.features.isSyncAutomationsEnabled())) {
        const response = await triggers.externalTrigger(
          target,
          {
            fields: {
              ...ctx.request.body,
              body: ctx.request.body,
            },
            appId: prodAppId,
          },
          { getResponses: true }
        )

        if (triggers.isAutomationResults(response)) {
          let collectedValue = response.steps.find(
            (step: any) => step.stepId === AutomationActionStepId.COLLECT
          )

          ctx.body = collectedValue?.outputs
        } else {
          ctx.throw(400, "Automation did not have a collect block.")
        }
      } else {
        await triggers.externalTrigger(target, {
          fields: {
            ...ctx.request.body,
            body: ctx.request.body,
          },
          appId: prodAppId,
        })
        ctx.body = {
          message: "Webhook trigger fired successfully",
        }
      }
    }
  })
}
