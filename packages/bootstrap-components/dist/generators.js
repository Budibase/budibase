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
    _component: "@budibase/standard-components/div",
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
});

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9ycy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2dlbmVyYXRvcnMvYnV0dG9uR2VuZXJhdG9ycy5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL2Zvcm1zR2VuZXJhdG9yLmpzIiwiLi4vc3JjL2dlbmVyYXRvcnMvZ2V0UmVjb3JkUGF0aC5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL2luZGV4VGFibGVzR2VuZXJhdG9yLmpzIiwiLi4vc3JjL2dlbmVyYXRvcnMvcmVjb3JkSG9tZVBhZ2VHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9zZWxlY3RlZE5hdkNvbnRlbnRHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9hcHBHZW5lcmF0b3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGJ1dHRvbnMgPSAoKSA9PiBbXG4gIHtcbiAgICBuYW1lOiBcImNvbW1vbi9QcmltYXJ5IEJ1dHRvblwiLFxuICAgIGRlc2NyaXB0aW9uOiBcIkJvb3RzdHJhcCBwcmltYXJ5IGJ1dHRvbiBcIixcbiAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9idXR0b25cIixcbiAgICBwcm9wczoge1xuICAgICAgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwiLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICBuYW1lOiBcImNvbW1vbi9EZWZhdWx0IEJ1dHRvblwiLFxuICAgIGRlc2NyaXB0aW9uOiBcIkJvb3RzdHJhcCBkZWZhdWx0IGJ1dHRvblwiLFxuICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2J1dHRvblwiLFxuICAgIHByb3BzOiB7XG4gICAgICBjbGFzc05hbWU6IFwiYnRuIGJ0bi1zZWNvbmRhcnlcIixcbiAgICB9LFxuICB9LFxuXVxuIiwiaW1wb3J0IHsgYnV0dG9ucyB9IGZyb20gXCIuL2J1dHRvbkdlbmVyYXRvcnNcIlxuXG5leHBvcnQgY29uc3QgZm9ybXMgPSAoeyByZWNvcmRzLCBpbmRleGVzLCBoZWxwZXJzIH0pID0+IFtcbiAgLi4ucmVjb3Jkcy5tYXAocm9vdCksXG4gIC4uLmJ1dHRvbnMoeyByZWNvcmRzLCBpbmRleGVzLCBoZWxwZXJzIH0pLFxuXVxuXG5leHBvcnQgY29uc3QgZm9ybU5hbWUgPSByZWNvcmQgPT4gYCR7cmVjb3JkLm5hbWV9LyR7cmVjb3JkLm5hbWV9IEZvcm1gXG5cbmNvbnN0IHJvb3QgPSByZWNvcmQgPT4gKHtcbiAgbmFtZTogZm9ybU5hbWUocmVjb3JkKSxcbiAgZGVzY3JpcHRpb246IGBDb250cm9sIGZvciBjcmVhdGluZy91cGRhdGluZyAnJHtyZWNvcmQubm9kZUtleSgpfScgYCxcbiAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvZGl2XCIsXG4gIHByb3BzOiB7XG4gICAgY2xhc3NOYW1lOiBcInAtMVwiLFxuICAgIGNoaWxkcmVuOiBbXG4gICAgICB7XG4gICAgICAgIGNvbXBvbmVudDoge1xuICAgICAgICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvaDNcIixcbiAgICAgICAgICB0ZXh0OiBgRWRpdCAke3JlY29yZC5uYW1lfWAsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZm9ybShyZWNvcmQpLFxuICAgICAgc2F2ZUNhbmNlbEJ1dHRvbnMocmVjb3JkKSxcbiAgICBdLFxuICB9LFxufSlcblxuY29uc3QgZm9ybSA9IHJlY29yZCA9PiAoe1xuICBjb21wb25lbnQ6IHtcbiAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2Zvcm1cIixcbiAgICBmb3JtQ29udHJvbHM6IHJlY29yZC5maWVsZHMubWFwKGYgPT4gZm9ybUNvbnRyb2wocmVjb3JkLCBmKSksXG4gIH0sXG59KVxuXG5jb25zdCBmb3JtQ29udHJvbCA9IChyZWNvcmQsIGZpZWxkKSA9PiB7XG4gIGlmIChcbiAgICBmaWVsZC50eXBlID09PSBcInN0cmluZ1wiICYmXG4gICAgZmllbGQudHlwZU9wdGlvbnMudmFsdWVzICYmXG4gICAgZmllbGQudHlwZU9wdGlvbnMudmFsdWVzLmxlbmd0aCA+IDBcbiAgKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRyb2w6IHtcbiAgICAgICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9zZWxlY3RcIixcbiAgICAgICAgb3B0aW9uczogZmllbGQudHlwZU9wdGlvbnMudmFsdWVzLm1hcCh2ID0+ICh7IGlkOiB2LCB2YWx1ZTogdiB9KSksXG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgXCIjI2Jic3RhdGVcIjogYCR7cmVjb3JkLm5hbWV9LiR7ZmllbGQubmFtZX1gLFxuICAgICAgICAgIFwiIyNiYnNvdXJjZVwiOiBcInN0b3JlXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIixcbiAgICAgIH0sXG4gICAgICBsYWJlbDogZmllbGQubGFiZWwsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBjb250cm9sOiB7XG4gICAgICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvaW5wdXRcIixcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBcIiMjYmJzdGF0ZVwiOiBgJHtyZWNvcmQubmFtZX0uJHtmaWVsZC5uYW1lfWAsXG4gICAgICAgICAgXCIjI2Jic291cmNlXCI6IFwic3RvcmVcIixcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiLFxuICAgICAgICB0eXBlOlxuICAgICAgICAgIGZpZWxkLnR5cGUgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgID8gXCJ0ZXh0XCJcbiAgICAgICAgICAgIDogZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiXG4gICAgICAgICAgICA/IFwiZGF0ZVwiXG4gICAgICAgICAgICA6IGZpZWxkLnR5cGUgPT09IFwibnVtYmVyXCJcbiAgICAgICAgICAgID8gXCJudW1iZXJcIlxuICAgICAgICAgICAgOiBcInRleHRcIixcbiAgICAgIH0sXG4gICAgICBsYWJlbDogZmllbGQubGFiZWwsXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IHNhdmVDYW5jZWxCdXR0b25zID0gcmVjb3JkID0+ICh7XG4gIGNvbXBvbmVudDoge1xuICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvc3RhY2twYW5lbFwiLFxuICAgIGRpcmVjdGlvbjogXCJob3Jpem9udGFsXCIsXG4gICAgY2hpbGRyZW46IFtcbiAgICAgIHBhZGRlZFBhbmVsRm9yQnV0dG9uKHtcbiAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vUHJpbWFyeSBCdXR0b25cIixcbiAgICAgICAgY29udGVudFRleHQ6IGBTYXZlICR7cmVjb3JkLm5hbWV9YCxcbiAgICAgICAgb25DbGljazogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2F2ZSBSZWNvcmRcIixcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgc3RhdGVQYXRoOiBgJHtyZWNvcmQubmFtZX1gLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2V0IFN0YXRlXCIsXG4gICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgIHBhdGg6IGBpc0VkaXRpbmcke3JlY29yZC5uYW1lfWAsXG4gICAgICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgICBwYWRkZWRQYW5lbEZvckJ1dHRvbih7XG4gICAgICAgIF9jb21wb25lbnQ6IFwiY29tbW9uL0RlZmF1bHQgQnV0dG9uXCIsXG4gICAgICAgIGNvbnRlbnRUZXh0OiBgQ2FuY2VsYCxcbiAgICAgICAgb25DbGljazogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2V0IFN0YXRlXCIsXG4gICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgIHBhdGg6IGBpc0VkaXRpbmcke3JlY29yZC5uYW1lfWAsXG4gICAgICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgXSxcbiAgfSxcbn0pXG5cbmNvbnN0IHBhZGRlZFBhbmVsRm9yQnV0dG9uID0gYnV0dG9uID0+ICh7XG4gIGNvbnRyb2w6IHtcbiAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2RpdlwiLFxuICAgIGNsYXNzTmFtZTogXCJidG4tZ3JvdXBcIixcbiAgICBjaGlsZHJlbjogW1xuICAgICAge1xuICAgICAgICBjb21wb25lbnQ6IGJ1dHRvbixcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbn0pXG4iLCJleHBvcnQgY29uc3QgZ2V0UmVjb3JkUGF0aCA9ICgpID0+IHtcbiAgY29uc3QgcGFydHMgPSBbXVxuXG4gIGNvbnN0IGFkZCA9IGN1cnJlbnQgPT4ge1xuICAgIHBhcnRzLnB1c2goY3VycmVudC5uYW1lKVxuICAgIGlmIChjdXJyZW50LnBhcmVudCgpLnR5cGUgPT09IFwicm9vdFwiKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBhZGQoY3VycmVudC5wYXJlbnQoKSlcbiAgfVxuXG4gIHJldHVybiBwYXJ0cy5yZXZlcnNlKCkuam9pbihcIi9cIilcbn1cbiIsImltcG9ydCB7IGdldFJlY29yZFBhdGggfSBmcm9tIFwiLi9nZXRSZWNvcmRQYXRoXCJcblxuZXhwb3J0IGNvbnN0IGluZGV4VGFibGVzID0gKHsgaW5kZXhlcywgaGVscGVycyB9KSA9PlxuICBpbmRleGVzLm1hcChpID0+IGluZGV4VGFibGUoaSwgaGVscGVycykpXG5cbmNvbnN0IGV4Y2x1ZGVkQ29sdW1ucyA9IFtcImlkXCIsIFwiaXNOZXdcIiwgXCJrZXlcIiwgXCJ0eXBlXCIsIFwic29ydEtleVwiXVxuXG5leHBvcnQgY29uc3QgaW5kZXhUYWJsZVByb3BzID0gKGluZGV4LCBoZWxwZXJzKSA9PiAoe1xuICBkYXRhOiB7XG4gICAgXCIjI2Jic3RhdGVcIjogaW5kZXgubm9kZUtleSgpLFxuICAgIFwiIyNiYnNvdXJjZVwiOiBcInN0b3JlXCIsXG4gIH0sXG4gIHRhYmxlQ2xhc3M6IFwidGFibGUgdGFibGUtaG92ZXJcIixcbiAgdGhlYWRDbGFzczogXCJ0aGVhZC1kYXJrXCIsXG4gIGNvbHVtbnM6IGhlbHBlcnNcbiAgICAuaW5kZXhTY2hlbWEoaW5kZXgpXG4gICAgLmZpbHRlcihjID0+ICFleGNsdWRlZENvbHVtbnMuaW5jbHVkZXMoYy5uYW1lKSlcbiAgICAubWFwKGNvbHVtbiksXG4gIG9uUm93Q2xpY2s6IFtcbiAgICB7XG4gICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIlNldCBTdGF0ZVwiLFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBwYXRoOiBgc2VsZWN0ZWRyb3dfJHtpbmRleC5uYW1lfWAsXG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgXCIjI2Jic3RhdGVcIjogXCJrZXlcIixcbiAgICAgICAgICBcIiMjYmJzb3VyY2VcIjogXCJldmVudFwiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICBdLFxufSlcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4VGFibGVOYW1lID0gKGluZGV4LCByZWNvcmQpID0+IHtcbiAgcmVjb3JkID0gcmVjb3JkIHx8IGluZGV4LnBhcmVudCgpLnR5cGUgPT09IFwicmVjb3JkXCIgPyBpbmRleC5wYXJlbnQoKSA6IG51bGxcblxuICByZXR1cm4gcmVjb3JkXG4gICAgPyBgJHtnZXRSZWNvcmRQYXRoKHJlY29yZCl9LyR7aW5kZXgubmFtZX0gVGFibGVgXG4gICAgOiBgJHtpbmRleC5uYW1lfSBUYWJsZWBcbn1cblxuY29uc3QgaW5kZXhUYWJsZSA9IChpbmRleCwgaGVscGVycykgPT4gKHtcbiAgbmFtZTogZ2V0SW5kZXhUYWJsZU5hbWUoaW5kZXgpLFxuICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy90YWJsZVwiLFxuICBwcm9wczogaW5kZXhUYWJsZVByb3BzKGluZGV4LCBoZWxwZXJzKSxcbn0pXG5cbmNvbnN0IGNvbHVtbiA9IGNvbCA9PiAoe1xuICB0aXRsZTogY29sLm5hbWUsXG4gIHZhbHVlOiB7XG4gICAgXCIjI2Jic3RhdGVcIjogY29sLm5hbWUsXG4gICAgXCIjI2Jic291cmNlXCI6IFwiY29udGV4dFwiLFxuICB9LFxufSlcbiIsImltcG9ydCB7IGdldEluZGV4VGFibGVOYW1lLCBpbmRleFRhYmxlcyB9IGZyb20gXCIuL2luZGV4VGFibGVzR2VuZXJhdG9yXCJcblxuaW1wb3J0IHsgYnV0dG9ucyB9IGZyb20gXCIuL2J1dHRvbkdlbmVyYXRvcnNcIlxuXG5leHBvcnQgY29uc3QgcmVjb3JkSG9tZVBhZ2VDb21wb25lbnRzID0gKHsgaW5kZXhlcywgcmVjb3JkcywgaGVscGVycyB9KSA9PiBbXG4gIC4uLnJlY29yZEhvbWVwYWdlcyh7IGluZGV4ZXMsIHJlY29yZHMgfSkubWFwKGNvbXBvbmVudCksXG5cbiAgLi4ucmVjb3JkSG9tZXBhZ2VzKHsgaW5kZXhlcywgcmVjb3JkcyB9KS5tYXAoaG9tZVBhZ2VCdXR0b25zKSxcblxuICAuLi5pbmRleFRhYmxlcyh7IGluZGV4ZXMsIHJlY29yZHMsIGhlbHBlcnMgfSksXG5cbiAgLi4uYnV0dG9ucyh7IGluZGV4ZXMsIGJ1dHRvbnMsIGhlbHBlcnMgfSksXG5dXG5cbmNvbnN0IGZpbmRJbmRleEZvclJlY29yZCA9IChpbmRleGVzLCByZWNvcmQpID0+IHtcbiAgY29uc3QgZm9yUmVjb3JkID0gaW5kZXhlcy5maWx0ZXIoaSA9PlxuICAgIGkuYWxsb3dlZFJlY29yZE5vZGVJZHMuaW5jbHVkZXMocmVjb3JkLm5vZGVJZClcbiAgKVxuICBpZiAoZm9yUmVjb3JkLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG4gIGlmIChmb3JSZWNvcmQubGVuZ3RoID09PSAxKSByZXR1cm4gZm9yUmVjb3JkWzBdXG4gIGNvbnN0IG5vTWFwID0gZm9yUmVjb3JkLmZpbHRlcihpID0+ICFpLmZpbHRlciB8fCAhaS5maWx0ZXIudHJpbSgpKVxuICBpZiAobm9NYXAubGVuZ3RoID09PSAwKSBmb3JSZWNvcmRbMF1cbiAgcmV0dXJuIG5vTWFwWzBdXG59XG5cbmV4cG9ydCBjb25zdCByZWNvcmRIb21lcGFnZXMgPSAoeyBpbmRleGVzLCByZWNvcmRzIH0pID0+XG4gIHJlY29yZHNcbiAgICAuZmlsdGVyKHIgPT4gci5wYXJlbnQoKS50eXBlID09PSBcInJvb3RcIilcbiAgICAubWFwKHIgPT4gKHtcbiAgICAgIHJlY29yZDogcixcbiAgICAgIGluZGV4OiBmaW5kSW5kZXhGb3JSZWNvcmQoaW5kZXhlcywgciksXG4gICAgfSkpXG4gICAgLmZpbHRlcihyID0+IHIuaW5kZXgpXG5cbmV4cG9ydCBjb25zdCBob21lcGFnZUNvbXBvbmVudE5hbWUgPSByZWNvcmQgPT5cbiAgYCR7cmVjb3JkLm5hbWV9LyR7cmVjb3JkLm5hbWV9IGhvbWVwYWdlYFxuXG5jb25zdCBjb21wb25lbnQgPSAoeyByZWNvcmQsIGluZGV4IH0pID0+ICh7XG4gIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2RpdlwiLFxuICBuYW1lOiBob21lcGFnZUNvbXBvbmVudE5hbWUocmVjb3JkKSxcbiAgcHJvcHM6IHtcbiAgICBjbGFzc05hbWU6IFwiZC1mbGV4IGZsZXgtY29sdW1uIGgtMTAwXCIsXG4gICAgY2hpbGRyZW46IFtcbiAgICAgIHtcbiAgICAgICAgY29tcG9uZW50OiB7XG4gICAgICAgICAgX2NvbXBvbmVudDogYCR7cmVjb3JkLm5hbWV9L2hvbWVwYWdlIGJ1dHRvbnNgLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29tcG9uZW50OiB7XG4gICAgICAgICAgX2NvbXBvbmVudDogZ2V0SW5kZXhUYWJsZU5hbWUoaW5kZXgpLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWU6IFwiZmxleC1nb3ctMSBvdmVyZmxvdy1hdXRvXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgb25Mb2FkOiBbXG4gICAgICB7XG4gICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2V0IFN0YXRlXCIsXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBwYXRoOiBgaXNFZGl0aW5nJHtyZWNvcmQubmFtZX1gLFxuICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJMaXN0IFJlY29yZHNcIixcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIHN0YXRlUGF0aDogaW5kZXgubm9kZUtleSgpLFxuICAgICAgICAgIGluZGV4S2V5OiBpbmRleC5ub2RlS2V5KCksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG59KVxuXG5jb25zdCBob21lUGFnZUJ1dHRvbnMgPSAoeyBpbmRleCwgcmVjb3JkIH0pID0+ICh7XG4gIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2RpdlwiLFxuICBuYW1lOiBgJHtyZWNvcmQubmFtZX0vaG9tZXBhZ2UgYnV0dG9uc2AsXG4gIHByb3BzOiB7XG4gICAgY2xhc3NOYW1lOiBcImJ0bi10b29sYmFyIG10LTQgbWItMlwiLFxuICAgIGNoaWxkcmVuOiBbXG4gICAgICB7XG4gICAgICAgIGNvbXBvbmVudDoge1xuICAgICAgICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvZGl2XCIsXG4gICAgICAgICAgY2xhc3NOYW1lOiBcImJ0bi1ncm91cCBtci0zXCIsXG4gICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY29tcG9uZW50OiB7XG4gICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vRGVmYXVsdCBCdXR0b25cIixcbiAgICAgICAgICAgICAgICBjb250ZW50VGV4dDogYENyZWF0ZSAke3JlY29yZC5uYW1lfWAsXG4gICAgICAgICAgICAgICAgb25DbGljazogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIkdldCBOZXcgUmVjb3JkXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVBhdGg6IHJlY29yZC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25LZXk6IGAvJHtyZWNvcmQuY29sbGVjdGlvbk5hbWV9YCxcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZFJlY29yZFR5cGU6IHJlY29yZC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJTZXQgU3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGBpc0VkaXRpbmcke3JlY29yZC5uYW1lfWAsXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY29tcG9uZW50OiB7XG4gICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vRGVmYXVsdCBCdXR0b25cIixcbiAgICAgICAgICAgICAgICBjb250ZW50VGV4dDogYFJlZnJlc2hgLFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJMaXN0IFJlY29yZHNcIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgIHN0YXRlUGF0aDogaW5kZXgubm9kZUtleSgpLFxuICAgICAgICAgICAgICAgICAgICAgIGluZGV4S2V5OiBpbmRleC5ub2RlS2V5KCksXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb21wb25lbnQ6IHtcbiAgICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2lmXCIsXG4gICAgICAgICAgY29uZGl0aW9uOiBgJHN0b3JlLnNlbGVjdGVkcm93XyR7aW5kZXgubmFtZX0gJiYgJHN0b3JlLnNlbGVjdGVkcm93XyR7aW5kZXgubmFtZX0ubGVuZ3RoID4gMGAsXG4gICAgICAgICAgdGhlbkNvbXBvbmVudDoge1xuICAgICAgICAgICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9kaXZcIixcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJidG4tZ3JvdXBcIixcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHtcbiAgICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiY29tbW9uL0RlZmF1bHQgQnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICBjb250ZW50VGV4dDogYEVkaXQgJHtyZWNvcmQubmFtZX1gLFxuICAgICAgICAgICAgICAgICAgb25DbGljazogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJMb2FkIFJlY29yZFwiLFxuICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlUGF0aDogcmVjb3JkLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRLZXk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjI2Jic3RhdGVcIjogYHNlbGVjdGVkcm93XyR7aW5kZXgubmFtZX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIiMjc291cmNlXCI6IFwic3RvcmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2V0IFN0YXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYGlzRWRpdGluZyR7cmVjb3JkLm5hbWV9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInRydWVcIixcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiB7XG4gICAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcImNvbW1vbi9EZWZhdWx0IEJ1dHRvblwiLFxuICAgICAgICAgICAgICAgICAgY29udGVudFRleHQ6IGBEZWxldGUgJHtyZWNvcmQubmFtZX1gLFxuICAgICAgICAgICAgICAgICAgb25DbGljazogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJEZWxldGUgUmVjb3JkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkS2V5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiIyNiYnN0YXRlXCI6IGBzZWxlY3RlZHJvd18ke2luZGV4Lm5hbWV9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjI3NvdXJjZVwiOiBcInN0b3JlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG59KVxuIiwiaW1wb3J0IHtcbiAgcmVjb3JkSG9tZXBhZ2VzLFxuICBob21lcGFnZUNvbXBvbmVudE5hbWUsXG4gIHJlY29yZEhvbWVQYWdlQ29tcG9uZW50cyxcbn0gZnJvbSBcIi4vcmVjb3JkSG9tZVBhZ2VHZW5lcmF0b3JcIlxuaW1wb3J0IHsgZm9ybU5hbWUsIGZvcm1zIH0gZnJvbSBcIi4vZm9ybXNHZW5lcmF0b3JcIlxuXG5leHBvcnQgY29uc3Qgc2VsZWN0TmF2Q29udGVudCA9ICh7IGluZGV4ZXMsIHJlY29yZHMsIGhlbHBlcnMgfSkgPT4gW1xuICAuLi5yZWNvcmRIb21lcGFnZXMoeyBpbmRleGVzLCByZWNvcmRzIH0pLm1hcChjb21wb25lbnQpLFxuXG4gIC4uLnJlY29yZEhvbWVQYWdlQ29tcG9uZW50cyh7IGluZGV4ZXMsIHJlY29yZHMsIGhlbHBlcnMgfSksXG5cbiAgLi4uZm9ybXMoeyBpbmRleGVzLCByZWNvcmRzLCBoZWxwZXJzIH0pLFxuXVxuXG5leHBvcnQgY29uc3QgbmF2Q29udGVudENvbXBvbmVudE5hbWUgPSByZWNvcmQgPT5cbiAgYCR7cmVjb3JkLm5hbWV9LyR7cmVjb3JkLm5hbWV9IE5hdiBDb250ZW50YFxuXG5jb25zdCBjb21wb25lbnQgPSAoeyByZWNvcmQgfSkgPT4gKHtcbiAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvaWZcIixcbiAgZGVzY3JpcHRpb246IGB0aGUgY29tcG9uZW50IHRoYXQgZ2V0cyBkaXNwbGF5ZWQgd2hlbiB0aGUgJHtyZWNvcmQuY29sbGVjdGlvbk5hbWV9IG5hdiBpcyBzZWxlY3RlZGAsXG4gIG5hbWU6IG5hdkNvbnRlbnRDb21wb25lbnROYW1lKHJlY29yZCksXG4gIHByb3BzOiB7XG4gICAgY29uZGl0aW9uOiBgJHN0b3JlLmlzRWRpdGluZyR7cmVjb3JkLm5hbWV9YCxcbiAgICB0aGVuQ29tcG9uZW50OiB7XG4gICAgICBfY29tcG9uZW50OiBmb3JtTmFtZShyZWNvcmQpLFxuICAgIH0sXG4gICAgZWxzZUNvbXBvbmVudDoge1xuICAgICAgX2NvbXBvbmVudDogaG9tZXBhZ2VDb21wb25lbnROYW1lKHJlY29yZCksXG4gICAgfSxcbiAgfSxcbn0pXG4iLCJpbXBvcnQge1xuICBuYXZDb250ZW50Q29tcG9uZW50TmFtZSxcbiAgc2VsZWN0TmF2Q29udGVudCxcbn0gZnJvbSBcIi4vc2VsZWN0ZWROYXZDb250ZW50R2VuZXJhdG9yXCJcbmltcG9ydCB7IHJlY29yZEhvbWVwYWdlcyB9IGZyb20gXCIuL3JlY29yZEhvbWVQYWdlR2VuZXJhdG9yXCJcbmV4cG9ydCBjb25zdCBhcHAgPSAoeyByZWNvcmRzLCBpbmRleGVzLCBoZWxwZXJzIH0pID0+IFtcbiAge1xuICAgIG5hbWU6IFwiQXBwbGljYXRpb24gUm9vdFwiLFxuICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9ib290c3RyYXAtY29tcG9uZW50cy9uYXZcIixcbiAgICBwcm9wczoge1xuICAgICAgaXRlbXM6IHJlY29yZEhvbWVwYWdlcyh7IGluZGV4ZXMsIHJlY29yZHMgfSkubWFwKG5hdkl0ZW0pLFxuICAgICAgb3JpZW50YXRpb246IFwiaG9yaXpvbnRhbFwiLFxuICAgICAgYWxpZ25tZW50OiBcInN0YXJ0XCIsXG4gICAgICBmaWxsOiBmYWxzZSxcbiAgICAgIHBpbGxzOiB0cnVlLFxuICAgICAgc2VsZWN0ZWRJdGVtOiB7XG4gICAgICAgIFwiIyNiYnN0YXRlXCI6IFwic2VsZWN0ZWROYXZcIixcbiAgICAgICAgXCIjI2Jic3RhdGVmYWxsYmFja1wiOiBgJHtyZWNvcmRzWzBdLm5hbWV9YCxcbiAgICAgICAgXCIjI2Jic291cmNlXCI6IFwic3RvcmVcIixcbiAgICAgIH0sXG4gICAgICBjbGFzc05hbWU6IFwicC0zXCIsXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIG5hbWU6IFwiTG9naW5cIixcbiAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9sb2dpblwiLFxuICAgIHByb3BzOiB7fSxcbiAgfSxcbiAgLi4uc2VsZWN0TmF2Q29udGVudCh7IHJlY29yZHMsIGluZGV4ZXMsIGhlbHBlcnMgfSksXG5dXG5cbmV4cG9ydCBjb25zdCBuYXZJdGVtID0gKHsgcmVjb3JkIH0pID0+ICh7XG4gIHRpdGxlOiByZWNvcmQuY29sbGVjdGlvbk5hbWUsXG4gIGNvbXBvbmVudDoge1xuICAgIF9jb21wb25lbnQ6IG5hdkNvbnRlbnRDb21wb25lbnROYW1lKHJlY29yZCksXG4gIH0sXG59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
