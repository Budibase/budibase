import { createNewHierarchy } from "components/common/core"

export const createPackage = (packageInfo, store) => {
  packageInfo.createNewPackage("")
  const root = createNewHierarchy()
  store.importAppDefinition({
    hierarchy: root,
    actions: [],
    triggers: [],
    accessLevels: { version: 0, levels: [] },
  })
}
