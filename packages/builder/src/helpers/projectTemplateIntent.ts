import { notifications } from "@budibase/bbui"
import { Constants, CookieUtils } from "@budibase/frontend-core"
import { PROJECT_TEMPLATE_KEY_PATTERN } from "@budibase/shared-core"
import type { ProjectTemplateIntent } from "@budibase/types"
import { auth } from "@/stores/portal/auth"

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
      console.error("Unable to update Project template intent", error)
      throw new Error(
        result.intent
          ? "Unable to preserve the Project template link. Try again."
          : "Unable to clear the previous Project template link. Try again."
      )
    }
    if (result.intent) {
      CookieUtils.removeCookie(Constants.Cookies.ReturnUrl)
    }
    window.history.replaceState(
      {},
      "",
      `${removeProjectTemplateFromUrl({
        pathname: window.location.pathname,
        search: window.location.search,
      })}${window.location.hash}`
    )
    if (!result.intent) {
      notifications.error("This Project template link is invalid.")
    }
  }
  await initialise()
}
