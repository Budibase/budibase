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
];

const forms = ({ records, indexes, helpers }) => [
  ...records.map(root),
  ...buttons(),
];

const formName = record => `${record.name}/${record.name} Form`;

const root = record => ({
  name: formName(record),
  description: `Control for creating/updating '${record.nodeKey()}' `,
  inherits: "@budibase/standard-components/container",
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
});

const form = record => ({
  component: {
    _component: "@budibase/standard-components/form",
    formControls: record.fields.map(f => formControl(record, f)),
  },
});

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
};

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
});

const paddedPanelForButton = button => ({
  control: {
    _component: "@budibase/standard-components/container",
    className: "btn-group",
    children: [
      {
        component: button,
      },
    ],
  },
});

const getRecordPath = () => {
  const parts = [];

  return parts.reverse().join("/")
};

const indexTables = ({ indexes, helpers }) =>
  indexes.map(i => indexTable(i, helpers));

const excludedColumns = ["id", "isNew", "key", "type", "sortKey"];

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
});

const getIndexTableName = (index, record) => {
  record = record || index.parent().type === "record" ? index.parent() : null;

  return record
    ? `${getRecordPath()}/${index.name} Table`
    : `${index.name} Table`
};

const indexTable = (index, helpers) => ({
  name: getIndexTableName(index),
  inherits: "@budibase/standard-components/table",
  props: indexTableProps(index, helpers),
});

const column = col => ({
  title: col.name,
  value: {
    "##bbstate": col.name,
    "##bbsource": "context",
  },
});

const recordHomePageComponents = ({ indexes, records, helpers }) => [
  ...recordHomepages({ indexes, records }).map(component),

  ...recordHomepages({ indexes, records }).map(homePageButtons),

  ...indexTables({ indexes, records, helpers }),

  ...buttons(),
];

const findIndexForRecord = (indexes, record) => {
  const forRecord = indexes.filter(i =>
    i.allowedRecordNodeIds.includes(record.nodeId)
  );
  if (forRecord.length === 0) return
  if (forRecord.length === 1) return forRecord[0]
  const noMap = forRecord.filter(i => !i.filter || !i.filter.trim());
  if (noMap.length === 0) forRecord[0];
  return noMap[0]
};

const recordHomepages = ({ indexes, records }) =>
  records
    .filter(r => r.parent().type === "root")
    .map(r => ({
      record: r,
      index: findIndexForRecord(indexes, r),
    }))
    .filter(r => r.index);

const homepageComponentName = record =>
  `${record.name}/${record.name} homepage`;

const component = ({ record, index }) => ({
  inherits: "@budibase/standard-components/container",
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
});

const homePageButtons = ({ index, record }) => ({
  inherits: "@budibase/standard-components/container",
  name: `${record.name}/homepage buttons`,
  props: {
    className: "btn-toolbar mt-4 mb-2",
    children: [
      {
        component: {
          _component: "@budibase/standard-components/container",
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
            _component: "@budibase/standard-components/container",
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
});

const selectNavContent = ({ indexes, records, helpers }) => [
  ...recordHomepages({ indexes, records }).map(component$1),

  ...recordHomePageComponents({ indexes, records, helpers }),

  ...forms({ indexes, records, helpers }),
];

const navContentComponentName = record =>
  `${record.name}/${record.name} Nav Content`;

const component$1 = ({ record }) => ({
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
});

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
];

const navItem = ({ record }) => ({
  title: record.collectionName,
  component: {
    _component: navContentComponentName(record),
  },
});

export { app, forms, indexTables, recordHomePageComponents as recordHomepages };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9ycy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2dlbmVyYXRvcnMvYnV0dG9uR2VuZXJhdG9ycy5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL2Zvcm1zR2VuZXJhdG9yLmpzIiwiLi4vc3JjL2dlbmVyYXRvcnMvZ2V0UmVjb3JkUGF0aC5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL2luZGV4VGFibGVzR2VuZXJhdG9yLmpzIiwiLi4vc3JjL2dlbmVyYXRvcnMvcmVjb3JkSG9tZVBhZ2VHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9zZWxlY3RlZE5hdkNvbnRlbnRHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9hcHBHZW5lcmF0b3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGJ1dHRvbnMgPSAoKSA9PiBbXHJcbiAge1xyXG4gICAgbmFtZTogXCJjb21tb24vUHJpbWFyeSBCdXR0b25cIixcclxuICAgIGRlc2NyaXB0aW9uOiBcIkJvb3RzdHJhcCBwcmltYXJ5IGJ1dHRvbiBcIixcclxuICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2J1dHRvblwiLFxyXG4gICAgcHJvcHM6IHtcclxuICAgICAgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwiLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6IFwiY29tbW9uL0RlZmF1bHQgQnV0dG9uXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogXCJCb290c3RyYXAgZGVmYXVsdCBidXR0b25cIixcclxuICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2J1dHRvblwiLFxyXG4gICAgcHJvcHM6IHtcclxuICAgICAgY2xhc3NOYW1lOiBcImJ0biBidG4tc2Vjb25kYXJ5XCIsXHJcbiAgICB9LFxyXG4gIH0sXHJcbl1cclxuIiwiaW1wb3J0IHsgYnV0dG9ucyB9IGZyb20gXCIuL2J1dHRvbkdlbmVyYXRvcnNcIlxyXG5cclxuZXhwb3J0IGNvbnN0IGZvcm1zID0gKHsgcmVjb3JkcywgaW5kZXhlcywgaGVscGVycyB9KSA9PiBbXHJcbiAgLi4ucmVjb3Jkcy5tYXAocm9vdCksXHJcbiAgLi4uYnV0dG9ucyh7IHJlY29yZHMsIGluZGV4ZXMsIGhlbHBlcnMgfSksXHJcbl1cclxuXHJcbmV4cG9ydCBjb25zdCBmb3JtTmFtZSA9IHJlY29yZCA9PiBgJHtyZWNvcmQubmFtZX0vJHtyZWNvcmQubmFtZX0gRm9ybWBcclxuXHJcbmNvbnN0IHJvb3QgPSByZWNvcmQgPT4gKHtcclxuICBuYW1lOiBmb3JtTmFtZShyZWNvcmQpLFxyXG4gIGRlc2NyaXB0aW9uOiBgQ29udHJvbCBmb3IgY3JlYXRpbmcvdXBkYXRpbmcgJyR7cmVjb3JkLm5vZGVLZXkoKX0nIGAsXHJcbiAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvY29udGFpbmVyXCIsXHJcbiAgcHJvcHM6IHtcclxuICAgIGNsYXNzTmFtZTogXCJwLTFcIixcclxuICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBjb21wb25lbnQ6IHtcclxuICAgICAgICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvaDNcIixcclxuICAgICAgICAgIHRleHQ6IGBFZGl0ICR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBmb3JtKHJlY29yZCksXHJcbiAgICAgIHNhdmVDYW5jZWxCdXR0b25zKHJlY29yZCksXHJcbiAgICBdLFxyXG4gIH0sXHJcbn0pXHJcblxyXG5jb25zdCBmb3JtID0gcmVjb3JkID0+ICh7XHJcbiAgY29tcG9uZW50OiB7XHJcbiAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2Zvcm1cIixcclxuICAgIGZvcm1Db250cm9sczogcmVjb3JkLmZpZWxkcy5tYXAoZiA9PiBmb3JtQ29udHJvbChyZWNvcmQsIGYpKSxcclxuICB9LFxyXG59KVxyXG5cclxuY29uc3QgZm9ybUNvbnRyb2wgPSAocmVjb3JkLCBmaWVsZCkgPT4ge1xyXG4gIGlmIChcclxuICAgIGZpZWxkLnR5cGUgPT09IFwic3RyaW5nXCIgJiZcclxuICAgIGZpZWxkLnR5cGVPcHRpb25zLnZhbHVlcyAmJlxyXG4gICAgZmllbGQudHlwZU9wdGlvbnMudmFsdWVzLmxlbmd0aCA+IDBcclxuICApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGNvbnRyb2w6IHtcclxuICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL3NlbGVjdFwiLFxyXG4gICAgICAgIG9wdGlvbnM6IGZpZWxkLnR5cGVPcHRpb25zLnZhbHVlcy5tYXAodiA9PiAoeyBpZDogdiwgdmFsdWU6IHYgfSkpLFxyXG4gICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICBcIiMjYmJzdGF0ZVwiOiBgJHtyZWNvcmQubmFtZX0uJHtmaWVsZC5uYW1lfWAsXHJcbiAgICAgICAgICBcIiMjYmJzb3VyY2VcIjogXCJzdG9yZVwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiLFxyXG4gICAgICB9LFxyXG4gICAgICBsYWJlbDogZmllbGQubGFiZWwsXHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGNvbnRyb2w6IHtcclxuICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2lucHV0XCIsXHJcbiAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgIFwiIyNiYnN0YXRlXCI6IGAke3JlY29yZC5uYW1lfS4ke2ZpZWxkLm5hbWV9YCxcclxuICAgICAgICAgIFwiIyNiYnNvdXJjZVwiOiBcInN0b3JlXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sXCIsXHJcbiAgICAgICAgdHlwZTpcclxuICAgICAgICAgIGZpZWxkLnR5cGUgPT09IFwic3RyaW5nXCJcclxuICAgICAgICAgICAgPyBcInRleHRcIlxyXG4gICAgICAgICAgICA6IGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIlxyXG4gICAgICAgICAgICA/IFwiZGF0ZVwiXHJcbiAgICAgICAgICAgIDogZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIlxyXG4gICAgICAgICAgICA/IFwibnVtYmVyXCJcclxuICAgICAgICAgICAgOiBcInRleHRcIixcclxuICAgICAgfSxcclxuICAgICAgbGFiZWw6IGZpZWxkLmxhYmVsLFxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuY29uc3Qgc2F2ZUNhbmNlbEJ1dHRvbnMgPSByZWNvcmQgPT4gKHtcclxuICBjb21wb25lbnQ6IHtcclxuICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvc3RhY2twYW5lbFwiLFxyXG4gICAgZGlyZWN0aW9uOiBcImhvcml6b250YWxcIixcclxuICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgIHBhZGRlZFBhbmVsRm9yQnV0dG9uKHtcclxuICAgICAgICBfY29tcG9uZW50OiBcImNvbW1vbi9QcmltYXJ5IEJ1dHRvblwiLFxyXG4gICAgICAgIGNvbnRlbnRUZXh0OiBgU2F2ZSAke3JlY29yZC5uYW1lfWAsXHJcbiAgICAgICAgb25DbGljazogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIlNhdmUgUmVjb3JkXCIsXHJcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgICAgICBzdGF0ZVBhdGg6IGAke3JlY29yZC5uYW1lfWAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIlNldCBTdGF0ZVwiLFxyXG4gICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgcGF0aDogYGlzRWRpdGluZyR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICB2YWx1ZTogXCJcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgfSksXHJcbiAgICAgIHBhZGRlZFBhbmVsRm9yQnV0dG9uKHtcclxuICAgICAgICBfY29tcG9uZW50OiBcImNvbW1vbi9EZWZhdWx0IEJ1dHRvblwiLFxyXG4gICAgICAgIGNvbnRlbnRUZXh0OiBgQ2FuY2VsYCxcclxuICAgICAgICBvbkNsaWNrOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2V0IFN0YXRlXCIsXHJcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgICAgICBwYXRoOiBgaXNFZGl0aW5nJHtyZWNvcmQubmFtZX1gLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBcIlwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICB9KSxcclxuICAgIF0sXHJcbiAgfSxcclxufSlcclxuXHJcbmNvbnN0IHBhZGRlZFBhbmVsRm9yQnV0dG9uID0gYnV0dG9uID0+ICh7XHJcbiAgY29udHJvbDoge1xyXG4gICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9jb250YWluZXJcIixcclxuICAgIGNsYXNzTmFtZTogXCJidG4tZ3JvdXBcIixcclxuICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBjb21wb25lbnQ6IGJ1dHRvbixcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgfSxcclxufSlcclxuIiwiZXhwb3J0IGNvbnN0IGdldFJlY29yZFBhdGggPSAoKSA9PiB7XHJcbiAgY29uc3QgcGFydHMgPSBbXVxyXG5cclxuICBjb25zdCBhZGQgPSBjdXJyZW50ID0+IHtcclxuICAgIHBhcnRzLnB1c2goY3VycmVudC5uYW1lKVxyXG4gICAgaWYgKGN1cnJlbnQucGFyZW50KCkudHlwZSA9PT0gXCJyb290XCIpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgYWRkKGN1cnJlbnQucGFyZW50KCkpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gcGFydHMucmV2ZXJzZSgpLmpvaW4oXCIvXCIpXHJcbn1cclxuIiwiaW1wb3J0IHsgZ2V0UmVjb3JkUGF0aCB9IGZyb20gXCIuL2dldFJlY29yZFBhdGhcIlxyXG5cclxuZXhwb3J0IGNvbnN0IGluZGV4VGFibGVzID0gKHsgaW5kZXhlcywgaGVscGVycyB9KSA9PlxyXG4gIGluZGV4ZXMubWFwKGkgPT4gaW5kZXhUYWJsZShpLCBoZWxwZXJzKSlcclxuXHJcbmNvbnN0IGV4Y2x1ZGVkQ29sdW1ucyA9IFtcImlkXCIsIFwiaXNOZXdcIiwgXCJrZXlcIiwgXCJ0eXBlXCIsIFwic29ydEtleVwiXVxyXG5cclxuZXhwb3J0IGNvbnN0IGluZGV4VGFibGVQcm9wcyA9IChpbmRleCwgaGVscGVycykgPT4gKHtcclxuICBkYXRhOiB7XHJcbiAgICBcIiMjYmJzdGF0ZVwiOiBpbmRleC5ub2RlS2V5KCksXHJcbiAgICBcIiMjYmJzb3VyY2VcIjogXCJzdG9yZVwiLFxyXG4gIH0sXHJcbiAgdGFibGVDbGFzczogXCJ0YWJsZSB0YWJsZS1ob3ZlclwiLFxyXG4gIHRoZWFkQ2xhc3M6IFwidGhlYWQtZGFya1wiLFxyXG4gIGNvbHVtbnM6IGhlbHBlcnNcclxuICAgIC5pbmRleFNjaGVtYShpbmRleClcclxuICAgIC5maWx0ZXIoYyA9PiAhZXhjbHVkZWRDb2x1bW5zLmluY2x1ZGVzKGMubmFtZSkpXHJcbiAgICAubWFwKGNvbHVtbiksXHJcbiAgb25Sb3dDbGljazogW1xyXG4gICAge1xyXG4gICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIlNldCBTdGF0ZVwiLFxyXG4gICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgcGF0aDogYHNlbGVjdGVkcm93XyR7aW5kZXgubmFtZX1gLFxyXG4gICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICBcIiMjYmJzdGF0ZVwiOiBcImtleVwiLFxyXG4gICAgICAgICAgXCIjI2Jic291cmNlXCI6IFwiZXZlbnRcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59KVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldEluZGV4VGFibGVOYW1lID0gKGluZGV4LCByZWNvcmQpID0+IHtcclxuICByZWNvcmQgPSByZWNvcmQgfHwgaW5kZXgucGFyZW50KCkudHlwZSA9PT0gXCJyZWNvcmRcIiA/IGluZGV4LnBhcmVudCgpIDogbnVsbFxyXG5cclxuICByZXR1cm4gcmVjb3JkXHJcbiAgICA/IGAke2dldFJlY29yZFBhdGgocmVjb3JkKX0vJHtpbmRleC5uYW1lfSBUYWJsZWBcclxuICAgIDogYCR7aW5kZXgubmFtZX0gVGFibGVgXHJcbn1cclxuXHJcbmNvbnN0IGluZGV4VGFibGUgPSAoaW5kZXgsIGhlbHBlcnMpID0+ICh7XHJcbiAgbmFtZTogZ2V0SW5kZXhUYWJsZU5hbWUoaW5kZXgpLFxyXG4gIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL3RhYmxlXCIsXHJcbiAgcHJvcHM6IGluZGV4VGFibGVQcm9wcyhpbmRleCwgaGVscGVycyksXHJcbn0pXHJcblxyXG5jb25zdCBjb2x1bW4gPSBjb2wgPT4gKHtcclxuICB0aXRsZTogY29sLm5hbWUsXHJcbiAgdmFsdWU6IHtcclxuICAgIFwiIyNiYnN0YXRlXCI6IGNvbC5uYW1lLFxyXG4gICAgXCIjI2Jic291cmNlXCI6IFwiY29udGV4dFwiLFxyXG4gIH0sXHJcbn0pXHJcbiIsImltcG9ydCB7IGdldEluZGV4VGFibGVOYW1lLCBpbmRleFRhYmxlcyB9IGZyb20gXCIuL2luZGV4VGFibGVzR2VuZXJhdG9yXCJcclxuXHJcbmltcG9ydCB7IGJ1dHRvbnMgfSBmcm9tIFwiLi9idXR0b25HZW5lcmF0b3JzXCJcclxuXHJcbmV4cG9ydCBjb25zdCByZWNvcmRIb21lUGFnZUNvbXBvbmVudHMgPSAoeyBpbmRleGVzLCByZWNvcmRzLCBoZWxwZXJzIH0pID0+IFtcclxuICAuLi5yZWNvcmRIb21lcGFnZXMoeyBpbmRleGVzLCByZWNvcmRzIH0pLm1hcChjb21wb25lbnQpLFxyXG5cclxuICAuLi5yZWNvcmRIb21lcGFnZXMoeyBpbmRleGVzLCByZWNvcmRzIH0pLm1hcChob21lUGFnZUJ1dHRvbnMpLFxyXG5cclxuICAuLi5pbmRleFRhYmxlcyh7IGluZGV4ZXMsIHJlY29yZHMsIGhlbHBlcnMgfSksXHJcblxyXG4gIC4uLmJ1dHRvbnMoeyBpbmRleGVzLCBidXR0b25zLCBoZWxwZXJzIH0pLFxyXG5dXHJcblxyXG5jb25zdCBmaW5kSW5kZXhGb3JSZWNvcmQgPSAoaW5kZXhlcywgcmVjb3JkKSA9PiB7XHJcbiAgY29uc3QgZm9yUmVjb3JkID0gaW5kZXhlcy5maWx0ZXIoaSA9PlxyXG4gICAgaS5hbGxvd2VkUmVjb3JkTm9kZUlkcy5pbmNsdWRlcyhyZWNvcmQubm9kZUlkKVxyXG4gIClcclxuICBpZiAoZm9yUmVjb3JkLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcbiAgaWYgKGZvclJlY29yZC5sZW5ndGggPT09IDEpIHJldHVybiBmb3JSZWNvcmRbMF1cclxuICBjb25zdCBub01hcCA9IGZvclJlY29yZC5maWx0ZXIoaSA9PiAhaS5maWx0ZXIgfHwgIWkuZmlsdGVyLnRyaW0oKSlcclxuICBpZiAobm9NYXAubGVuZ3RoID09PSAwKSBmb3JSZWNvcmRbMF1cclxuICByZXR1cm4gbm9NYXBbMF1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlY29yZEhvbWVwYWdlcyA9ICh7IGluZGV4ZXMsIHJlY29yZHMgfSkgPT5cclxuICByZWNvcmRzXHJcbiAgICAuZmlsdGVyKHIgPT4gci5wYXJlbnQoKS50eXBlID09PSBcInJvb3RcIilcclxuICAgIC5tYXAociA9PiAoe1xyXG4gICAgICByZWNvcmQ6IHIsXHJcbiAgICAgIGluZGV4OiBmaW5kSW5kZXhGb3JSZWNvcmQoaW5kZXhlcywgciksXHJcbiAgICB9KSlcclxuICAgIC5maWx0ZXIociA9PiByLmluZGV4KVxyXG5cclxuZXhwb3J0IGNvbnN0IGhvbWVwYWdlQ29tcG9uZW50TmFtZSA9IHJlY29yZCA9PlxyXG4gIGAke3JlY29yZC5uYW1lfS8ke3JlY29yZC5uYW1lfSBob21lcGFnZWBcclxuXHJcbmNvbnN0IGNvbXBvbmVudCA9ICh7IHJlY29yZCwgaW5kZXggfSkgPT4gKHtcclxuICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9jb250YWluZXJcIixcclxuICBuYW1lOiBob21lcGFnZUNvbXBvbmVudE5hbWUocmVjb3JkKSxcclxuICBwcm9wczoge1xyXG4gICAgY2xhc3NOYW1lOiBcImQtZmxleCBmbGV4LWNvbHVtbiBoLTEwMFwiLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAge1xyXG4gICAgICAgIGNvbXBvbmVudDoge1xyXG4gICAgICAgICAgX2NvbXBvbmVudDogYCR7cmVjb3JkLm5hbWV9L2hvbWVwYWdlIGJ1dHRvbnNgLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBjb21wb25lbnQ6IHtcclxuICAgICAgICAgIF9jb21wb25lbnQ6IGdldEluZGV4VGFibGVOYW1lKGluZGV4KSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsYXNzTmFtZTogXCJmbGV4LWdvdy0xIG92ZXJmbG93LWF1dG9cIixcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBvbkxvYWQ6IFtcclxuICAgICAge1xyXG4gICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2V0IFN0YXRlXCIsXHJcbiAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgcGF0aDogYGlzRWRpdGluZyR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgIHZhbHVlOiBcIlwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIkxpc3QgUmVjb3Jkc1wiLFxyXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgIHN0YXRlUGF0aDogaW5kZXgubm9kZUtleSgpLFxyXG4gICAgICAgICAgaW5kZXhLZXk6IGluZGV4Lm5vZGVLZXkoKSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICB9LFxyXG59KVxyXG5cclxuY29uc3QgaG9tZVBhZ2VCdXR0b25zID0gKHsgaW5kZXgsIHJlY29yZCB9KSA9PiAoe1xyXG4gIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2NvbnRhaW5lclwiLFxyXG4gIG5hbWU6IGAke3JlY29yZC5uYW1lfS9ob21lcGFnZSBidXR0b25zYCxcclxuICBwcm9wczoge1xyXG4gICAgY2xhc3NOYW1lOiBcImJ0bi10b29sYmFyIG10LTQgbWItMlwiLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAge1xyXG4gICAgICAgIGNvbXBvbmVudDoge1xyXG4gICAgICAgICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9jb250YWluZXJcIixcclxuICAgICAgICAgIGNsYXNzTmFtZTogXCJidG4tZ3JvdXAgbXItM1wiLFxyXG4gICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGNvbXBvbmVudDoge1xyXG4gICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vRGVmYXVsdCBCdXR0b25cIixcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRUZXh0OiBgQ3JlYXRlICR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IFtcclxuICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiR2V0IE5ldyBSZWNvcmRcIixcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVBhdGg6IHJlY29yZC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbktleTogYC8ke3JlY29yZC5jb2xsZWN0aW9uTmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRSZWNvcmRUeXBlOiByZWNvcmQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJTZXQgU3RhdGVcIixcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBgaXNFZGl0aW5nJHtyZWNvcmQubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidHJ1ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBjb21wb25lbnQ6IHtcclxuICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiY29tbW9uL0RlZmF1bHQgQnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50VGV4dDogYFJlZnJlc2hgLFxyXG4gICAgICAgICAgICAgICAgb25DbGljazogW1xyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJMaXN0IFJlY29yZHNcIixcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVBhdGg6IGluZGV4Lm5vZGVLZXkoKSxcclxuICAgICAgICAgICAgICAgICAgICAgIGluZGV4S2V5OiBpbmRleC5ub2RlS2V5KCksXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGNvbXBvbmVudDoge1xyXG4gICAgICAgICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9pZlwiLFxyXG4gICAgICAgICAgY29uZGl0aW9uOiBgJHN0b3JlLnNlbGVjdGVkcm93XyR7aW5kZXgubmFtZX0gJiYgJHN0b3JlLnNlbGVjdGVkcm93XyR7aW5kZXgubmFtZX0ubGVuZ3RoID4gMGAsXHJcbiAgICAgICAgICB0aGVuQ29tcG9uZW50OiB7XHJcbiAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvY29udGFpbmVyXCIsXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJidG4tZ3JvdXBcIixcclxuICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vRGVmYXVsdCBCdXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgY29udGVudFRleHQ6IGBFZGl0ICR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgb25DbGljazogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiTG9hZCBSZWNvcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVQYXRoOiByZWNvcmQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkS2V5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjI2Jic3RhdGVcIjogYHNlbGVjdGVkcm93XyR7aW5kZXgubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiIyNzb3VyY2VcIjogXCJzdG9yZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2V0IFN0YXRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGBpc0VkaXRpbmcke3JlY29yZC5uYW1lfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInRydWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vRGVmYXVsdCBCdXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgY29udGVudFRleHQ6IGBEZWxldGUgJHtyZWNvcmQubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJEZWxldGUgUmVjb3JkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZEtleToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiIyNiYnN0YXRlXCI6IGBzZWxlY3RlZHJvd18ke2luZGV4Lm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIiMjc291cmNlXCI6IFwic3RvcmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgfSxcclxufSlcclxuIiwiaW1wb3J0IHtcclxuICByZWNvcmRIb21lcGFnZXMsXHJcbiAgaG9tZXBhZ2VDb21wb25lbnROYW1lLFxyXG4gIHJlY29yZEhvbWVQYWdlQ29tcG9uZW50cyxcclxufSBmcm9tIFwiLi9yZWNvcmRIb21lUGFnZUdlbmVyYXRvclwiXHJcbmltcG9ydCB7IGZvcm1OYW1lLCBmb3JtcyB9IGZyb20gXCIuL2Zvcm1zR2VuZXJhdG9yXCJcclxuXHJcbmV4cG9ydCBjb25zdCBzZWxlY3ROYXZDb250ZW50ID0gKHsgaW5kZXhlcywgcmVjb3JkcywgaGVscGVycyB9KSA9PiBbXHJcbiAgLi4ucmVjb3JkSG9tZXBhZ2VzKHsgaW5kZXhlcywgcmVjb3JkcyB9KS5tYXAoY29tcG9uZW50KSxcclxuXHJcbiAgLi4ucmVjb3JkSG9tZVBhZ2VDb21wb25lbnRzKHsgaW5kZXhlcywgcmVjb3JkcywgaGVscGVycyB9KSxcclxuXHJcbiAgLi4uZm9ybXMoeyBpbmRleGVzLCByZWNvcmRzLCBoZWxwZXJzIH0pLFxyXG5dXHJcblxyXG5leHBvcnQgY29uc3QgbmF2Q29udGVudENvbXBvbmVudE5hbWUgPSByZWNvcmQgPT5cclxuICBgJHtyZWNvcmQubmFtZX0vJHtyZWNvcmQubmFtZX0gTmF2IENvbnRlbnRgXHJcblxyXG5jb25zdCBjb21wb25lbnQgPSAoeyByZWNvcmQgfSkgPT4gKHtcclxuICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9pZlwiLFxyXG4gIGRlc2NyaXB0aW9uOiBgdGhlIGNvbXBvbmVudCB0aGF0IGdldHMgZGlzcGxheWVkIHdoZW4gdGhlICR7cmVjb3JkLmNvbGxlY3Rpb25OYW1lfSBuYXYgaXMgc2VsZWN0ZWRgLFxyXG4gIG5hbWU6IG5hdkNvbnRlbnRDb21wb25lbnROYW1lKHJlY29yZCksXHJcbiAgcHJvcHM6IHtcclxuICAgIGNvbmRpdGlvbjogYCRzdG9yZS5pc0VkaXRpbmcke3JlY29yZC5uYW1lfWAsXHJcbiAgICB0aGVuQ29tcG9uZW50OiB7XHJcbiAgICAgIF9jb21wb25lbnQ6IGZvcm1OYW1lKHJlY29yZCksXHJcbiAgICB9LFxyXG4gICAgZWxzZUNvbXBvbmVudDoge1xyXG4gICAgICBfY29tcG9uZW50OiBob21lcGFnZUNvbXBvbmVudE5hbWUocmVjb3JkKSxcclxuICAgIH0sXHJcbiAgfSxcclxufSlcclxuIiwiaW1wb3J0IHtcclxuICBuYXZDb250ZW50Q29tcG9uZW50TmFtZSxcclxuICBzZWxlY3ROYXZDb250ZW50LFxyXG59IGZyb20gXCIuL3NlbGVjdGVkTmF2Q29udGVudEdlbmVyYXRvclwiXHJcbmltcG9ydCB7IHJlY29yZEhvbWVwYWdlcyB9IGZyb20gXCIuL3JlY29yZEhvbWVQYWdlR2VuZXJhdG9yXCJcclxuZXhwb3J0IGNvbnN0IGFwcCA9ICh7IHJlY29yZHMsIGluZGV4ZXMsIGhlbHBlcnMgfSkgPT4gW1xyXG4gIHtcclxuICAgIG5hbWU6IFwiQXBwbGljYXRpb24gUm9vdFwiLFxyXG4gICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL2Jvb3RzdHJhcC1jb21wb25lbnRzL25hdlwiLFxyXG4gICAgcHJvcHM6IHtcclxuICAgICAgaXRlbXM6IHJlY29yZEhvbWVwYWdlcyh7IGluZGV4ZXMsIHJlY29yZHMgfSkubWFwKG5hdkl0ZW0pLFxyXG4gICAgICBvcmllbnRhdGlvbjogXCJob3Jpem9udGFsXCIsXHJcbiAgICAgIGFsaWdubWVudDogXCJzdGFydFwiLFxyXG4gICAgICBmaWxsOiBmYWxzZSxcclxuICAgICAgcGlsbHM6IHRydWUsXHJcbiAgICAgIHNlbGVjdGVkSXRlbToge1xyXG4gICAgICAgIFwiIyNiYnN0YXRlXCI6IFwic2VsZWN0ZWROYXZcIixcclxuICAgICAgICBcIiMjYmJzdGF0ZWZhbGxiYWNrXCI6IGAke3JlY29yZHNbMF0ubmFtZX1gLFxyXG4gICAgICAgIFwiIyNiYnNvdXJjZVwiOiBcInN0b3JlXCIsXHJcbiAgICAgIH0sXHJcbiAgICAgIGNsYXNzTmFtZTogXCJwLTNcIixcclxuICAgIH0sXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiBcIkxvZ2luXCIsXHJcbiAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9sb2dpblwiLFxyXG4gICAgcHJvcHM6IHt9LFxyXG4gIH0sXHJcbiAgLi4uc2VsZWN0TmF2Q29udGVudCh7IHJlY29yZHMsIGluZGV4ZXMsIGhlbHBlcnMgfSksXHJcbl1cclxuXHJcbmV4cG9ydCBjb25zdCBuYXZJdGVtID0gKHsgcmVjb3JkIH0pID0+ICh7XHJcbiAgdGl0bGU6IHJlY29yZC5jb2xsZWN0aW9uTmFtZSxcclxuICBjb21wb25lbnQ6IHtcclxuICAgIF9jb21wb25lbnQ6IG5hdkNvbnRlbnRDb21wb25lbnROYW1lKHJlY29yZCksXHJcbiAgfSxcclxufSlcclxuIl0sIm5hbWVzIjpbImNvbXBvbmVudCJdLCJtYXBwaW5ncyI6IkFBQU8sTUFBTSxPQUFPLEdBQUcsTUFBTTtFQUMzQjtJQUNFLElBQUksRUFBRSx1QkFBdUI7SUFDN0IsV0FBVyxFQUFFLDJCQUEyQjtJQUN4QyxRQUFRLEVBQUUsc0NBQXNDO0lBQ2hELEtBQUssRUFBRTtNQUNMLFNBQVMsRUFBRSxpQkFBaUI7S0FDN0I7R0FDRjtFQUNEO0lBQ0UsSUFBSSxFQUFFLHVCQUF1QjtJQUM3QixXQUFXLEVBQUUsMEJBQTBCO0lBQ3ZDLFFBQVEsRUFBRSxzQ0FBc0M7SUFDaEQsS0FBSyxFQUFFO01BQ0wsU0FBUyxFQUFFLG1CQUFtQjtLQUMvQjtHQUNGO0NBQ0Y7O0FDZlcsTUFBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUs7RUFDdEQsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztFQUNwQixHQUFHLE9BQU8sQ0FBQyxBQUE2QixDQUFDO0VBQzFDOztBQUVELEFBQU8sTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQzs7QUFFdEUsTUFBTSxJQUFJLEdBQUcsTUFBTSxLQUFLO0VBQ3RCLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDO0VBQ3RCLFdBQVcsRUFBRSxDQUFDLCtCQUErQixFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7RUFDbkUsUUFBUSxFQUFFLHlDQUF5QztFQUNuRCxLQUFLLEVBQUU7SUFDTCxTQUFTLEVBQUUsS0FBSztJQUNoQixRQUFRLEVBQUU7TUFDUjtRQUNFLFNBQVMsRUFBRTtVQUNULFVBQVUsRUFBRSxrQ0FBa0M7VUFDOUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QjtPQUNGO01BQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQztNQUNaLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztLQUMxQjtHQUNGO0NBQ0YsRUFBQzs7QUFFRixNQUFNLElBQUksR0FBRyxNQUFNLEtBQUs7RUFDdEIsU0FBUyxFQUFFO0lBQ1QsVUFBVSxFQUFFLG9DQUFvQztJQUNoRCxZQUFZLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDN0Q7Q0FDRixFQUFDOztBQUVGLE1BQU0sV0FBVyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssS0FBSztFQUNyQztJQUNFLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUTtJQUN2QixLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU07SUFDeEIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUM7SUFDbkM7SUFDQSxPQUFPO01BQ0wsT0FBTyxFQUFFO1FBQ1AsVUFBVSxFQUFFLHNDQUFzQztRQUNsRCxPQUFPLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakUsS0FBSyxFQUFFO1VBQ0wsV0FBVyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7VUFDM0MsWUFBWSxFQUFFLE9BQU87U0FDdEI7UUFDRCxTQUFTLEVBQUUsY0FBYztPQUMxQjtNQUNELEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztLQUNuQjtHQUNGLE1BQU07SUFDTCxPQUFPO01BQ0wsT0FBTyxFQUFFO1FBQ1AsVUFBVSxFQUFFLHFDQUFxQztRQUNqRCxLQUFLLEVBQUU7VUFDTCxXQUFXLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztVQUMzQyxZQUFZLEVBQUUsT0FBTztTQUN0QjtRQUNELFNBQVMsRUFBRSxjQUFjO1FBQ3pCLElBQUk7VUFDRixLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVE7Y0FDbkIsTUFBTTtjQUNOLEtBQUssQ0FBQyxJQUFJLEtBQUssVUFBVTtjQUN6QixNQUFNO2NBQ04sS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRO2NBQ3ZCLFFBQVE7Y0FDUixNQUFNO09BQ2I7TUFDRCxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7S0FDbkI7R0FDRjtFQUNGOztBQUVELE1BQU0saUJBQWlCLEdBQUcsTUFBTSxLQUFLO0VBQ25DLFNBQVMsRUFBRTtJQUNULFVBQVUsRUFBRSwwQ0FBMEM7SUFDdEQsU0FBUyxFQUFFLFlBQVk7SUFDdkIsUUFBUSxFQUFFO01BQ1Isb0JBQW9CLENBQUM7UUFDbkIsVUFBVSxFQUFFLHVCQUF1QjtRQUNuQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sRUFBRTtVQUNQO1lBQ0Usb0JBQW9CLEVBQUUsYUFBYTtZQUNuQyxVQUFVLEVBQUU7Y0FDVixTQUFTLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM1QjtXQUNGO1VBQ0Q7WUFDRSxvQkFBb0IsRUFBRSxXQUFXO1lBQ2pDLFVBQVUsRUFBRTtjQUNWLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Y0FDL0IsS0FBSyxFQUFFLEVBQUU7YUFDVjtXQUNGO1NBQ0Y7T0FDRixDQUFDO01BQ0Ysb0JBQW9CLENBQUM7UUFDbkIsVUFBVSxFQUFFLHVCQUF1QjtRQUNuQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDckIsT0FBTyxFQUFFO1VBQ1A7WUFDRSxvQkFBb0IsRUFBRSxXQUFXO1lBQ2pDLFVBQVUsRUFBRTtjQUNWLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Y0FDL0IsS0FBSyxFQUFFLEVBQUU7YUFDVjtXQUNGO1NBQ0Y7T0FDRixDQUFDO0tBQ0g7R0FDRjtDQUNGLEVBQUM7O0FBRUYsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLEtBQUs7RUFDdEMsT0FBTyxFQUFFO0lBQ1AsVUFBVSxFQUFFLHlDQUF5QztJQUNyRCxTQUFTLEVBQUUsV0FBVztJQUN0QixRQUFRLEVBQUU7TUFDUjtRQUNFLFNBQVMsRUFBRSxNQUFNO09BQ2xCO0tBQ0Y7R0FDRjtDQUNGLENBQUM7O0FDL0hLLE1BQU0sYUFBYSxHQUFHLE1BQU07RUFDakMsTUFBTSxLQUFLLEdBQUcsR0FBRTtBQUNsQixBQVNBO0VBQ0UsT0FBTyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztDQUNqQzs7QUNYVyxNQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtFQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxFQUFDOztBQUUxQyxNQUFNLGVBQWUsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7O0FBRWpFLEFBQU8sTUFBTSxlQUFlLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxNQUFNO0VBQ2xELElBQUksRUFBRTtJQUNKLFdBQVcsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFO0lBQzVCLFlBQVksRUFBRSxPQUFPO0dBQ3RCO0VBQ0QsVUFBVSxFQUFFLG1CQUFtQjtFQUMvQixVQUFVLEVBQUUsWUFBWTtFQUN4QixPQUFPLEVBQUUsT0FBTztLQUNiLFdBQVcsQ0FBQyxLQUFLLENBQUM7S0FDbEIsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzlDLEdBQUcsQ0FBQyxNQUFNLENBQUM7RUFDZCxVQUFVLEVBQUU7SUFDVjtNQUNFLG9CQUFvQixFQUFFLFdBQVc7TUFDakMsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxLQUFLLEVBQUU7VUFDTCxXQUFXLEVBQUUsS0FBSztVQUNsQixZQUFZLEVBQUUsT0FBTztTQUN0QjtPQUNGO0tBQ0Y7R0FDRjtDQUNGLEVBQUM7O0FBRUYsQUFBTyxNQUFNLGlCQUFpQixHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sS0FBSztFQUNsRCxNQUFNLEdBQUcsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEtBQUssUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFJOztFQUUzRSxPQUFPLE1BQU07TUFDVCxDQUFDLEVBQUUsYUFBYSxDQUFDLEFBQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztNQUM5QyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7RUFDMUI7O0FBRUQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxNQUFNO0VBQ3RDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7RUFDOUIsUUFBUSxFQUFFLHFDQUFxQztFQUMvQyxLQUFLLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7Q0FDdkMsRUFBQzs7QUFFRixNQUFNLE1BQU0sR0FBRyxHQUFHLEtBQUs7RUFDckIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJO0VBQ2YsS0FBSyxFQUFFO0lBQ0wsV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJO0lBQ3JCLFlBQVksRUFBRSxTQUFTO0dBQ3hCO0NBQ0YsQ0FBQzs7QUNoRFUsTUFBQyx3QkFBd0IsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSztFQUN6RSxHQUFHLGVBQWUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7O0VBRXZELEdBQUcsZUFBZSxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQzs7RUFFN0QsR0FBRyxXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDOztFQUU3QyxHQUFHLE9BQU8sQ0FBQyxBQUE2QixDQUFDO0VBQzFDOztBQUVELE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxLQUFLO0VBQzlDLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDL0M7RUFDRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE1BQU07RUFDbEMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUM7RUFDL0MsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBQztFQUNsRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUM7RUFDcEMsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDO0VBQ2hCOztBQUVELEFBQU8sTUFBTSxlQUFlLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7RUFDbEQsT0FBTztLQUNKLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUM7S0FDdkMsR0FBRyxDQUFDLENBQUMsS0FBSztNQUNULE1BQU0sRUFBRSxDQUFDO01BQ1QsS0FBSyxFQUFFLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDdEMsQ0FBQyxDQUFDO0tBQ0YsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFDOztBQUV6QixBQUFPLE1BQU0scUJBQXFCLEdBQUcsTUFBTTtFQUN6QyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUM7O0FBRTFDLE1BQU0sU0FBUyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU07RUFDeEMsUUFBUSxFQUFFLHlDQUF5QztFQUNuRCxJQUFJLEVBQUUscUJBQXFCLENBQUMsTUFBTSxDQUFDO0VBQ25DLEtBQUssRUFBRTtJQUNMLFNBQVMsRUFBRSwwQkFBMEI7SUFDckMsUUFBUSxFQUFFO01BQ1I7UUFDRSxTQUFTLEVBQUU7VUFDVCxVQUFVLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7U0FDOUM7T0FDRjtNQUNEO1FBQ0UsU0FBUyxFQUFFO1VBQ1QsVUFBVSxFQUFFLGlCQUFpQixDQUFDLEtBQUssQ0FBQztTQUNyQztRQUNELFNBQVMsRUFBRSwwQkFBMEI7T0FDdEM7S0FDRjtJQUNELE1BQU0sRUFBRTtNQUNOO1FBQ0Usb0JBQW9CLEVBQUUsV0FBVztRQUNqQyxVQUFVLEVBQUU7VUFDVixJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1VBQy9CLEtBQUssRUFBRSxFQUFFO1NBQ1Y7T0FDRjtNQUNEO1FBQ0Usb0JBQW9CLEVBQUUsY0FBYztRQUNwQyxVQUFVLEVBQUU7VUFDVixTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRTtVQUMxQixRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRTtTQUMxQjtPQUNGO0tBQ0Y7R0FDRjtDQUNGLEVBQUM7O0FBRUYsTUFBTSxlQUFlLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTTtFQUM5QyxRQUFRLEVBQUUseUNBQXlDO0VBQ25ELElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztFQUN2QyxLQUFLLEVBQUU7SUFDTCxTQUFTLEVBQUUsdUJBQXVCO0lBQ2xDLFFBQVEsRUFBRTtNQUNSO1FBQ0UsU0FBUyxFQUFFO1VBQ1QsVUFBVSxFQUFFLHlDQUF5QztVQUNyRCxTQUFTLEVBQUUsZ0JBQWdCO1VBQzNCLFFBQVEsRUFBRTtZQUNSO2NBQ0UsU0FBUyxFQUFFO2dCQUNULFVBQVUsRUFBRSx1QkFBdUI7Z0JBQ25DLFdBQVcsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BDLE9BQU8sRUFBRTtrQkFDUDtvQkFDRSxvQkFBb0IsRUFBRSxnQkFBZ0I7b0JBQ3RDLFVBQVUsRUFBRTtzQkFDVixTQUFTLEVBQUUsTUFBTSxDQUFDLElBQUk7c0JBQ3RCLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7c0JBQzFDLGVBQWUsRUFBRSxNQUFNLENBQUMsSUFBSTtxQkFDN0I7bUJBQ0Y7a0JBQ0Q7b0JBQ0Usb0JBQW9CLEVBQUUsV0FBVztvQkFDakMsVUFBVSxFQUFFO3NCQUNWLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7c0JBQy9CLEtBQUssRUFBRSxNQUFNO3FCQUNkO21CQUNGO2lCQUNGO2VBQ0Y7YUFDRjtZQUNEO2NBQ0UsU0FBUyxFQUFFO2dCQUNULFVBQVUsRUFBRSx1QkFBdUI7Z0JBQ25DLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQztnQkFDdEIsT0FBTyxFQUFFO2tCQUNQO29CQUNFLG9CQUFvQixFQUFFLGNBQWM7b0JBQ3BDLFVBQVUsRUFBRTtzQkFDVixTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRTtzQkFDMUIsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7cUJBQzFCO21CQUNGO2lCQUNGO2VBQ0Y7YUFDRjtXQUNGO1NBQ0Y7T0FDRjtNQUNEO1FBQ0UsU0FBUyxFQUFFO1VBQ1QsVUFBVSxFQUFFLGtDQUFrQztVQUM5QyxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1VBQzVGLGFBQWEsRUFBRTtZQUNiLFVBQVUsRUFBRSx5Q0FBeUM7WUFDckQsU0FBUyxFQUFFLFdBQVc7WUFDdEIsUUFBUSxFQUFFO2NBQ1I7Z0JBQ0UsU0FBUyxFQUFFO2tCQUNULFVBQVUsRUFBRSx1QkFBdUI7a0JBQ25DLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7a0JBQ2xDLE9BQU8sRUFBRTtvQkFDUDtzQkFDRSxvQkFBb0IsRUFBRSxhQUFhO3NCQUNuQyxVQUFVLEVBQUU7d0JBQ1YsU0FBUyxFQUFFLE1BQU0sQ0FBQyxJQUFJO3dCQUN0QixTQUFTLEVBQUU7MEJBQ1QsV0FBVyxFQUFFLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzswQkFDeEMsVUFBVSxFQUFFLE9BQU87eUJBQ3BCO3VCQUNGO3FCQUNGO29CQUNEO3NCQUNFLG9CQUFvQixFQUFFLFdBQVc7c0JBQ2pDLFVBQVUsRUFBRTt3QkFDVixJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUMvQixLQUFLLEVBQUUsTUFBTTt1QkFDZDtxQkFDRjttQkFDRjtpQkFDRjtlQUNGO2NBQ0Q7Z0JBQ0UsU0FBUyxFQUFFO2tCQUNULFVBQVUsRUFBRSx1QkFBdUI7a0JBQ25DLFdBQVcsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7a0JBQ3BDLE9BQU8sRUFBRTtvQkFDUDtzQkFDRSxvQkFBb0IsRUFBRSxlQUFlO3NCQUNyQyxVQUFVLEVBQUU7d0JBQ1YsU0FBUyxFQUFFOzBCQUNULFdBQVcsRUFBRSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7MEJBQ3hDLFVBQVUsRUFBRSxPQUFPO3lCQUNwQjt1QkFDRjtxQkFDRjttQkFDRjtpQkFDRjtlQUNGO2FBQ0Y7V0FDRjtTQUNGO09BQ0Y7S0FDRjtHQUNGO0NBQ0YsQ0FBQzs7QUMvS0ssTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSztFQUNqRSxHQUFHLGVBQWUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0EsV0FBUyxDQUFDOztFQUV2RCxHQUFHLHdCQUF3QixDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQzs7RUFFMUQsR0FBRyxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDO0VBQ3hDOztBQUVELEFBQU8sTUFBTSx1QkFBdUIsR0FBRyxNQUFNO0VBQzNDLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBQzs7QUFFN0MsTUFBTUEsV0FBUyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTTtFQUNqQyxRQUFRLEVBQUUsa0NBQWtDO0VBQzVDLFdBQVcsRUFBRSxDQUFDLDJDQUEyQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUM7RUFDbEcsSUFBSSxFQUFFLHVCQUF1QixDQUFDLE1BQU0sQ0FBQztFQUNyQyxLQUFLLEVBQUU7SUFDTCxTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0MsYUFBYSxFQUFFO01BQ2IsVUFBVSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUM7S0FDN0I7SUFDRCxhQUFhLEVBQUU7TUFDYixVQUFVLEVBQUUscUJBQXFCLENBQUMsTUFBTSxDQUFDO0tBQzFDO0dBQ0Y7Q0FDRixDQUFDOztBQzFCVSxNQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSztFQUNwRDtJQUNFLElBQUksRUFBRSxrQkFBa0I7SUFDeEIsUUFBUSxFQUFFLG9DQUFvQztJQUM5QyxLQUFLLEVBQUU7TUFDTCxLQUFLLEVBQUUsZUFBZSxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztNQUN6RCxXQUFXLEVBQUUsWUFBWTtNQUN6QixTQUFTLEVBQUUsT0FBTztNQUNsQixJQUFJLEVBQUUsS0FBSztNQUNYLEtBQUssRUFBRSxJQUFJO01BQ1gsWUFBWSxFQUFFO1FBQ1osV0FBVyxFQUFFLGFBQWE7UUFDMUIsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxZQUFZLEVBQUUsT0FBTztPQUN0QjtNQUNELFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0dBQ0Y7RUFDRDtJQUNFLElBQUksRUFBRSxPQUFPO0lBQ2IsUUFBUSxFQUFFLHFDQUFxQztJQUMvQyxLQUFLLEVBQUUsRUFBRTtHQUNWO0VBQ0QsR0FBRyxnQkFBZ0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUM7RUFDbkQ7O0FBRUQsQUFBTyxNQUFNLE9BQU8sR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU07RUFDdEMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxjQUFjO0VBQzVCLFNBQVMsRUFBRTtJQUNULFVBQVUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNLENBQUM7R0FDNUM7Q0FDRixDQUFDOzs7OyJ9
