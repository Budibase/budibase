import { Screen } from "./Screen"

const createScreen = () => {
  return new Screen().instanceName("New Screen").json()
}

export const createFromScratchScreen = () => ({
  name: `Create from scratch`,
  id: `createFromScratch`,
  create: () => createScreen(),
  table: `Create from scratch`,
})

const defaultScreen = createFromScratchScreen();

export default defaultScreen;
