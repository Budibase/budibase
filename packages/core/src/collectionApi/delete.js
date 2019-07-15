import { includes } from 'lodash/fp';
import { getNodeForCollectionPath } from '../templateApi/hierarchy';
import {
  safeKey, apiWrapper,
  events, joinKey,
} from '../common';
import { _deleteRecord } from '../recordApi/delete';
import { getAllIdsIterator, getAllIdsShardKey } from '../indexing/allIds';
import { permission } from '../authApi/permissions';

export const deleteCollection = (app, disableCleanup = false) => async key => apiWrapper(
  app,
  events.collectionApi.delete,
  permission.manageCollection.isAuthorized,
  { key },
  _deleteCollection, app, key, disableCleanup,
);


export const _deleteCollection = async (app, key, disableCleanup) => {
  key = safeKey(key);
  const node = getNodeForCollectionPath(app.hierarchy)(key);

  await deleteRecords(app, key);
  await deleteAllIdsFolders(app, node, key);
  await deleteCollectionFolder(app, key);
  if (!disableCleanup) { await app.cleanupTransactions(); }
};

const deleteCollectionFolder = async (app, key) => await app.datastore.deleteFolder(key);


const deleteAllIdsFolders = async (app, node, key) => {
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

const deleteRecords = async (app, key) => {
  const deletedAllIdsShards = [];
  const deleteAllIdsShard = async (recordId) => {
    const shardKey = getAllIdsShardKey(
      app.hierarchy, key, recordId,
    );

    if (includes(shardKey)(deletedAllIdsShards)) {
      return;
    }

    deletedAllIdsShards.push(shardKey);

    await app.datastore.deleteFile(shardKey);
  };

  const iterate = await getAllIdsIterator(app)(key);

  let ids = await iterate();
  while (!ids.done) {
    if (ids.result.collectionKey === key) {
      for (const id of ids.result.ids) {
        await _deleteRecord(
          app,
          joinKey(key, id),
          true,
        );
        await deleteAllIdsShard(id);
      }
    }

    ids = await iterate();
  }
};
