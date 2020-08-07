import { walkProps } from "./storeUtils"
import { get_capitalised_name } from "../helpers"

export default function(component, state) {
  const screen =
    state.currentFrontEndType === "screen" ? state.currentPreviewItem : null
  const page = state.pages[state.currentPageName]
  const capitalised = get_capitalised_name(component)

  const matchingComponents = []

  if (screen)
    walkProps(screen.props, c => {
      if ((c._instanceName || "").startsWith(capitalised)) {
        matchingComponents.push(c._instanceName)
      }
    })

  walkProps(page.props, c => {
    if ((c._instanceName || "").startsWith(capitalised)) {
      matchingComponents.push(c._instanceName)
    }
  })

  let index = 1
  let name
  while (!name) {
    const tryName = `${capitalised} ${index}`
    if (!matchingComponents.includes(tryName)) name = tryName
    index++
  }

  return name
}
