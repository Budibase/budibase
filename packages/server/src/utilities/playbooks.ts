import { features, HTTPError } from "@budibase/backend-core"
import { DocumentType, FeatureFlag, prefixed } from "@budibase/types"
import sdk from "../sdk"

export const resolvePlaybookId = async (playbookId?: string | null) => {
  if (playbookId == null) {
    return undefined
  }

  if (typeof playbookId !== "string") {
    throw new HTTPError("Playbook id must be a string.", 400)
  }

  const value = playbookId.trim() || undefined
  if (!value) {
    return undefined
  }

  if (!value.startsWith(prefixed(DocumentType.PLAYBOOK))) {
    throw new HTTPError(`Playbook '${value}' not found.`, 404)
  }

  if (!(await features.isEnabled(FeatureFlag.PLAYBOOKS))) {
    throw new HTTPError("Playbooks feature is not enabled.", 404)
  }

  const playbook = await sdk.playbooks.get(value)
  if (!playbook) {
    throw new HTTPError(`Playbook '${value}' not found.`, 404)
  }

  return value
}

export const resolveUpdatedPlaybookId = async (
  playbookId: string | null | undefined,
  currentPlaybookId?: string
) => {
  if (playbookId === undefined) {
    return currentPlaybookId
  }

  if (typeof playbookId === "string") {
    const trimmed = playbookId.trim() || undefined
    if (trimmed === currentPlaybookId) {
      return currentPlaybookId
    }
  }

  const resolved = await resolvePlaybookId(playbookId)
  return resolved
}
