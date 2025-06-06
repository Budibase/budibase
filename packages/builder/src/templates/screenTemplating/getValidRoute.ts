import sanitizeUrl from "@/helpers/sanitizeUrl"
import { Screen } from "@budibase/types"

const arbitraryMax = 10000

const isScreenUrlValid = (
  screens: Screen[],
  url: string,
  role: string,
  workspaceAppId: string | undefined
) => {
  return !screens.some(
    screen =>
      screen.routing?.route === url &&
      screen.routing?.roleId === role &&
      screen.workspaceAppId === workspaceAppId
  )
}

const getValidScreenUrl = (
  screens: Screen[],
  url: string,
  role: string,
  workspaceAppId: string | undefined
): string => {
  const [firstPathSegment = "", ...restPathSegments] = url
    .split("/")
    .filter(segment => segment !== "")

  const restOfPath =
    restPathSegments.length > 0 ? `/${restPathSegments.join("/")}` : ""

  const naiveUrl = sanitizeUrl(`/${firstPathSegment}${restOfPath}`)
  if (isScreenUrlValid(screens, naiveUrl, role, workspaceAppId)) {
    return naiveUrl
  }

  for (let suffix = 2; suffix < arbitraryMax; suffix++) {
    const suffixedUrl = sanitizeUrl(
      `/${firstPathSegment}-${suffix}${restOfPath}`
    )

    if (isScreenUrlValid(screens, suffixedUrl, role, workspaceAppId)) {
      return suffixedUrl
    }
  }

  return ""
}

export default getValidScreenUrl
