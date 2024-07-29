import { Screen } from "./Screen"

const blankScreen = route => {
  return new Screen().instanceName("New Screen").route(route).json()
}

export default blankScreen
