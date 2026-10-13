import { auth } from "@/stores/portal/auth"
import { notifications } from "@budibase/bbui"
import type { ProjectTemplateIntent } from "@budibase/types"

export const PROJECT_TEMPLATE_KEY_PATTERN =
  /^project\/[a-z0-9]+(?:-[a-z0-9]+)*$/
const MAX_PROJECT_TEMPLATE_KEY_LENGTH = 200

export interface ProjectTemplateUrlIntent {
  present: boolean
  intent?: ProjectTemplateIntent
}

export const readProjectTemplateUrlIntent = (
  search: string
): ProjectTemplateUrlIntent => {
  const params = new URLSearchParams(search)
  if (!params.has("template")) {
    return { present: false }
  }

  const templateKey = params.get("template") || ""
  if (
    templateKey.length > MAX_PROJECT_TEMPLATE_KEY_LENGTH ||
    !PROJECT_TEMPLATE_KEY_PATTERN.test(templateKey)
  ) {
    return { present: true }
  }

  return {
    present: true,
    intent: { templateKey },
  }
}

export const removeProjectTemplateFromUrl = ({
  pathname,
  search,
}: {
  pathname: string
  search: string
}) => {
  const params = new URLSearchParams(search)
  params.delete("template")
  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

export const initialiseBuilderWithTemplateIntent = async ({
  initialise,
}: {
  initialise: () => Promise<void>
}) => {
  const result = readProjectTemplateUrlIntent(window.location.search)
  if (result.present) {
    try {
      await auth.setInitInfo(
        result.intent ? { projectTemplate: result.intent } : {}
      )
    } catch (error) {
      console.error("Unable to preserve Project template intent", error)
      throw new Error(
        "Unable to preserve the Project template link. Try again."
      )
    }
    window.history.replaceState(
      {},
      "",
      removeProjectTemplateFromUrl({
        pathname: window.location.pathname,
        search: window.location.search,
      })
    )
    if (!result.intent) {
      notifications.error("This Project template link is invalid.")
    }
  }
  await initialise()
}
