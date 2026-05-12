import { context, db as dbCore, utils } from "@budibase/backend-core"
import { Webhook, WebhookActionType } from "@budibase/types"
import { generateWebhookID } from "../../../db/utils"

function isWebhookID(id: string) {
  return id.startsWith(dbCore.DocumentType.WEBHOOK)
}

export function newDoc(
  name: string,
  type: WebhookActionType,
  target: string
): Webhook {
  return {
    live: true,
    name,
    schemaToken: utils.newid(),
    action: {
      type,
      target,
    },
  }
}

export async function save(webhook: Webhook) {
  const db = context.getWorkspaceDB()
  if (webhook._id && isWebhookID(webhook._id)) {
    const existing = await db.get<Webhook>(webhook._id)
    webhook.schemaToken =
      webhook.schemaToken || existing.schemaToken || utils.newid()
  } else {
    webhook._id = generateWebhookID()
    webhook.schemaToken = webhook.schemaToken || utils.newid()
  }
  const response = await db.put(webhook)
  webhook._rev = response.rev
  return webhook
}

export async function destroy(id: string, rev: string) {
  const db = context.getWorkspaceDB()
  if (!id || !isWebhookID(id)) {
    throw new Error("Provided webhook ID is not valid.")
  }
  return await db.remove(id, rev)
}
