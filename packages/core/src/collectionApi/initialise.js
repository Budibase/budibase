import { filter } from 'lodash/fp';
import {
  getFlattenedHierarchy,
  isCollectionRecord,
  isRoot,
  getExactNodeForPath,
} from '../templateApi/hierarchy';
import { $, allTrue, joinKey } from '../common';

const ensureCollectionIsInitialised = async (datastore, node, dir) => {
  if (!await datastore.exists(dir)) {
    await datastore.createFolder(dir);
  }
};

export const initialiseRootCollections = async (datastore, hierarchy) => {
  const rootCollectionRecord = allTrue(
    n => isRoot(n.parent()),
    isCollectionRecord,
  );

  const flathierarchy = getFlattenedHierarchy(hierarchy);

  const collectionRecords = $(flathierarchy, [
    filter(rootCollectionRecord),
  ]);

  for (const col of collectionRecords) {
    await ensureCollectionIsInitialised(
      datastore,
      col,
      col.collectionPathRegx(),
    );
  }
};

export const initialiseChildCollections = async (app, recordInfo) => {
  const childCollectionRecords = $(recordInfo.recordNode, [
    n => n.children,
    filter(isCollectionRecord),
  ]);

  for (const child of childCollectionRecords) {
    await ensureCollectionIsInitialised(
      app.datastore,
      child,
      recordInfo.child(child.collectionName),
    );
  }
};
