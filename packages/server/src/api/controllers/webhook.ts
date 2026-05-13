import { context, db as dbCore, HTTPError } from "@budibase/backend-core"
import * as pro from "@budibase/pro"
import {
  Automation,
  AutomationActionStepId,
  AutomationIOType,
  BuildWebhookSchemaRequest,
  BuildWebhookSchemaResponse,
  Ctx,
  DeleteWebhookResponse,
  FetchWebhooksResponse,
  SaveWebhookRequest,
  SaveWebhookResponse,
  TriggerWebhookRequest,
  TriggerWebhookResponse,
  Webhook,
  WebhookActionType,
} from "@budibase/types"
import * as triggers from "../../automations/triggers"
import { getWebhookParams } from "../../db/utils"
import sdk from "../../sdk"
import { discordWebhook } from "./webhook/discord"
import { MSTeamsWebhook } from "./webhook/ms-teams"
import { slackWebhook } from "./webhook/slack"
import { telegramWebhook } from "./webhook/telegram"

const toJsonSchema = require("to-json-schema")
const validate = require("jsonschema").validate

const AUTOMATION_DESCRIPTION = "Generated from Webhook Schema"

type BuildSchemaCtx = Ctx<
  BuildWebhookSchemaRequest,
  BuildWebhookSchemaResponse,
  { instance: string; id: string }
>

type BuildSchemaWithTokenCtx = Ctx<
  BuildWebhookSchemaRequest,
  BuildWebhookSchemaResponse,
  { instance: string; id: string; schemaToken: string }
>

export async function fetch(ctx: Ctx<void, FetchWebhooksResponse>) {
  const db = context.getWorkspaceDB()
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

const assertSchemaWorkspace = (instance: string) => {
  if (dbCore.isDevWorkspaceID(instance)) {
    return
  }

  throw new HTTPError("Webhook schema can only be built in development", 400)
}

const updateWebhookSchema = async (
  body: BuildWebhookSchemaRequest,
  webhook: Webhook,
  db: ReturnType<typeof context.getWorkspaceDB>
) => {
  webhook.bodySchema = toJsonSchema(body)
  if (webhook.action.type === WebhookActionType.AUTOMATION) {
    let automation = await db.get<Automation>(webhook.action.target)
    const autoOutputs = automation.definition.trigger.schema.outputs
    let properties = webhook.bodySchema?.properties
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
  return await db.put(webhook)
}

export async function buildSchema(ctx: BuildSchemaCtx) {
  assertSchemaWorkspace(ctx.params.instance)

  await context.doInWorkspaceContext(ctx.params.instance, async () => {
    const db = context.getWorkspaceDB()
    const webhook = await db.tryGet<Webhook>(ctx.params.id)
    if (!webhook) {
      throw new HTTPError("Webhook not found", 404)
    }
    ctx.body = await updateWebhookSchema(ctx.request.body, webhook, db)
  })
}

export async function buildSchemaWithToken(ctx: BuildSchemaWithTokenCtx) {
  assertSchemaWorkspace(ctx.params.instance)

  await context.doInWorkspaceContext(ctx.params.instance, async () => {
    const db = context.getWorkspaceDB()
    const webhook = await db.tryGet<Webhook>(ctx.params.id)
    if (
      !webhook?.schemaToken ||
      webhook.schemaToken !== ctx.params.schemaToken
    ) {
      throw new HTTPError("Invalid webhook schema token", 403)
    }

    ctx.body = await updateWebhookSchema(ctx.request.body, webhook, db)
  })
}

export async function trigger(
  ctx: Ctx<TriggerWebhookRequest, TriggerWebhookResponse>
) {
  const prodAppId = dbCore.getProdWorkspaceID(ctx.params.instance)
  const appNotDeployed = () => {
    ctx.body = {
      message: "Application not deployed yet.",
    }
  }
  await context.doInWorkspaceContext(prodAppId, async () => {
    const db = context.getWorkspaceDB()
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
            step => step.stepId === AutomationActionStepId.COLLECT
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

export const discord = discordWebhook
export const MSTeams = MSTeamsWebhook
export const slack = slackWebhook
export const telegram = telegramWebhook
