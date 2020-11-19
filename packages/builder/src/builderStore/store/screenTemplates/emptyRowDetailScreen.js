import { Screen } from "./utils/Screen"

export default {
  name: `Row Detail (Empty)`,
  create: () => createScreen(),
}

const createScreen = () => {
  return new Screen()
    .component("@budibase/standard-components/rowdetail")
    .table("")
    .json()
}
