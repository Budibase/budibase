import { getWebhookParams } from "../../db/utils"
import * as triggers from "../../automations/triggers"
import { db as dbCore, context } from "@budibase/backend-core"
import {
  Webhook,
  WebhookActionType,
  BBContext,
  Automation,
  AutomationActionStepId,
} from "@budibase/types"
import sdk from "../../sdk"
import * as pro from "@budibase/pro"

const toJsonSchema = require("to-json-schema")
const validate = require("jsonschema").validate

const AUTOMATION_DESCRIPTION = "Generated from Webhook Schema"

export async function fetch(ctx: BBContext) {
  const db = context.getAppDB()
  const response = await db.allDocs(
    getWebhookParams(null, {
      include_docs: true,
    })
  )
  ctx.body = response.rows.map((row: any) => row.doc)
}

export async function save(ctx: BBContext) {
  const webhook = await sdk.automations.webhook.save(ctx.request.body)
  ctx.body = {
    message: "Webhook created successfully",
    webhook,
  }
}

export async function destroy(ctx: BBContext) {
  ctx.body = await sdk.automations.webhook.destroy(
    ctx.params.id,
    ctx.params.rev
  )
}

export async function buildSchema(ctx: BBContext) {
  await context.doInAppContext(ctx.params.instance, async () => {
    const db = context.getAppDB()
    const webhook = (await db.get(ctx.params.id)) as Webhook
    webhook.bodySchema = toJsonSchema(ctx.request.body)
    // update the automation outputs
    if (webhook.action.type === WebhookActionType.AUTOMATION) {
      let automation = (await db.get(webhook.action.target)) as Automation
      const autoOutputs = automation.definition.trigger.schema.outputs
      let properties = webhook.bodySchema.properties
      // reset webhook outputs
      autoOutputs.properties = {
        body: autoOutputs.properties.body,
      }
      for (let prop of Object.keys(properties)) {
        autoOutputs.properties[prop] = {
          type: properties[prop].type,
          description: AUTOMATION_DESCRIPTION,
        }
      }
      await db.put(automation)
    }
    ctx.body = await db.put(webhook)
  })
}

export async function trigger(ctx: BBContext) {
  const prodAppId = dbCore.getProdAppID(ctx.params.instance)
  await context.doInAppContext(prodAppId, async () => {
    try {
      const db = context.getAppDB()
      const webhook = (await db.get(ctx.params.id)) as Webhook
      // validate against the schema
      if (webhook.bodySchema) {
        validate(ctx.request.body, webhook.bodySchema)
      }
      const target = await db.get<Automation>(webhook.action.target)
      if (webhook.action.type === WebhookActionType.AUTOMATION) {
        // trigger with both the pure request and then expand it
        // incase the user has produced a schema to bind to
        let hasCollectStep = sdk.automations.utils.checkForCollectStep(target)

        if (hasCollectStep && (await pro.features.isSyncAutomationsEnabled())) {
          const response = await triggers.externalTrigger(
            target,
            {
              body: ctx.request.body,
              ...ctx.request.body,
              appId: prodAppId,
            },
            { getResponses: true }
          )

          let collectedValue = response.steps.find(
            (step: any) => step.stepId === AutomationActionStepId.COLLECT
          )

          ctx.status = 200
          ctx.body = collectedValue.outputs
        } else {
          await triggers.externalTrigger(target, {
            body: ctx.request.body,
            ...ctx.request.body,
            appId: prodAppId,
          })
          ctx.status = 200
          ctx.body = {
            message: "Webhook trigger fired successfully",
          }
        }
      }
    } catch (err: any) {
      if (err.status === 404) {
        ctx.status = 200
        ctx.body = {
          message: "Application not deployed yet.",
        }
      }
    }
  })
}
