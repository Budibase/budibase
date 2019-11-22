import {
  join, flatten, orderBy,
  filter
} from 'lodash/fp';
import {
  getFlattenedHierarchy,
  getCollectionNodeByKeyOrNodeKey,
  isCollectionRecord, isAncestor,
} from '../templateApi/hierarchy';
import { joinKey, safeKey, $ } from '../common';

export const RECORDS_PER_FOLDER = 1000;
export const allIdChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';

// this should never be changed - ever 
// - existing databases depend on the order of chars this string

/**
 * folderStructureArray should return an array like
 * - [1] = all records fit into one folder
 * - [2] = all records fite into 2 folders
 * - [64, 3] = all records fit into 64 * 3 folders
 * - [64, 64, 10] = all records fit into 64 * 64 * 10 folder
 * (there are 64 possible chars in allIsChars) 
*/
export const folderStructureArray = (recordNode, currentArray=[], currentFolderPosition=0) => {
  const maxRecords = currentFolderPosition === 0 
                     ? RECORDS_PER_FOLDER
                     : currentFolderPosition * 64 * RECORDS_PER_FOLDER;

  if(maxRecords < recordNode.estimatedRecordCount) {
    return folderStructureArray(
            [...currentArray, 64], 
            currentFolderPosition + 1);
  } else {
    const childFolderCount = Math.ceil(maxRecords / recordNode.estimatedRecordCount);
    return [...currentArray, childFolderCount]
  }
}


export const getAllIdsIterator = app => async (collection_Key_or_NodeKey) => {
  collection_Key_or_NodeKey = safeKey(collection_Key_or_NodeKey);
  const recordNode = getCollectionNodeByKeyOrNodeKey(
    app.hierarchy,
    collection_Key_or_NodeKey,
  );

  const getAllIdsIteratorForCollectionKey = async (recordNode, collectionKey) => {
    
    const folderStructure = folderStructureArray(recordNode)

    let currentFolderContents = [];
    let currentFolderIndexes = [];
    let currentSubPath = [];

    const basePath = joinKey(
      collectionKey, recordNode.nodeId.toString());
  

    let folderLevel = 0;
    const levels = folderStructure.length;
    const topLevel = levels -1;

    const lastPathHasContent = () => 
      folderLevel === 0 
      || currentFolderContents[folderLevel - 1].length > 0;

    while (folderLevel < folderStructure.length && lastPathHasContent()) {
      if(folderLevel < topLevel) {
        const contentsThisLevel = 
          await app.datastore.getFolderContents(
            join(basePath, ...currentSubPath));

        currentFolderContents.push(contentsThisLevel);
        currentFolderIndexes.push(0);
        currentSubPath.push(currentFolderContents[0])
      } else {
        // placesholders only for the top level (which will be populated by nextFolder())
        currentFolderContents.push([])
        currentFolderIndexes.push(-1);
        currentSubPath.push("");
      }      

      folderLevel+=1;
    }

    

    const nextFolder = async (lev=-1) => {
      lev = (lev === -1) ? topLevel : lev;
      if(currentFolderIndexes[lev] !== currentFolderContents[lev].length - 1){
        
        const folderIndexThisLevel = currentFolderIndexes[lev] + 1; 
        currentFolderIndexes[lev] = folderIndexThisLevel;
        currentSubPath[lev] = currentFolderContents[folderIndexThisLevel]
        
        if(lev < topLevel) {
          let loopLev = lev + 1;
          while(loopLev <= topLevel) {
            currentFolderContents[loopLev] = 
              await app.datastore.getFolderContents(join(basePath, ...currentSubPath));
            loopLev+=1;
          }
        }

        return false; // not complete 

      } else {
        if(lev === 0) return true; // complete
        return await nextFolder(lev - 1);
      }
    }

    const fininshedResult = ({ done: true, result: { ids: [], collectionKey } });

    const getIdsFromCurrentfolder = async () => {

      if(currentFolderIndexes.length < folderStructure)
        return fininshedResult;

      const hasMore = await nextFolder();

      if(!hasMore) return fininshedResult;
      
      const result = ({
        result: {
          ids: await app.datastore.getFolderContents(
            joinKey(basePath, currentSubPath)),
          collectionKey
        },
        done:false
      })      

      return result;
    }

    return getIdsFromCurrentfolder;
    
  };

  const ancestors = $(getFlattenedHierarchy(app.hierarchy), [
    filter(isCollectionRecord),
    filter(n => isAncestor(recordNode)(n)
                    || n.nodeKey() === recordNode.nodeKey()),
    orderBy([n => n.nodeKey().length], ['asc']),
  ]); // parents first

  const traverseForIteraterators = async (parentRecordKey = '', currentNodeIndex = 0) => {
    const currentNode = ancestors[currentNodeIndex];
    const currentCollectionKey = joinKey(
      parentRecordKey,
      currentNode.collectionName,
    );
    if (currentNode.nodeKey() === recordNode.nodeKey()) {
      return [
        await getAllIdsIteratorForCollectionKey(
          currentNode,
          currentCollectionKey,
        )];
    }
    const allIterators = [];
    const currentIterator = await getAllIdsIteratorForCollectionKey(
      currentNode,
      currentCollectionKey,
    );

    let ids = await currentIterator();
    while (ids.done === false) {
      for (const id of ids.result.ids) {
        allIterators.push(
          await traverseForIteraterators(
            joinKey(currentCollectionKey, id),
            currentNodeIndex + 1,
          ),
        );
      }

      ids = await currentIterator();
    }

    return flatten(allIterators);
  };

  const iteratorsArray = await traverseForIteraterators();
  let currentIteratorIndex = 0;
  return async () => {
    if (iteratorsArray.length === 0) { return { done: true, result: [] }; }
    const innerResult = await iteratorsArray[currentIteratorIndex]();
    if (!innerResult.done) { return innerResult; }
    if (currentIteratorIndex == iteratorsArray.length - 1) {
      return { done: true, result: innerResult.result };
    }
    currentIteratorIndex++;
    return { done: false, result: innerResult.result };
  };
};


export default getAllIdsIterator;
