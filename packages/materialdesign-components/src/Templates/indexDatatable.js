export default ({ indexes, helpers }) =>
  indexes.map(i => ({
    name: `Table based on view: ${i.name} `,
    props: tableProps(
      i,
      helpers.indexSchema(i).filter(c => !excludedColumns.includes(c.name))
    ),
  }))

const excludedColumns = ["id", "key", "sortKey", "type", "isNew"]

const tableProps = (index, indexSchema) => ({
  _component: "@budibase/materialdesign-components/Datatable",
  _children: [
    {
      _component: "@budibase/materialdesign-components/DatatableHead",
      _children: [
        {
          _component: "@budibase/materialdesign-components/DatatableRow",
          isHeader: true,
          _children: columnHeaders(indexSchema),
        },
      ],
    },
    {
      _component: "@budibase/materialdesign-components/DatatableBody",
      _children: [
        {
          _code: rowCode(index),
          _component: "@budibase/materialdesign-components/DatatableRow",
          _children: dataCells(index, indexSchema),
        },
      ],
    },
  ],
  onLoad: [
    {
      "##eventHandlerType": "List Records",
      parameters: {
        indexKey: index.nodeKey(),
        statePath: index.name,
      },
    },
  ],
})

const columnHeaders = indexSchema =>
  indexSchema.map(col => ({
    _component: "@budibase/materialdesign-components/DatatableCell",
    isHeader: true,
    _children: [
      {
        _component: "@budibase/standard-components/text",
        type: "none",
        text: col.name,
        formattingTag: "<b> - bold",
      },
    ],
  }))

const dataCells = (index, indexSchema) =>
  indexSchema.map(col => ({
    _component: "@budibase/materialdesign-components/DatatableCell",
    _children: [
      {
        _component: "@budibase/standard-components/text",
        type: "none",
        text: `context.${dataItem(index)}.${col.name}`,
      },
    ],
  }))

const dataItem = index => `${index.name}_item`
const dataCollection = index => `state.${index.name}`
const rowCode = index =>
  `
if (!${dataCollection(index)}) return

for (let ${dataItem(index)} of ${dataCollection(index)}) 
  render( { ${dataItem(index)} } )`
