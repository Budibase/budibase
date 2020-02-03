const buttons = () => [
  {
    name: "common/Primary Button",
    description: "Bootstrap primary button ",
    inherits: "@budibase/standard-components/button",
    props: {
      className: "btn btn-primary",
    },
  },
  {
    name: "common/Default Button",
    description: "Bootstrap default button",
    inherits: "@budibase/standard-components/button",
    props: {
      className: "btn btn-secondary",
    },
  },
]

const forms = ({ records, indexes, helpers }) => [
  ...records.map(root),
  ...buttons(),
]

const formName = record => `${record.name}/${record.name} Form`

const root = record => ({
  name: formName(record),
  description: `Control for creating/updating '${record.nodeKey()}' `,
  inherits: "@budibase/standard-components/div",
  props: {
    className: "p-1",
    children: [
      {
        component: {
          _component: "@budibase/standard-components/h3",
          text: `Edit ${record.name}`,
        },
      },
      form(record),
      saveCancelButtons(record),
    ],
  },
})

const form = record => ({
  component: {
    _component: "@budibase/standard-components/form",
    formControls: record.fields.map(f => formControl(record, f)),
  },
})

const formControl = (record, field) => {
  if (
    field.type === "string" &&
    field.typeOptions.values &&
    field.typeOptions.values.length > 0
  ) {
    return {
      control: {
        _component: "@budibase/standard-components/select",
        options: field.typeOptions.values.map(v => ({ id: v, value: v })),
        value: {
          "##bbstate": `${record.name}.${field.name}`,
          "##bbsource": "store",
        },
        className: "form-control",
      },
      label: field.label,
    }
  } else {
    return {
      control: {
        _component: "@budibase/standard-components/input",
        value: {
          "##bbstate": `${record.name}.${field.name}`,
          "##bbsource": "store",
        },
        className: "form-control",
        type:
          field.type === "string"
            ? "text"
            : field.type === "datetime"
            ? "date"
            : field.type === "number"
            ? "number"
            : "text",
      },
      label: field.label,
    }
  }
}

const saveCancelButtons = record => ({
  component: {
    _component: "@budibase/standard-components/stackpanel",
    direction: "horizontal",
    children: [
      paddedPanelForButton({
        _component: "common/Primary Button",
        contentText: `Save ${record.name}`,
        onClick: [
          {
            "##eventHandlerType": "Save Record",
            parameters: {
              statePath: `${record.name}`,
            },
          },
          {
            "##eventHandlerType": "Set State",
            parameters: {
              path: `isEditing${record.name}`,
              value: "",
            },
          },
        ],
      }),
      paddedPanelForButton({
        _component: "common/Default Button",
        contentText: `Cancel`,
        onClick: [
          {
            "##eventHandlerType": "Set State",
            parameters: {
              path: `isEditing${record.name}`,
              value: "",
            },
          },
        ],
      }),
    ],
  },
})

const paddedPanelForButton = button => ({
  control: {
    _component: "@budibase/standard-components/div",
    className: "btn-group",
    children: [
      {
        component: button,
      },
    ],
  },
})

const getRecordPath = record => {
  const parts = []

  return parts.reverse().join("/")
}

const indexTables = ({ indexes, helpers }) =>
  indexes.map(i => indexTable(i, helpers))

const excludedColumns = ["id", "isNew", "key", "type", "sortKey"]

const indexTableProps = (index, helpers) => ({
  data: {
    "##bbstate": index.nodeKey(),
    "##bbsource": "store",
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
          "##bbsource": "event",
        },
      },
    },
  ],
})

const getIndexTableName = (index, record) => {
  record = record || index.parent().type === "record" ? index.parent() : null

  return record
    ? `${getRecordPath()}/${index.name} Table`
    : `${index.name} Table`
}

const indexTable = (index, helpers) => ({
  name: getIndexTableName(index),
  inherits: "@budibase/standard-components/table",
  props: indexTableProps(index, helpers),
})

const column = col => ({
  title: col.name,
  value: {
    "##bbstate": col.name,
    "##bbsource": "context",
  },
})

const recordHomePageComponents = ({ indexes, records, helpers }) => [
  ...recordHomepages({ indexes, records }).map(component),

  ...recordHomepages({ indexes, records }).map(homePageButtons),

  ...indexTables({ indexes, records, helpers }),

  ...buttons(),
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

const recordHomepages = ({ indexes, records }) =>
  records
    .filter(r => r.parent().type === "root")
    .map(r => ({
      record: r,
      index: findIndexForRecord(indexes, r),
    }))
    .filter(r => r.index)

const homepageComponentName = record => `${record.name}/${record.name} homepage`

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

const selectNavContent = ({ indexes, records, helpers }) => [
  ...recordHomepages({ indexes, records }).map(component$1),

  ...recordHomePageComponents({ indexes, records, helpers }),

  ...forms({ indexes, records, helpers }),
]

const navContentComponentName = record =>
  `${record.name}/${record.name} Nav Content`

const component$1 = ({ record, index }) => ({
  inherits: "@budibase/standard-components/if",
  description: `the component that gets displayed when the ${record.collectionName} nav is selected`,
  name: navContentComponentName(record),
  props: {
    condition: `$store.isEditing${record.name}`,
    thenComponent: {
      _component: formName(record),
    },
    elseComponent: {
      _component: homepageComponentName(record),
    },
  },
})

const app = ({ records, indexes, helpers }) => [
  {
    name: "Application Root",
    inherits: "@budibase/bootstrap-components/nav",
    props: {
      items: recordHomepages({ indexes, records }).map(navItem),
      orientation: "horizontal",
      alignment: "start",
      fill: false,
      pills: true,
      selectedItem: {
        "##bbstate": "selectedNav",
        "##bbstatefallback": `${records[0].name}`,
        "##bbsource": "store",
      },
      className: "p-3",
    },
  },
  {
    name: "Login",
    inherits: "@budibase/standard-components/login",
    props: {},
  },
  ...selectNavContent({ records, indexes, helpers }),
]

const navItem = ({ record }) => ({
  title: record.collectionName,
  component: {
    _component: navContentComponentName(record),
  },
})

export { app, forms, indexTables, recordHomePageComponents as recordHomepages }
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9ycy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2dlbmVyYXRvcnMvYnV0dG9uR2VuZXJhdG9ycy5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL2Zvcm1zR2VuZXJhdG9yLmpzIiwiLi4vc3JjL2dlbmVyYXRvcnMvZ2V0UmVjb3JkUGF0aC5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL2luZGV4VGFibGVzR2VuZXJhdG9yLmpzIiwiLi4vc3JjL2dlbmVyYXRvcnMvcmVjb3JkSG9tZVBhZ2VHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9zZWxlY3RlZE5hdkNvbnRlbnRHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9hcHBHZW5lcmF0b3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGJ1dHRvbnMgPSAoKSA9PiBbXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogXCJjb21tb24vUHJpbWFyeSBCdXR0b25cIixcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJCb290c3RyYXAgcHJpbWFyeSBidXR0b24gXCIsXHJcbiAgICAgICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvYnV0dG9uXCIsXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiBcImNvbW1vbi9EZWZhdWx0IEJ1dHRvblwiLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkJvb3RzdHJhcCBkZWZhdWx0IGJ1dHRvblwiLFxyXG4gICAgICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2J1dHRvblwiLFxyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJidG4gYnRuLXNlY29uZGFyeVwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5dIiwiaW1wb3J0IHtidXR0b25zfSBmcm9tIFwiLi9idXR0b25HZW5lcmF0b3JzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZm9ybXMgPSAoe3JlY29yZHMsIGluZGV4ZXMsIGhlbHBlcnN9KSA9PiBcclxuICAgIFtcclxuICAgICAgICAuLi5yZWNvcmRzLm1hcChyb290KSxcclxuICAgICAgICAuLi5idXR0b25zKHtyZWNvcmRzLCBpbmRleGVzLCBoZWxwZXJzfSlcclxuICAgIF07XHJcblxyXG5leHBvcnQgY29uc3QgZm9ybU5hbWUgPSByZWNvcmQgPT4gIGAke3JlY29yZC5uYW1lfS8ke3JlY29yZC5uYW1lfSBGb3JtYDtcclxuXHJcbmNvbnN0IHJvb3QgPSByZWNvcmQgPT4gKHtcclxuICAgIG5hbWU6IGZvcm1OYW1lKHJlY29yZCksXHJcbiAgICBkZXNjcmlwdGlvbjogYENvbnRyb2wgZm9yIGNyZWF0aW5nL3VwZGF0aW5nICcke3JlY29yZC5ub2RlS2V5KCl9JyBgLFxyXG4gICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvZGl2XCIsXHJcbiAgICBwcm9wczoge1xyXG4gICAgICAgIGNsYXNzTmFtZTpcInAtMVwiLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudDoge1xyXG4gICAgICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvaDNcIixcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgRWRpdCAke3JlY29yZC5uYW1lfWAsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm0ocmVjb3JkKSxcclxuICAgICAgICAgICAgc2F2ZUNhbmNlbEJ1dHRvbnMocmVjb3JkKVxyXG4gICAgICAgIF1cclxuICAgIH1cclxufSkgXHJcblxyXG5jb25zdCBmb3JtID0gcmVjb3JkID0+ICh7XHJcbiAgICBjb21wb25lbnQ6IHtcclxuICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2Zvcm1cIixcclxuICAgICAgICBmb3JtQ29udHJvbHM6IFxyXG4gICAgICAgICAgICByZWNvcmQuZmllbGRzLm1hcChmID0+IGZvcm1Db250cm9sKHJlY29yZCwgZikpXHJcbiAgICB9XHJcbn0pXHJcblxyXG5jb25zdCBmb3JtQ29udHJvbCA9IChyZWNvcmQsIGZpZWxkKSA9PiB7XHJcbiAgICBpZihmaWVsZC50eXBlID09PSBcInN0cmluZ1wiICYmIGZpZWxkLnR5cGVPcHRpb25zLnZhbHVlcyAmJiBmaWVsZC50eXBlT3B0aW9ucy52YWx1ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJldHVybiAoe1xyXG4gICAgICAgICAgICBjb250cm9sOiB7XHJcbiAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL3NlbGVjdFwiLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9uczogZmllbGQudHlwZU9wdGlvbnMudmFsdWVzLm1hcCh2ID0+ICh7aWQ6diwgdmFsdWU6dn0pKSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCIjI2Jic3RhdGVcIjpgJHtyZWNvcmQubmFtZX0uJHtmaWVsZC5uYW1lfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIjI2Jic291cmNlXCI6XCJzdG9yZVwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxhYmVsOiBmaWVsZC5sYWJlbFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKHtcclxuICAgICAgICAgICAgY29udHJvbDoge1xyXG4gICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9pbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIiMjYmJzdGF0ZVwiOmAke3JlY29yZC5uYW1lfS4ke2ZpZWxkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICBcIiMjYmJzb3VyY2VcIjpcInN0b3JlXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sXCIsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBmaWVsZC50eXBlID09PSBcInN0cmluZ1wiID8gXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICA6IGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIiA/IFwiZGF0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgOiBmaWVsZC50eXBlID09PSBcIm51bWJlclwiID8gXCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIDogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGFiZWw6IGZpZWxkLmxhYmVsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHNhdmVDYW5jZWxCdXR0b25zID0gKHJlY29yZCkgPT4gKHtcclxuICAgIGNvbXBvbmVudDoge1xyXG4gICAgICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvc3RhY2twYW5lbFwiLFxyXG4gICAgICAgIGRpcmVjdGlvbjogXCJob3Jpem9udGFsXCIsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgcGFkZGVkUGFuZWxGb3JCdXR0b24oe1xyXG4gICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vUHJpbWFyeSBCdXR0b25cIixcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRUZXh0OiBgU2F2ZSAke3JlY29yZC5uYW1lfWAsXHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiBbICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJTYXZlIFJlY29yZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVBhdGg6IGAke3JlY29yZC5uYW1lfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJTZXQgU3RhdGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYGlzRWRpdGluZyR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBwYWRkZWRQYW5lbEZvckJ1dHRvbih7XHJcbiAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcImNvbW1vbi9EZWZhdWx0IEJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgY29udGVudFRleHQ6IGBDYW5jZWxgLFxyXG4gICAgICAgICAgICAgICAgb25DbGljazogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJTZXQgU3RhdGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYGlzRWRpdGluZyR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG59KVxyXG5cclxuY29uc3QgcGFkZGVkUGFuZWxGb3JCdXR0b24gPSAoYnV0dG9uKSA9PiAoe1xyXG4gICAgY29udHJvbDoge1xyXG4gICAgICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvZGl2XCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcImJ0bi1ncm91cFwiLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudDogYnV0dG9uXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuIiwiZXhwb3J0IGNvbnN0IGdldFJlY29yZFBhdGggPSAocmVjb3JkKSA9PiB7XHJcblxyXG4gICAgY29uc3QgcGFydHMgPSBbXTtcclxuXHJcbiAgICBjb25zdCBhZGQgPSAoY3VycmVudCkgPT4ge1xyXG4gICAgICAgIHBhcnRzLnB1c2goY3VycmVudC5uYW1lKTtcclxuICAgICAgICBpZihjdXJyZW50LnBhcmVudCgpLnR5cGUgPT09IFwicm9vdFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFkZChjdXJyZW50LnBhcmVudCgpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGFydHMucmV2ZXJzZSgpLmpvaW4oXCIvXCIpO1xyXG59IiwiaW1wb3J0IHsgZ2V0UmVjb3JkUGF0aCB9IGZyb20gXCIuL2dldFJlY29yZFBhdGhcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBpbmRleFRhYmxlcyA9ICh7aW5kZXhlcywgaGVscGVyc30pID0+IFxyXG4gICAgaW5kZXhlcy5tYXAoaSA9PiBpbmRleFRhYmxlKGksIGhlbHBlcnMpKTtcclxuXHJcbmNvbnN0IGV4Y2x1ZGVkQ29sdW1ucyA9IFtcImlkXCIsIFwiaXNOZXdcIiwgXCJrZXlcIiwgXCJ0eXBlXCIsIFwic29ydEtleVwiXTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbmRleFRhYmxlUHJvcHMgPSAoaW5kZXgsIGhlbHBlcnMpID0+ICh7XHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgXCIjI2Jic3RhdGVcIjppbmRleC5ub2RlS2V5KCksXHJcbiAgICAgICAgXCIjI2Jic291cmNlXCI6XCJzdG9yZVwiXHJcbiAgICB9LFxyXG4gICAgdGFibGVDbGFzczogXCJ0YWJsZSB0YWJsZS1ob3ZlclwiLFxyXG4gICAgdGhlYWRDbGFzczogXCJ0aGVhZC1kYXJrXCIsXHJcbiAgICBjb2x1bW5zOiBoZWxwZXJzXHJcbiAgICAgICAgICAgICAgICAuaW5kZXhTY2hlbWEoaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGMgPT4gIWV4Y2x1ZGVkQ29sdW1ucy5pbmNsdWRlcyhjLm5hbWUpKVxyXG4gICAgICAgICAgICAgICAgLm1hcChjb2x1bW4pLFxyXG4gICAgb25Sb3dDbGljazogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJTZXQgU3RhdGVcIixcclxuICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgcGF0aDogYHNlbGVjdGVkcm93XyR7aW5kZXgubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIiMjYmJzdGF0ZVwiOiBcImtleVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIyNiYnNvdXJjZVwiOiBcImV2ZW50XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9XHJcbiAgICBdXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEluZGV4VGFibGVOYW1lID0gKGluZGV4LCByZWNvcmQpID0+IHtcclxuICAgIHJlY29yZCA9IHJlY29yZCBcclxuICAgICAgICAgICAgIHx8IGluZGV4LnBhcmVudCgpLnR5cGUgPT09IFwicmVjb3JkXCIgPyBpbmRleC5wYXJlbnQoKSA6IG51bGw7XHJcbiAgICBcclxuICAgIHJldHVybiAocmVjb3JkXHJcbiAgICAgICAgICAgID8gYCR7Z2V0UmVjb3JkUGF0aChyZWNvcmQpfS8ke2luZGV4Lm5hbWV9IFRhYmxlYFxyXG4gICAgICAgICAgICA6IGAke2luZGV4Lm5hbWV9IFRhYmxlYCk7XHJcbn1cclxuXHJcbmNvbnN0IGluZGV4VGFibGUgPSAoaW5kZXgsIGhlbHBlcnMpID0+ICh7XHJcbiAgICBuYW1lOiBnZXRJbmRleFRhYmxlTmFtZShpbmRleCksXHJcbiAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy90YWJsZVwiLFxyXG4gICAgcHJvcHM6IGluZGV4VGFibGVQcm9wcyhpbmRleCwgaGVscGVycylcclxufSk7XHJcblxyXG5jb25zdCBjb2x1bW4gPSAoY29sKSA9PiAoe1xyXG4gICAgdGl0bGU6IGNvbC5uYW1lLFxyXG4gICAgdmFsdWU6IHtcclxuICAgICAgICBcIiMjYmJzdGF0ZVwiOiBjb2wubmFtZSxcclxuICAgICAgICBcIiMjYmJzb3VyY2VcIjpcImNvbnRleHRcIlxyXG4gICAgfVxyXG59KSIsImltcG9ydCB7XHJcbiAgICBnZXRJbmRleFRhYmxlTmFtZSwgaW5kZXhUYWJsZXNcclxufSBmcm9tIFwiLi9pbmRleFRhYmxlc0dlbmVyYXRvclwiO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIGJ1dHRvbnNcclxufSBmcm9tIFwiLi9idXR0b25HZW5lcmF0b3JzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgcmVjb3JkSG9tZVBhZ2VDb21wb25lbnRzID0gKHtpbmRleGVzLCByZWNvcmRzLCBoZWxwZXJzfSkgPT4gXHJcbiAgICBbICAgXHJcbiAgICAgICAgLi4ucmVjb3JkSG9tZXBhZ2VzKHtpbmRleGVzLCByZWNvcmRzfSlcclxuICAgICAgICAgIC5tYXAoY29tcG9uZW50KSxcclxuXHJcbiAgICAgICAgLi4ucmVjb3JkSG9tZXBhZ2VzKHtpbmRleGVzLCByZWNvcmRzfSlcclxuICAgICAgICAgICAgLm1hcChob21lUGFnZUJ1dHRvbnMpLFxyXG4gICAgICAgIFxyXG4gICAgICAgIC4uLmluZGV4VGFibGVzKHtpbmRleGVzLCByZWNvcmRzLCBoZWxwZXJzfSksXHJcblxyXG4gICAgICAgIC4uLmJ1dHRvbnMoe2luZGV4ZXMsIGJ1dHRvbnMsIGhlbHBlcnN9KVxyXG4gICAgXVxyXG5cclxuXHJcbmNvbnN0IGZpbmRJbmRleEZvclJlY29yZCA9IChpbmRleGVzLCByZWNvcmQpID0+IHtcclxuICAgIGNvbnN0IGZvclJlY29yZCA9IGluZGV4ZXMuZmlsdGVyKGkgPT4gaS5hbGxvd2VkUmVjb3JkTm9kZUlkcy5pbmNsdWRlcyhyZWNvcmQubm9kZUlkKSk7XHJcbiAgICBpZihmb3JSZWNvcmQubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICBpZihmb3JSZWNvcmQubGVuZ3RoID09PSAxKSByZXR1cm4gZm9yUmVjb3JkWzBdO1xyXG4gICAgY29uc3Qgbm9NYXAgPSBmb3JSZWNvcmQuZmlsdGVyKGkgPT4gIWkuZmlsdGVyIHx8ICFpLmZpbHRlci50cmltKCkpO1xyXG4gICAgaWYobm9NYXAubGVuZ3RoID09PSAwKSBmb3JSZWNvcmRbMF07XHJcbiAgICByZXR1cm4gbm9NYXBbMF07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZWNvcmRIb21lcGFnZXMgPSAoe2luZGV4ZXMsIHJlY29yZHN9KSA9PiBcclxuICAgIHJlY29yZHMuZmlsdGVyKHIgPT4gci5wYXJlbnQoKS50eXBlID09PSBcInJvb3RcIilcclxuICAgICAgICAubWFwKHIgPT4oe1xyXG4gICAgICAgICAgICByZWNvcmQ6ciwgXHJcbiAgICAgICAgICAgIGluZGV4OmZpbmRJbmRleEZvclJlY29yZChpbmRleGVzLCByKVxyXG4gICAgICAgIH0pKVxyXG4gICAgICAgIC5maWx0ZXIociA9PiByLmluZGV4KTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgIGhvbWVwYWdlQ29tcG9uZW50TmFtZSA9IChyZWNvcmQpID0+IFxyXG4gICAgYCR7cmVjb3JkLm5hbWV9LyR7cmVjb3JkLm5hbWV9IGhvbWVwYWdlYDtcclxuXHJcbmNvbnN0IGNvbXBvbmVudCA9ICh7cmVjb3JkLCBpbmRleH0pID0+ICh7XHJcbiAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9kaXZcIixcclxuICAgIG5hbWU6IGhvbWVwYWdlQ29tcG9uZW50TmFtZShyZWNvcmQpLFxyXG4gICAgcHJvcHM6IHtcclxuICAgICAgICBjbGFzc05hbWU6IFwiZC1mbGV4IGZsZXgtY29sdW1uIGgtMTAwXCIsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2NvbXBvbmVudDogYCR7cmVjb3JkLm5hbWV9L2hvbWVwYWdlIGJ1dHRvbnNgLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBnZXRJbmRleFRhYmxlTmFtZShpbmRleClcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZmxleC1nb3ctMSBvdmVyZmxvdy1hdXRvXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgb25Mb2FkOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2V0IFN0YXRlXCIsXHJcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogYGlzRWRpdGluZyR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIkxpc3QgUmVjb3Jkc1wiLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlUGF0aDogaW5kZXgubm9kZUtleSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4S2V5OiBpbmRleC5ub2RlS2V5KClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuY29uc3QgaG9tZVBhZ2VCdXR0b25zID0gKHtpbmRleCwgcmVjb3JkfSkgPT4gKHtcclxuICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2RpdlwiLFxyXG4gICAgbmFtZTogYCR7cmVjb3JkLm5hbWV9L2hvbWVwYWdlIGJ1dHRvbnNgLFxyXG4gICAgcHJvcHM6IHtcclxuICAgICAgICBjbGFzc05hbWU6IFwiYnRuLXRvb2xiYXIgbXQtNCBtYi0yXCIsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9kaXZcIixcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuLWdyb3VwIG1yLTNcIixcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcImNvbW1vbi9EZWZhdWx0IEJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUZXh0OiBgQ3JlYXRlICR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiR2V0IE5ldyBSZWNvcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVBhdGg6IHJlY29yZC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25LZXk6IGAvJHtyZWNvcmQuY29sbGVjdGlvbk5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFJlY29yZFR5cGU6IHJlY29yZC5uYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIlNldCBTdGF0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGBpc0VkaXRpbmcke3JlY29yZC5uYW1lfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidHJ1ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiY29tbW9uL0RlZmF1bHQgQnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFRleHQ6IGBSZWZyZXNoYCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiTGlzdCBSZWNvcmRzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVQYXRoOiBpbmRleC5ub2RlS2V5KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhLZXk6IGluZGV4Lm5vZGVLZXkoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2lmXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBgJHN0b3JlLnNlbGVjdGVkcm93XyR7aW5kZXgubmFtZX0gJiYgJHN0b3JlLnNlbGVjdGVkcm93XyR7aW5kZXgubmFtZX0ubGVuZ3RoID4gMGAsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhlbkNvbXBvbmVudDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2RpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuLWdyb3VwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiY29tbW9uL0RlZmF1bHQgQnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUZXh0OiBgRWRpdCAke3JlY29yZC5uYW1lfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIkxvYWQgUmVjb3JkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVBhdGg6IHJlY29yZC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRLZXk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIyNiYnN0YXRlXCIgOiBgc2VsZWN0ZWRyb3dfJHtpbmRleC5uYW1lfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiMjc291cmNlXCI6IFwic3RvcmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJTZXQgU3RhdGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGBpc0VkaXRpbmcke3JlY29yZC5uYW1lfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInRydWVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiY29tbW9uL0RlZmF1bHQgQnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUZXh0OiBgRGVsZXRlICR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljazogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiRGVsZXRlIFJlY29yZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkS2V5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiMjYmJzdGF0ZVwiIDogYHNlbGVjdGVkcm93XyR7aW5kZXgubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjI3NvdXJjZVwiOiBcInN0b3JlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH1cclxufSkiLCJpbXBvcnQgeyBcclxuICAgIHJlY29yZEhvbWVwYWdlcywgXHJcbiAgICBob21lcGFnZUNvbXBvbmVudE5hbWUsXHJcbiAgICByZWNvcmRIb21lUGFnZUNvbXBvbmVudHNcclxufSBmcm9tIFwiLi9yZWNvcmRIb21lUGFnZUdlbmVyYXRvclwiO1xyXG5pbXBvcnQgeyBmb3JtTmFtZSwgZm9ybXMgfSBmcm9tIFwiLi9mb3Jtc0dlbmVyYXRvclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNlbGVjdE5hdkNvbnRlbnQgPSAoe2luZGV4ZXMsIHJlY29yZHMsIGhlbHBlcnN9KSA9PiBcclxuICAgIFtcclxuICAgICAgICAuLi5yZWNvcmRIb21lcGFnZXMoe2luZGV4ZXMsIHJlY29yZHN9KVxyXG4gICAgICAgICAgICAubWFwKGNvbXBvbmVudCksXHJcblxyXG4gICAgICAgIC4uLnJlY29yZEhvbWVQYWdlQ29tcG9uZW50cyh7aW5kZXhlcywgcmVjb3JkcywgaGVscGVyc30pLFxyXG5cclxuICAgICAgICAuLi5mb3Jtcyh7aW5kZXhlcywgcmVjb3JkcywgaGVscGVyc30pXHJcblxyXG4gICAgXVxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBuYXZDb250ZW50Q29tcG9uZW50TmFtZSA9IHJlY29yZCA9PlxyXG4gICAgYCR7cmVjb3JkLm5hbWV9LyR7cmVjb3JkLm5hbWV9IE5hdiBDb250ZW50YDtcclxuXHJcbmNvbnN0IGNvbXBvbmVudCA9ICh7cmVjb3JkLCBpbmRleH0pID0+ICh7XHJcbiAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9pZlwiLFxyXG4gICAgZGVzY3JpcHRpb246IGB0aGUgY29tcG9uZW50IHRoYXQgZ2V0cyBkaXNwbGF5ZWQgd2hlbiB0aGUgJHtyZWNvcmQuY29sbGVjdGlvbk5hbWV9IG5hdiBpcyBzZWxlY3RlZGAsXHJcbiAgICBuYW1lOiBuYXZDb250ZW50Q29tcG9uZW50TmFtZShyZWNvcmQpLFxyXG4gICAgcHJvcHM6IHtcclxuICAgICAgICBjb25kaXRpb246IGAkc3RvcmUuaXNFZGl0aW5nJHtyZWNvcmQubmFtZX1gLFxyXG4gICAgICAgIHRoZW5Db21wb25lbnQ6IHtcclxuICAgICAgICAgICAgX2NvbXBvbmVudDogZm9ybU5hbWUocmVjb3JkKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZWxzZUNvbXBvbmVudDoge1xyXG4gICAgICAgICAgICBfY29tcG9uZW50OiBob21lcGFnZUNvbXBvbmVudE5hbWUocmVjb3JkKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7IiwiaW1wb3J0IHsgbmF2Q29udGVudENvbXBvbmVudE5hbWUsIHNlbGVjdE5hdkNvbnRlbnQgfSBmcm9tIFwiLi9zZWxlY3RlZE5hdkNvbnRlbnRHZW5lcmF0b3JcIjtcclxuaW1wb3J0IHsgcmVjb3JkSG9tZXBhZ2VzIH0gZnJvbSBcIi4vcmVjb3JkSG9tZVBhZ2VHZW5lcmF0b3JcIjtcclxuZXhwb3J0IGNvbnN0IGFwcCA9ICh7cmVjb3JkcywgaW5kZXhlcywgaGVscGVyc30pID0+IFtcclxuICAgIHtcclxuICAgICAgICBuYW1lOiBcIkFwcGxpY2F0aW9uIFJvb3RcIixcclxuICAgICAgICBpbmhlcml0czogXCJAYnVkaWJhc2UvYm9vdHN0cmFwLWNvbXBvbmVudHMvbmF2XCIsXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgaXRlbXM6IHJlY29yZEhvbWVwYWdlcyh7aW5kZXhlcywgcmVjb3Jkc30pXHJcbiAgICAgICAgICAgICAgICAgICAgLm1hcChuYXZJdGVtKSxcclxuICAgICAgICAgICAgb3JpZW50YXRpb246IFwiaG9yaXpvbnRhbFwiLFxyXG4gICAgICAgICAgICBhbGlnbm1lbnQ6IFwic3RhcnRcIixcclxuICAgICAgICAgICAgZmlsbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHBpbGxzOiB0cnVlLFxyXG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW06IHtcclxuICAgICAgICAgICAgICAgIFwiIyNiYnN0YXRlXCI6XCJzZWxlY3RlZE5hdlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjI2Jic3RhdGVmYWxsYmFja1wiOmAke3JlY29yZHNbMF0ubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgXCIjI2Jic291cmNlXCI6IFwic3RvcmVcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwicC0zXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6IFwiTG9naW5cIixcclxuICAgICAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9sb2dpblwiLFxyXG4gICAgICAgIHByb3BzOiB7fVxyXG4gICAgfSxcclxuICAgIC4uLnNlbGVjdE5hdkNvbnRlbnQoe3JlY29yZHMsIGluZGV4ZXMsIGhlbHBlcnN9KVxyXG5dXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG5hdkl0ZW0gPSAoe3JlY29yZH0pID0+ICh7XHJcbiAgICB0aXRsZTogcmVjb3JkLmNvbGxlY3Rpb25OYW1lLFxyXG4gICAgY29tcG9uZW50IDoge1xyXG4gICAgICAgIF9jb21wb25lbnQ6IG5hdkNvbnRlbnRDb21wb25lbnROYW1lKHJlY29yZClcclxuICAgIH1cclxufSlcclxuXHJcbiJdLCJuYW1lcyI6WyJjb21wb25lbnQiXSwibWFwcGluZ3MiOiJBQUFPLE1BQU0sT0FBTyxHQUFHLE1BQU07SUFDekI7UUFDSSxJQUFJLEVBQUUsdUJBQXVCO1FBQzdCLFdBQVcsRUFBRSwyQkFBMkI7UUFDeEMsUUFBUSxFQUFFLHNDQUFzQztRQUNoRCxLQUFLLEVBQUU7WUFDSCxTQUFTLEVBQUUsaUJBQWlCO1NBQy9CO0tBQ0o7SUFDRDtRQUNJLElBQUksRUFBRSx1QkFBdUI7UUFDN0IsV0FBVyxFQUFFLDBCQUEwQjtRQUN2QyxRQUFRLEVBQUUsc0NBQXNDO1FBQ2hELEtBQUssRUFBRTtZQUNILFNBQVMsRUFBRSxtQkFBbUI7U0FDakM7S0FDSjs7O0NBQ0osRENmVyxNQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7SUFDN0M7UUFDSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMs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
