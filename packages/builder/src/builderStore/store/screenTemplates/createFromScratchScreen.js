import { Screen } from "./utils/Screen"
import { _ } from "../../../../lang/i18n"

export default {
  name: "Create from scratch",
  id: `createFromScratch`,
  create: () => createScreen(),
  table: "Create from scratch",
}

const createScreen = () => {
  return new Screen().instanceName("New Screen").json()
}
