import { Screen } from "./utils/Screen"
import { _ } from "../../../../lang/i18n"

export default {
  name: $_(`builderStore.store.screenTemplates.createFromScratchScreen.from_scratch`),
  id: `createFromScratch`,
  create: () => createScreen(),
  table: $_(`builderStore.store.screenTemplates.createFromScratchScreen.from_scratch`),
}

const createScreen = () => {
  return new Screen().instanceName($_("builderStore.store.screenTemplates.createFromScratchScreen.New_Screen")).json()
}
