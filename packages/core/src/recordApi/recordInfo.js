import { 
  getExactNodeForPath, getActualKeyOfParent, isRoot
} from '../templateApi/hierarchy';
import {
map, reduce
} from 'lodash/fp';
import {
$, getDirFomKey, getFileFromKey, joinKey, safeKey
} from '../common';
import { 
    folderStructureArray, allIdChars 
} from "../indexing/allIds";

export const getRecordInfo = (app, key) => {
  const recordNode = getExactNodeForPath(app.hierarchy)(key);
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

const recordJson = (dir) => 
  joinKey(dir, "record.json")

const files = (dir) => 
  joinKey(dir, "files")

const getRecordDirectory = (recordNode, key) => {
  const id = getFileFromKey(key);
  
  const traverseParentKeys = (n, keys=[]) => {
    if(isRoot(n)) return keys;
    const k = getActualKeyOfParent(n, key);
  }

  return ({
    base:getDirFomKey(key),
    subdirs: [recordNode.nodeId.toString(), ...subfolders]
  });
}

const recordRelativeDirectory = (recordNode, id) => {
  const folderStructure = folderStructureArray(recordNode);

  const subfolders = $(folderStructure, [
    reduce((result, currentCount) => {
    result.folders.push(
        folderForChar(id[result.level], currentCount)
    );
    return {level:result.level+1, folders:result.folders}
    }, {level:0, folders:[]}),
    map(f => f.folders),
  ]);

  return [recordNode.nodeId.toString(), ...subfolders]
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

