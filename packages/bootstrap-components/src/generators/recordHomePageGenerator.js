import { getIndexTableName, indexTables } from "./indexTablesGenerator"

import { buttons } from "./buttonGenerators"

export const recordHomePageComponents = ({ indexes, records, helpers }) => [
  ...recordHomepages({ indexes, records }).map(component),

  ...recordHomepages({ indexes, records }).map(homePageButtons),

  ...indexTables({ indexes, records, helpers }),

  ...buttons({ indexes, buttons, helpers }),
]

const findIndexForRecord = (indexes, record) => {
  const forRecord = indexes.filter(i =>
    i.allowedRecordNodeIds.includes(record.nodeId)
  )
  if (forRecord.length === 0) return
  if (forRecord.length === 1) return forRecord[0]
  const noMap = forRecord.filter(i => !i.filter || !i.filter.trim())
  if (noMap.length === 0) forRecord[0]
  return noMap[0]
}

export const recordHomepages = ({ indexes, records }) =>
  records
    .filter(r => r.parent().type === "root")
    .map(r => ({
      record: r,
      index: findIndexForRecord(indexes, r),
    }))
    .filter(r => r.index)

export const homepageComponentName = record =>
  `${record.name}/${record.name} homepage`

const component = ({ record, index }) => ({
  inherits: "@budibase/standard-components/div",
  name: homepageComponentName(record),
  props: {
    className: "d-flex flex-column h-100",
    children: [
      {
        component: {
          _component: `${record.name}/homepage buttons`,
        },
      },
      {
        component: {
          _component: getIndexTableName(index),
        },
        className: "flex-gow-1 overflow-auto",
      },
    ],
    onLoad: [
      {
        "##eventHandlerType": "Set State",
        parameters: {
          path: `isEditing${record.name}`,
          value: "",
        },
      },
      {
        "##eventHandlerType": "List Records",
        parameters: {
          statePath: index.nodeKey(),
          indexKey: index.nodeKey(),
        },
      },
    ],
  },
})

const homePageButtons = ({ index, record }) => ({
  inherits: "@budibase/standard-components/div",
  name: `${record.name}/homepage buttons`,
  props: {
    className: "btn-toolbar mt-4 mb-2",
    children: [
      {
        component: {
          _component: "@budibase/standard-components/div",
          className: "btn-group mr-3",
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
                      childRecordType: record.name,
                    },
                  },
                  {
                    "##eventHandlerType": "Set State",
                    parameters: {
                      path: `isEditing${record.name}`,
                      value: "true",
                    },
                  },
                ],
              },
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
                      indexKey: index.nodeKey(),
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        component: {
          _component: "@budibase/standard-components/if",
          condition: `$store.selectedrow_${index.name} && $store.selectedrow_${index.name}.length > 0`,
          thenComponent: {
            _component: "@budibase/standard-components/div",
            className: "btn-group",
            children: [
              {
                component: {
                  _component: "common/Default Button",
                  contentText: `Edit ${record.name}`,
                  onClick: [
                    {
                      "##eventHandlerType": "Load Record",
                      parameters: {
                        statePath: record.name,
                        recordKey: {
                          "##bbstate": `selectedrow_${index.name}`,
                          "##source": "store",
                        },
                      },
                    },
                    {
                      "##eventHandlerType": "Set State",
                      parameters: {
                        path: `isEditing${record.name}`,
                        value: "true",
                      },
                    },
                  ],
                },
              },
              {
                component: {
                  _component: "common/Default Button",
                  contentText: `Delete ${record.name}`,
                  onClick: [
                    {
                      "##eventHandlerType": "Delete Record",
                      parameters: {
                        recordKey: {
                          "##bbstate": `selectedrow_${index.name}`,
                          "##source": "store",
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ],
  },
})
