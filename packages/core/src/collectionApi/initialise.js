import { filter } from 'lodash/fp';
import {
  getFlattenedHierarchy,
  isCollectionRecord,
  isRoot,
  getExactNodeForPath,
} from '../templateApi/hierarchy';
import { $, allTrue, joinKey } from '../common';

const ensureCollectionIsInitialised = async (datastore, node, parentKey) => {
  if (!await datastore.exists(parentKey)) {
    await datastore.createFolder(parentKey);
    await datastore.createFolder(
      joinKey(parentKey, 'allids'),
    );
    await datastore.createFolder(
      joinKey(
        parentKey,
        'allids',
        node.nodeId.toString(),
      ),
    );
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

export const initialiseChildCollections = async (app, recordKey) => {
  const childCollectionRecords = $(recordKey, [
    getExactNodeForPath(app.hierarchy),
    n => n.children,
    filter(isCollectionRecord),
  ]);

  for (const child of childCollectionRecords) {
    await ensureCollectionIsInitialised(
      app.datastore,
      child,
      joinKey(recordKey, child.collectionName),
    );
  }
};
