import { Screen } from "./Screen"

export default {
  name: `Create from scratch`,
  id: `createFromScratch`,
  create: () => createScreen(),
  table: `Create from scratch`,
}

const createScreen = () => {
  return new Screen().instanceName("New Screen").json()
}
