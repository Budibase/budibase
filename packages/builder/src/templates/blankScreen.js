import { Screen } from "./Screen"

const blankScreen = () => {
  return new Screen().instanceName("New Screen").json()
}

export default blankScreen;
