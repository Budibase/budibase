import { includes } from 'lodash/fp';
import { getNodeForCollectionPath } from '../templateApi/hierarchy';
import {
  safeKey, apiWrapper,
  events, joinKey,
} from '../common';
import { _deleteRecord } from '../recordApi/delete';
import { getAllIdsIterator, getAllIdsShardKey, folderStructureArray } from '../indexing/allIds';
import { permission } from '../authApi/permissions';
import { getRecordInfo } from "../recordApi/recordInfo";

export const deleteCollection = (app, disableCleanup = false) => async key => apiWrapper(
  app,
  events.collectionApi.delete,
  permission.manageCollection.isAuthorized,
  { key },
  _deleteCollection, app, key, disableCleanup,
);


export const _deleteCollection = async (app, key, disableCleanup) => {
  const recordInfo = getRecordInfo(key);
  await app.datastore.deleteFolder(recordInfo)
  if (!disableCleanup) { await app.cleanupTransactions(); }
};

const deleteCollectionFolder = async (app, key) => await app.datastore.deleteFolder(key);


const deleteShardFolders = async (app, node, key) => {

  await app.datastore.deleteFolder(
    joinKey(
      key, 'allids',
      node.nodeId,
    ),
  );

  await app.datastore.deleteFolder(
    joinKey(key, 'allids'),
  );
};


