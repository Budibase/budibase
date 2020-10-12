export default function(tables) {
  return tables.map(table => {
    return {
      name: `${table.name} - List`,
      create: () => createScreen(table),
      id: ROW_LIST_TEMPLATE,
    }
  })
}

export const ROW_LIST_TEMPLATE = "ROW_LIST_TEMPLATE"

const createScreen = table => ({
  props: {
    _id: "",
    _component: "@budibase/standard-components/container",
    _styles: {
      normal: {},
      hover: {},
      active: {},
      selected: {},
    },
    type: "div",
    _children: [
      {
        _id: "",
        _component: "@budibase/standard-components/container",
        _styles: {
          normal: {
            display: "flex",
            "flex-direction": "row",
            "justify-content": "space-between",
            "align-items": "center",
          },
          hover: {},
          active: {},
          selected: {},
        },
        _code: "",
        className: "",
        onLoad: [],
        type: "div",
        _instanceName: "Header",
        _children: [
          {
            _id: "",
            _component: "@budibase/standard-components/heading",
            _styles: {
              normal: {},
              hover: {},
              active: {},
              selected: {},
            },
            _code: "",
            className: "",
            text: `${table.name} List`,
            type: "h1",
            _instanceName: "Heading 1",
            _children: [],
          },
          {
            _id: "",
            _component: "@budibase/standard-components/button",
            _styles: {
              normal: {},
              hover: {},
              active: {},
              selected: {},
            },
            _code: "",
            text: "Create New",
            className: "",
            disabled: false,
            onClick: [
              {
                parameters: {
                  url: `/${table.name}/new`,
                },
                "##eventHandlerType": "Navigate To",
              },
            ],
            _instanceName: "Create New Button",
            _children: [],
          },
        ],
      },
      {
        _id: "",
        _component: "@budibase/standard-components/datatable",
        _styles: {
          normal: {},
          hover: {},
          active: {},
          selected: {},
        },
        _code: "",
        datasource: {
          label: "Deals",
          name: `all_${table._id}`,
          tableId: table._id,
          isTable: true,
        },
        stripeColor: "",
        borderColor: "",
        backgroundColor: "",
        color: "",
        _instanceName: `${table.name} Table`,
        _children: [],
      },
    ],
    _instanceName: `${table.name} - List`,
    _code: "",
    className: "",
    onLoad: [],
  },
  route: `/${table.name.toLowerCase()}`,
  name: "",
})
