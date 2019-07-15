import {
  cloneDeep,
  flatten,
  map,
  filter,
} from 'lodash/fp';
import { initialiseChildCollections } from '../collectionApi/initialise';
import { validate } from './validate';
import { _load, getRecordFileName } from './load';
import {
  apiWrapper, events, $, joinKey,
} from '../common';
import {
  getFlattenedHierarchy,
  getExactNodeForPath,
  isRecord,
  getNode,
  fieldReversesReferenceToNode,
} from '../templateApi/hierarchy';
import { mapRecord } from '../indexing/evaluate';
import { listItems } from '../indexApi/listItems';
import { addToAllIds } from '../indexing/allIds';
import {
  transactionForCreateRecord,
  transactionForUpdateRecord,
} from '../transactions/create';
import { permission } from '../authApi/permissions';
import { initialiseIndex } from '../indexing/initialiseIndex';
import { BadRequestError } from '../common/errors';

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

  if (recordClone.isNew) {
    await addToAllIds(app.hierarchy, app.datastore)(recordClone);
    const transaction = await transactionForCreateRecord(
      app, recordClone,
    );
    recordClone.transactionId = transaction.id;
    await app.datastore.createFolder(recordClone.key);
    await app.datastore.createFolder(
      joinKey(recordClone.key, 'files'),
    );
    await app.datastore.createJson(
      getRecordFileName(recordClone.key),
      recordClone,
    );
    await initialiseReverseReferenceIndexes(app, record);
    await initialiseAncestorIndexes(app, record);
    await initialiseChildCollections(app, recordClone.key);
    await app.publish(events.recordApi.save.onRecordCreated, {
      record: recordClone,
    });
  } else {
    const oldRecord = await _load(app, recordClone.key);
    const transaction = await transactionForUpdateRecord(
      app, oldRecord, recordClone,
    );
    recordClone.transactionId = transaction.id;
    await app.datastore.updateJson(
      getRecordFileName(recordClone.key),
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

const initialiseAncestorIndexes = async (app, record) => {
  const recordNode = getExactNodeForPath(app.hierarchy)(record.key);

  for (const index of recordNode.indexes) {
    const indexKey = joinKey(record.key, index.name);
    if (!await app.datastore.exists(indexKey)) { await initialiseIndex(app.datastore, record.key, index); }
  }
};

const initialiseReverseReferenceIndexes = async (app, record) => {
  const recordNode = getExactNodeForPath(app.hierarchy)(record.key);

  const indexNodes = $(fieldsThatReferenceThisRecord(app, recordNode), [
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
      app.datastore, record.key, indexNode,
    );
  }
};

const maintainReferentialIntegrity = async (app, indexingApi, oldRecord, newRecord) => {
  /*
        FOREACH Field that reference this object
        - options Index node that for field
        - has options index changed for referenced record?
        - FOREACH reverse index of field
          - FOREACH referencingRecord in reverse index
            - Is field value still pointing to referencedRecord
            - Update referencingRecord.fieldName to new value
            - Save
        */
  const recordNode = getExactNodeForPath(app.hierarchy)(newRecord.key);
  const referenceFields = fieldsThatReferenceThisRecord(
    app, recordNode,
  );

  const updates = $(referenceFields, [
    map(f => ({
      node: getNode(
        app.hierarchy, f.typeOptions.indexNodeKey,
      ),
      field: f,
    })),
    map(n => ({
      old: mapRecord(oldRecord, n.node),
      new: mapRecord(newRecord, n.node),
      indexNode: n.node,
      field: n.field,
      reverseIndexKeys: $(n.field.typeOptions.reverseIndexNodeKeys, [
        map(k => joinKey(
          newRecord.key,
          getLastPartInKey(k),
        )),
      ]),
    })),
    filter(diff => !isEqual(diff.old)(diff.new)),
  ]);

  for (const update of updates) {
    for (const reverseIndexKey of update.reverseIndexKeys) {
      const rows = await listItems(app)(reverseIndexKey);

      for (const key of map(r => r.key)(rows)) {
        const record = await _load(app, key);
        if (record[update.field.name].key === newRecord.key) {
          record[update.field.name] = update.new;
          await _save(app, indexingApi, record, undefined, true);
        }
      }
    }
  }
};

const fieldsThatReferenceThisRecord = (app, recordNode) => $(app.hierarchy, [
  getFlattenedHierarchy,
  filter(isRecord),
  map(n => n.fields),
  flatten,
  filter(fieldReversesReferenceToNode(recordNode)),
]);
