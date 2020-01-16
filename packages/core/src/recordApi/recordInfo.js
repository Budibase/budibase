import { 
  getExactNodeForKey, getActualKeyOfParent, 
  isRoot, isSingleRecord, getNodeForCollectionPath
} from '../templateApi/hierarchy';
import {
reduce, find, filter, take
} from 'lodash/fp';
import {
$, getFileFromKey, joinKey, safeKey, keySep
} from '../common';
import { 
    folderStructureArray, allIdChars 
} from "../indexing/allIds";

export const getRecordInfo = (hierarchy, key) => {
  const recordNode = getExactNodeForKey(hierarchy)(key);
  const pathInfo = getRecordDirectory(recordNode, key);
  const dir = joinKey(pathInfo.base, ...pathInfo.subdirs);

  return {
    recordJson: recordJson(dir),
    files: files(dir),
    child:(name) => joinKey(dir, name),
    key: safeKey(key),
    recordNode, pathInfo, dir
  };
}

export const getCollectionDir = (hierarchy, collectionKey) => {
  const recordNode = getNodeForCollectionPath(hierarchy)(collectionKey);
  const dummyRecordKey = joinKey(collectionKey, "1-abcd");
  const pathInfo = getRecordDirectory(recordNode, dummyRecordKey);
  return pathInfo.base;
}

const recordJson = (dir) => 
  joinKey(dir, "record.json")

const files = (dir) => 
  joinKey(dir, "files")

const getRecordDirectory = (recordNode, key) => {
  const id = getFileFromKey(key);
  
  const traverseParentKeys = (n, parents=[]) => {
    if(isRoot(n)) return parents;
    const k = getActualKeyOfParent(n.nodeKey(), key);
    const thisNodeDir = {
      node:n,
      relativeDir: joinKey(
        recordRelativeDirectory(n, getFileFromKey(k)))
    };
    return traverseParentKeys(
      n.parent(), 
      [thisNodeDir, ...parents]);
  }

  const parentDirs = $(recordNode.parent(), [
    traverseParentKeys,
    reduce((key, item) => {
      return joinKey(key, item.node.collectionName, item.relativeDir)
    }, keySep)
  ]);

  const subdirs = isSingleRecord(recordNode)
                  ? []
                  : recordRelativeDirectory(recordNode, id);
  const base = isSingleRecord(recordNode)
               ? joinKey(parentDirs, recordNode.name)
               : joinKey(parentDirs, recordNode.collectionName);

  return ({
    subdirs, base
  });
}

const recordRelativeDirectory = (recordNode, id) => {
  const folderStructure = folderStructureArray(recordNode);
  const strippedId = id.substring(recordNode.nodeId.toString().length + 1);
  const subfolders = $(folderStructure, [
    reduce((result, currentCount) => {
      result.folders.push(
          folderForChar(strippedId[result.level], currentCount)
      );
      return {level:result.level+1, folders:result.folders};
    }, {level:0, folders:[]}),
    f => f.folders,
    filter(f => !!f)
  ]);

  return [recordNode.nodeId.toString(), ...subfolders, id]
}

const folderForChar = (char, folderCount) => 
  folderCount === 1 ? ""
  : $(folderCount, [
      idFoldersForFolderCount,
      find(f => f.includes(char))
    ]);

const idFoldersForFolderCount = (folderCount) => {
  const charRangePerShard = 64 / folderCount;
  const idFolders = [];
  let index = 0;
  let currentIdsShard = '';
  while (index < 64) {
    currentIdsShard += allIdChars[index];
    if ((index + 1) % charRangePerShard === 0) {
      idFolders.push(currentIdsShard);
      currentIdsShard = '';
    }
    index++;
  }
    
    return idFolders;
};

