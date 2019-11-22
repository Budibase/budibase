import {
  cloneDeep, take, takeRight,
  flatten, map, filter
} from 'lodash/fp';
import { initialiseChildCollections } from '../collectionApi/initialise';
import { validate } from './validate';
import { _loadFromInfo, getRecordFileName } from './load';
import {
  apiWrapper, events, $, joinKey,
} from '../common';
import {
  getFlattenedHierarchy, getExactNodeForPath,
  isRecord, getNode, fieldReversesReferenceToNode,
} from '../templateApi/hierarchy';
import {
  transactionForCreateRecord,
  transactionForUpdateRecord,
} from '../transactions/create';
import { permission } from '../authApi/permissions';
import { initialiseIndex } from '../indexing/initialiseIndex';
import { BadRequestError } from '../common/errors';
import { getRecordInfo } from "./recordInfo";

export const save = app => async (record, context) => apiWrapper(
  app,
  events.recordApi.save,
  record.isNew
    ? permission.createRecord.isAuthorized(record.key)
    : permission.updateRecord.isAuthorized(record.key), { record },
  _save, app, record, context, false,
);


export const _save = async (app, record, context, skipValidation = false) => {
  const recordClone = cloneDeep(record);
  if (!skipValidation) {
    const validationResult = await validate(app)(recordClone, context);
    if (!validationResult.isValid) {
      await app.publish(events.recordApi.save.onInvalid, { record, validationResult });
      throw new BadRequestError(`Save : Record Invalid : ${
        JSON.stringify(validationResult.errors)}`);
    }
  }

  const recordInfo = getRecordInfo(app.record.key);
  const {
    recordNode, pathInfo,
    recordJson, files,
  } = recordInfo;

  if (recordClone.isNew) {
    
    if(!recordNode)
      throw new Error("Cannot find node for " + record.key);

    const transaction = await transactionForCreateRecord(
      app, recordClone,
    );
    recordClone.transactionId = transaction.id;
    await createRecordFolderPath(app.datastore, pathInfo);
    await app.datastore.createFolder(files);
    await app.datastore.createJson(recordJson, recordClone);
    await initialiseReverseReferenceIndexes(app, recordInfo);
    await initialiseAncestorIndexes(app, recordInfo);
    await initialiseChildCollections(app, recordInfo);
    await app.publish(events.recordApi.save.onRecordCreated, {
      record: recordClone,
    });
  } else {
    const oldRecord = await _loadFromInfo(app, recordInfo);
    const transaction = await transactionForUpdateRecord(
      app, oldRecord, recordClone,
    );
    recordClone.transactionId = transaction.id;
    await app.datastore.updateJson(
      recordJson,
      recordClone,
    );
    await app.publish(events.recordApi.save.onRecordUpdated, {
      old: oldRecord,
      new: recordClone,
    });
  }

  await app.cleanupTransactions();

  const returnedClone = cloneDeep(recordClone);
  returnedClone.isNew = false;
  return returnedClone;
};

const initialiseAncestorIndexes = async (app, recordInfo) => {
  for (const index of recordInfo.recordNode.indexes) {
    const indexKey = recordInfo.child(index.name);
    if (!await app.datastore.exists(indexKey)) { await initialiseIndex(app.datastore, recordInfo.dir, index); }
  }
};

const initialiseReverseReferenceIndexes = async (app, recordInfo) => {

  const indexNodes = $(fieldsThatReferenceThisRecord(app, recordInfo.recordNode), [
    map(f => $(f.typeOptions.reverseIndexNodeKeys, [
      map(n => getNode(
        app.hierarchy,
        n,
      )),
    ])),
    flatten,
  ]);

  for (const indexNode of indexNodes) {
    await initialiseIndex(
      app.datastore, recordInfo.dir, indexNode,
    );
  }
};

const fieldsThatReferenceThisRecord = (app, recordNode) => $(app.hierarchy, [
  getFlattenedHierarchy,
  filter(isRecord),
  map(n => n.fields),
  flatten,
  filter(fieldReversesReferenceToNode(recordNode)),
]);

const createRecordFolderPath = async (datastore, pathInfo) => {
  
  const recursiveCreateFolder = async (subdirs, dirsThatNeedCreated=[]) => {

    // iterate backwards through directory hierachy
    // until we get to a folder that exists, then create the rest
    // e.g 
    // - some/folder/here
    // - some/folder
    // - some
    const thisFolder = joinKey(pathInfo.base, ...subdirs);

    if(await datastore.exists(thisFolder)) {

      let creationFolder = thisFolder;
      for(let nextDir of dirsThatNeedCreated) {
        creationFolder = joinKey(creationFolder, nextDir);
        await datastore.createFolder(creationFolder);
      }

    } else if(dirsThatNeedCreated.length > 0) {
      
      await recursiveCreateFolder(
        take(subdirs.length - 1)(subdirs),
        [...takeRight(1)(subdirs), ...dirsThatNeedCreated]
      );
    }
  }

  await recursiveCreateFolder(pathInfo.subdirs);

  return joinKey(pathInfo.base, ...pathInfo.subdirs);

}