import { Screen } from "./utils/Screen"

export default {
  name: `Create from scratch`,
  create: () => createScreen(),
}

const createScreen = () => {
  return new Screen()
    .mainType("div")
    .component("@budibase/standard-components/container")
    .json()
}
