import { getRecordPath } from "./getRecordPath";

export const indexTables = ({indexes, helpers}) => 
    indexes.map(i => indexTable(i, helpers));

const excludedColumns = ["id", "isNew", "key", "type", "sortKey"];

export const indexTableProps = (index, helpers) => ({
    data: {
        "##bbstate":index.nodeKey(),
        "##bbsource":"store"
    },
    tableClass: "table table-hover",
    theadClass: "thead-dark",
    columns: helpers
                .indexSchema(index)
                .filter(c => !excludedColumns.includes(c.name))
                .map(column),
    onRowClick: [
        {
            "##eventHandlerType": "Set State",
            parameters: {
                path: `selectedrow_${index.name}`,
                value: {
                    "##bbstate": "key",
                    "##bbsource": "event"
                }
            },
        }
    ]
});

export const getIndexTableName = (index, record) => {
    record = record 
             || index.parent().type === "record" ? index.parent() : null;
    
    return (record
            ? `${getRecordPath(record)}/${index.name} Table`
            : `${index.name} Table`);
}

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