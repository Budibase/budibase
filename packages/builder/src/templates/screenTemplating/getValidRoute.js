import sanitizeUrl from "@/helpers/sanitizeUrl"

const arbitraryMax = 10000

const isScreenUrlValid = (screens, url, role) => {
  return !screens.some(
    screen => screen.routing?.route === url && screen.routing?.roleId === role
  )
}

const getValidScreenUrl = (screens, url, role) => {
  const [firstPathSegment = "", ...restPathSegments] = url
    .split("/")
    .filter(segment => segment !== "")

  const restOfPath =
    restPathSegments.length > 0 ? `/${restPathSegments.join("/")}` : ""

  const naiveUrl = sanitizeUrl(`/${firstPathSegment}${restOfPath}`)
  if (isScreenUrlValid(screens, naiveUrl, role)) {
    return naiveUrl
  }

  for (let suffix = 2; suffix < arbitraryMax; suffix++) {
    const suffixedUrl = sanitizeUrl(
      `/${firstPathSegment}-${suffix}${restOfPath}`
    )

    if (isScreenUrlValid(screens, suffixedUrl, role)) {
      return suffixedUrl
    }
  }
}

export default getValidScreenUrl
