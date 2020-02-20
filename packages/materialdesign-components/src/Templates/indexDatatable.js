export default ({ indexes, helpers }) =>
  indexes.map(i => ({
    name: `Table based on index: ${i.name} `,
    props: tableProps(i, helpers.indexSchema(i)),
  }))

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
        text: {
          "##bbstate": `${dataItem(index)}.${col.name}`,
          "##bbstatefallback": "",
          "##bbsource": "context",
        },
      },
    ],
  }))

const dataItem = index => `${index.name}_item`
const dataCollection = index => `store.${index.name}`
const rowCode = index =>
  `
if (!${dataCollection(index)}) return

for (let ${dataItem(index)} of ${dataCollection(index)}) 
  render( { ${dataItem(index)}) }`
