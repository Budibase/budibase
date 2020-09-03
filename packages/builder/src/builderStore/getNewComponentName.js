import { walkProps } from "./storeUtils"
import { get_capitalised_name } from "../helpers"

export default function(component, state) {
  const capitalised = get_capitalised_name(component)

  const matchingComponents = []

  const findMatches = props => {
    walkProps(props, c => {
      if ((c._instanceName || "").startsWith(capitalised)) {
        matchingComponents.push(c._instanceName)
      }
    })
  }

  // check page first
  findMatches(state.pages[state.currentPageName].props)

  // if viewing screen, check current screen for duplicate
  if (state.currentFrontEndType === "screen") {
    findMatches(state.currentPreviewItem.props)
  } else {
    // viewing master page - need to find against all screens
    for (let screen of state.screens) {
      findMatches(screen.props)
    }
  }

  let index = 1
  let name
  while (!name) {
    const tryName = `${capitalised} ${index}`
    if (!matchingComponents.includes(tryName)) name = tryName
    index++
  }

  return name
}
