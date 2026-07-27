import { PASSWORD_REPLACEMENT } from "@budibase/types"

export { checkForCollectStep } from "@budibase/shared-core/src/sdk/documents/automations"

export const PASSWORD_DISPLAY_MASK = "********"

export function isMaskedPassword(value?: string) {
  return value === PASSWORD_REPLACEMENT || value === PASSWORD_DISPLAY_MASK
}
