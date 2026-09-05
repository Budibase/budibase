import {
  type Automation,
  isEmailTrigger,
  PASSWORD_REPLACEMENT,
} from "@budibase/types"

export { checkForCollectStep } from "@budibase/shared-core/src/sdk/documents/automations"

export const PASSWORD_DISPLAY_MASK = "********"

export function isMaskedPassword(value?: string) {
  return value === PASSWORD_REPLACEMENT || value === PASSWORD_DISPLAY_MASK
}

export const sanitiseAutomationForExport = (
  automation: Automation
): Automation => {
  const sanitized = structuredClone(automation)
  const trigger = sanitized.definition?.trigger
  if (isEmailTrigger(trigger) && trigger.inputs) {
    const { host, port, secure, username, authType, mailbox } = trigger.inputs
    trigger.inputs = { host, port, secure, username, authType, mailbox }
  }
  return sanitized
}
