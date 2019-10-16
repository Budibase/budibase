import { getRecordPath } from "./getRecordPath";

export const indexTables = ({indexes, helpers}) => 
    indexes.map(i => indexTable(i, helpers));

export const indexTableProps = (index, helpers) => ({
    data: {
        "##bbstate":index.nodeKey(),
        "##bbsource":"store"
    },
    tableClass: "table table-hover",
    theadClass: "thead-dark",
    columns: helpers.indexSchema(index).map(column),
    onRowClick: [
        {
            "##eventHandlerType": "Load Record",
            parameters: {
                recordKey: {
                    "##bbstate": "key",
                    "##bbsource": "context"
                },
                statePath: {
                    "##bbstate": "type",
                    "##bbsource": "context"
                }
            },
            "##eventHandlerType": "Set State",
            parameters: {
                path: "currentView",
                value: {
                    "##bbstate": "type",
                    "##bbsource": "context"
                }
            },
        }
    ]
});

export const getIndexTableName = (index) => 
    `${getRecordPath}/${index.name} Table`

const indexTable = (index, helpers) => ({
    name: getIndexTableName(index),
    inherits: "@budibase/standard-components/table",
    props: indexTableProps(index, helpers)
});

const column = (col) => ({
    title: col.name,
    value: {
        "##bbstate": col.name,
        "##bbsource":"context"
    }
})