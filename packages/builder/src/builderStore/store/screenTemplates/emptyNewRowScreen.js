import { Screen } from "./utils/Screen"

export default {
  name: `New Row (Empty)`,
  create: () => createScreen(),
}

const createScreen = () => {
  return new Screen()
    .component("@budibase/standard-components/newrow")
    .table("")
    .json()
}
