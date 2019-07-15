import lunr from 'lunr';
import {
  getHashCode,
  joinKey
} from '../common';
import {
  getActualKeyOfParent,
  isGlobalIndex,
} from '../templateApi/hierarchy';
import {promiseReadableStream} from "./promiseReadableStream";
import { createIndexFile } from './sharding';
import { generateSchema } from './indexSchemaCreator';
import { getIndexReader, CONTINUE_READING_RECORDS } from './serializer';

export const readIndex = async (hierarchy, datastore, index, indexedDataKey) => {
  const records = [];
  const doRead = iterateIndex(
        async item => {
      records.push(item);
      return CONTINUE_READING_RECORDS;
    },
        async () => records
  );

  return await doRead(hierarchy, datastore, index, indexedDataKey);
};

export const searchIndex = async (hierarchy, datastore, index, indexedDataKey, searchPhrase) => {
  const records = [];
  const schema = generateSchema(hierarchy, index);
  const doRead = iterateIndex(
        async item => {
      const idx = lunr(function () {
        this.ref('key');
        for (const field of schema) {
          this.field(field.name);
        }
        this.add(item);
      });
      const searchResults = idx.search(searchPhrase);
      if (searchResults.length === 1) {
        item._searchResult = searchResults[0];
        records.push(item);
      }
      return CONTINUE_READING_RECORDS;
    },
        async () => records
  );

  return await doRead(hierarchy, datastore, index, indexedDataKey);
};

export const getIndexedDataKey_fromIndexKey = (indexKey) => 
  `${indexKey}${indexKey.endsWith('.csv') ? '' : '.csv'}`;

export const uniqueIndexName = index => `idx_${
  getHashCode(`${index.filter}${index.map}`)
}.csv`;

export const getIndexedDataKey = (decendantKey, indexNode) => {
  if (isGlobalIndex(indexNode)) { return `${indexNode.nodeKey()}.csv`; }

  const indexedDataParentKey = getActualKeyOfParent(
    indexNode.parent().nodeKey(),
    decendantKey,
  );

  const indexName = indexNode.name
    ? `${indexNode.name}.csv`
    : uniqueIndexName(indexNode);

  return joinKey(
    indexedDataParentKey,
    indexName,
  );
};

export const iterateIndex = (onGetItem, getFinalResult) => async (hierarchy, datastore, index, indexedDataKey) => {
  try {
    const readableStream = promiseReadableStream(
        await datastore.readableFileStream(indexedDataKey)
    );

    const read = getIndexReader(hierarchy, index, readableStream);
    await read(onGetItem);
    return getFinalResult();
  } catch (e) {
    if (await datastore.exists(indexedDataKey)) {
      throw e;
    } else {
      await createIndexFile(
        datastore,
        indexedDataKey,
        index,
      );
    }
    return [];
  }
};
