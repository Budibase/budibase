import {getIndexTableName} from "./indexTablesGenerator";

export const rootContent = ({indexes, records, helpers}) => 
    record.filter(r => r.parent().type === "root")
          .map(r =>({
              record, 
              index:findIndexForRecord(indexes, r)
          }))
          .filter(r => r.index)
          .map(component)


const findIndexForRecord = (indexes, record) => {
    const forRecord = indexes.filter(i => i.allowedRecordNodeIds.includes(record.nodeId));
    if(forRecord.length === 0) return;
    if(forRecord.length === 1) return forRecord[0];
    const noMap = forRecord.filter(i => !i.filter || !i.filter.trim());
    if(noMap.length === 0) forRecord[0];
    return noMap[0];
}

const component = (recordAndIndex) => ({
    _component: "@budibase/standard-components/div",
    className: "p-3",
    children: [
        {
            component: {
                _component: "@budibase/standard-components/H2",
                text: recordAndIndex.record.collectionName
            }
        },
        {
            component: {
                _component: getIndexTableName(recordAndIndex.index)
            }
        }
    ]

})