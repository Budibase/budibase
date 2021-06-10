import { Screen } from "./utils/Screen"

export default {
  name: `Create from scratch`,
  create: () => createScreen(),
}

const createScreen = () => {
  return new Screen().instanceName("New Screen").json()
}
