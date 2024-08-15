import { Screen } from "./Screen"

const blankScreen = route => {
  return new Screen()
    .instanceName("New Screen")
    .customProps({ layout: "grid" })
    .route(route)
    .json()
}

export default blankScreen
