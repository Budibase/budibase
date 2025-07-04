import { devRevertProcessor, revertDevChanges } from "./devRevertProcessor"

const init = async () => {
  devRevertProcessor()
}

export { init, revertDevChanges }
