import {
    getIndexTableName, indexTables
} from "./indexTablesGenerator";

import {
    buttons
} from "./buttonGenerators";

export const recordHomePageComponents = ({indexes, records, helpers}) => 
    [   
        ...recordHomepages({indexes, records})
          .map(component),

        ...recordHomepages({indexes, records})
            .map(homePageButtons),
        
        ...indexTables({indexes, records, helpers}),

        ...buttons({indexes, buttons, helpers})
    ]


const findIndexForRecord = (indexes, record) => {
    const forRecord = indexes.filter(i => i.allowedRecordNodeIds.includes(record.nodeId));
    if(forRecord.length === 0) return;
    if(forRecord.length === 1) return forRecord[0];
    const noMap = forRecord.filter(i => !i.filter || !i.filter.trim());
    if(noMap.length === 0) forRecord[0];
    return noMap[0];
}

export const recordHomepages = ({indexes, records}) => 
    records.filter(r => r.parent().type === "root")
        .map(r =>({
            record:r, 
            index:findIndexForRecord(indexes, r)
        }))
        .filter(r => r.index);


export const  homepageComponentName = (record) => 
    `${record.name}/${record.name} homepage`;

const component = ({record, index}) => ({
    inherits: "@budibase/standard-components/div",
    name: homepageComponentName(record),
    props: {
        className: "p-3",
        children: [
            {
                component: {
                    _component: "@budibase/standard-components/h2",
                    text: record.collectionName
                }
            },
            {
                component: {
                    _component: `${record.name}/homepage buttons`,
                }
            },
            {
                component: {
                    _component: getIndexTableName(index)
                }
            }
        ],
        onLoad: [
            {
                "##eventHandlerType": "Set State",
                parameters: {
                    path: `isEditing${record.name}`,
                    value: ""
                }
            },
            {
                "##eventHandlerType": "List Records",
                parameters: {
                    statePath: index.nodeKey(),
                    indexKey: index.nodeKey()
                }
            }
        ]
    }

});

const homePageButtons = ({index, record}) => ({
    inherits: "@budibase/standard-components/div",
    name: `${record.name}/homepage buttons`,
    props: {
        className: "btn-group",
        children: [
            {
                component: {
                    _component: "common/Default Button",
                    contentText: `Create ${record.name}`,
                    onClick: [
                        {
                            "##eventHandlerType": "Get New Record",
                            parameters: {
                                statePath: record.name,
                                collectionKey: `/${record.collectionName}`,
                                childRecordType: record.name
                            }
                        }, 
                        {
                            "##eventHandlerType": "Set State",
                            parameters: {
                                path: `isEditing${record.name}`,
                                value: "true"
                            }
                        }
                    ]
                }
            },
            {
                component: {
                    _component: "common/Default Button",
                    contentText: `Refresh`,
                    onClick: [
                        {
                            "##eventHandlerType": "List Records",
                            parameters: {
                                statePath: index.nodeKey(),
                                indexKey: index.nodeKey()
                            }
                        }
                    ]
                }
            }
        ]
    }
})