export const indexTables = ({indexes, helpers}) => 
    indexes.filter(i => i.parent().type === "root")
           .map(i => indexTable(i, helpers));

export const indexTableProps = (index, helpers) => ({
    data: {
        "##bbstate":index.nodeKey(),
        "##bbsource":"store"
    },
    columns: helpers.indexSchema(index).map(column)
});

const indexTable = (index, helpers) => ({
    name: `tables/${index.name} Table`,
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