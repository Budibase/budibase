import { orderBy } from 'lodash';
import {
  reduce, find, includes, flatten, union,
  filter, each, map,
} from 'lodash/fp';
import {
  joinKey, splitKey, isNonEmptyString,
  isNothing, $, isSomething,
} from '../common';
import {
  getFlattenedHierarchy, getNode, getRecordNodeId,
  getExactNodeForPath, recordNodeIdIsAllowed,
  isRecord, isGlobalIndex,
} from '../templateApi/hierarchy';
import { indexTypes } from '../templateApi/indexes';

export const getRelevantAncestorIndexes = (appHierarchy, record) => {
  const key = record.key;
  const keyParts = splitKey(key);
  const nodeId = getRecordNodeId(key);

  const flatHierarchy = orderBy(getFlattenedHierarchy(appHierarchy),
    [node => node.pathRegx().length],
    ['desc']);

  const makeindexNodeAndKey_ForAncestorIndex = (indexNode, indexKey) => makeIndexNodeAndKey(indexNode, joinKey(indexKey, indexNode.name));

  const traverseAncestorIndexesInPath = () => reduce((acc, part) => {
    const currentIndexKey = joinKey(acc.lastIndexKey, part);
    acc.lastIndexKey = currentIndexKey;
    const testPathRegx = p => new RegExp(`${p.pathRegx()}$`).test(currentIndexKey);
    const nodeMatch = find(testPathRegx)(flatHierarchy);

    if (isNothing(nodeMatch)) { return acc; }

    if (!isRecord(nodeMatch)
                || nodeMatch.indexes.length === 0) { return acc; }

    const indexes = $(nodeMatch.indexes, [
      filter(i => i.indexType === indexTypes.ancestor
                        && (i.allowedRecordNodeIds.length === 0
                         || includes(nodeId)(i.allowedRecordNodeIds))),
    ]);

    each(v => acc.nodesAndKeys.push(
      makeindexNodeAndKey_ForAncestorIndex(v, currentIndexKey),
    ))(indexes);

    return acc;
  }, { lastIndexKey: '', nodesAndKeys: [] })(keyParts).nodesAndKeys;

  const rootIndexes = $(flatHierarchy, [
    filter(n => isGlobalIndex(n) && recordNodeIdIsAllowed(n)(nodeId)),
    map(i => makeIndexNodeAndKey(i, i.nodeKey())),
  ]);

  return union(traverseAncestorIndexesInPath())(rootIndexes);
};

export const getRelevantReverseReferenceIndexes = (appHierarchy, record) => $(record.key, [
  getExactNodeForPath(appHierarchy),
  n => n.fields,
  filter(f => f.type === 'reference'
                    && isSomething(record[f.name])
                    && isNonEmptyString(record[f.name].key)),
  map(f => $(f.typeOptions.reverseIndexNodeKeys, [
    map(n => ({
      recordNode: getNode(appHierarchy, n),
      field: f,
    })),
  ])),
  flatten,
  map(n => makeIndexNodeAndKey(
    n.recordNode,
    joinKey(record[n.field.name].key, n.recordNode.name),
  )),
]);

const makeIndexNodeAndKey = (indexNode, indexKey) => ({ indexNode, indexKey });

export default getRelevantAncestorIndexes;
