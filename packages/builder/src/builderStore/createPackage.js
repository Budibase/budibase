import {createNewHierarchy} from "../common/core";

export const createPackage = (packageInfo, store) => {
    packageInfo.createNewPackage("");
    const root = createNewHierarchy();
    store.importAppDefinition({
      hierarchy:root,
      actions:[],
      triggers:[],
      accessLevels: [],
      accessLevelsVersion: 0
    });
};
