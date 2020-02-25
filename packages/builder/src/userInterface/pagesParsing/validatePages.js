import { isString, keys, flatten, isArray, map, filter } from "lodash/fp"
import { common } from "../../../../core/src"
const pipe = common.$

export const validatePage = page => {
  const errors = []
  const error = message => errors.push(message)

  const noIndex = !page.index
  if (noIndex) {
    error("Page does not define an index member")
  }

  if (
    !page.appBody ||
    !isString(page.appBody) ||
    !page.appBody.endsWith(".json")
  ) {
    error("App body must be set toa valid JSON file")
  }

  /* Commenting this for now
    * index is a load of static members just now, but maybe useful
    for pageLayout props (which is just a pipe dream at time of writing)
    const indexHtmlErrors = noIndex
        ? []
        : pipe(
            recursivelyValidate(page.index, getComponent), [
            map(e => `Index.html: ${e.error}`)
        ]);
    */

  return errors
}

export const validatePages = (pages, getComponent) => {
  let errors = []
  const error = message => errors.push(message)

  if (!pages.main) {
    error("must have a 'main' page")
  }

  if (!pages.unauthenticated) {
    error("must have a 'unauthenticated' (login) page")
  }

  if (
    !pages.componentLibraries ||
    !isArray(pages.componentLibraries) ||
    pages.componentLibraries.length === 0
  ) {
    error("componentLibraries must be set to a non-empty array of strings")
  }

  const pageErrors = pipe(pages, [
    keys,
    filter(k => k !== "componentLibraries"),
    map(k => validatePage(pages[k], getComponent)),
    flatten,
  ])

  return [...errors, ...pageErrors]
}
