import { Webhook, WebhookActionType } from "@budibase/types"
import { db as dbCore, context } from "@budibase/backend-core"
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
    action: {
      type,
      target,
    },
  }
}

export async function save(webhook: Webhook) {
  const db = context.getAppDB()
  // check that the webhook exists
  if (webhook._id && isWebhookID(webhook._id)) {
    await db.get(webhook._id)
  } else {
    webhook._id = generateWebhookID()
  }
  const response = await db.put(webhook)
  webhook._rev = response.rev
  return webhook
}

export async function destroy(id: string, rev: string) {
  const db = context.getAppDB()
  if (!id || !isWebhookID(id)) {
    throw new Error("Provided webhook ID is not valid.")
  }
  return await db.remove(id, rev)
}
