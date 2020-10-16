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
    _id: "c7365379815e4457dbe703a886c2da43b",
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
        _id: "cf51241fc063d4d87be032dd509fe0244",
        _component: "@budibase/standard-components/container",
        _styles: {
          normal: {
            background: "white",
            "border-radius": "0.5rem",
            "box-shadow": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            margin: "auto",
            "margin-top": "20px",
            "border-width": "2px",
            "border-color": "rgba(0, 0, 0, 0.1)",
            "border-style": "None",
            "padding-top": "48px",
            "padding-bottom": "48px",
            "padding-right": "48px",
            "padding-left": "48px",
            "margin-bottom": "20px",
          },
          hover: {},
          active: {},
          selected: {},
        },
        _code: "",
        className: "",
        onLoad: [],
        type: "div",
        _instanceId: "inst_app_8fb_631af42f9dc94da2b5c48dc6c5124610",
        _instanceName: "Container",
        _children: [
          {
            _id: "c73294c301fd145aabe9bbbbd96a150ac",
            _component: "@budibase/standard-components/container",
            _styles: {
              normal: {
                display: "flex",
                "flex-direction": "row",
                "justify-content": "space-between",
                "align-items": "center",
                "margin-bottom": "32px",
              },
              hover: {},
              active: {},
              selected: {},
            },
            _code: "",
            className: "",
            onLoad: [],
            type: "div",
            _instanceId: "inst_app_8fb_631af42f9dc94da2b5c48dc6c5124610",
            _instanceName: "Title Container",
            _children: [
              {
                _id: "c2b77901df95a4d1ca7204c58300bc94b",
                _component: "@budibase/standard-components/heading",
                _styles: {
                  normal: {
                    margin: "0px",
                    flex: "1 1 auto",
                    "text-transform": "capitalize",
                  },
                  hover: {},
                  active: {},
                  selected: {},
                },
                _code: "",
                className: "",
                text: table.name,
                type: "h3",
                _instanceName: "Title",
                _children: [],
              },
              {
                _id: "c12a82d77baf24ca9922ea0af7cd4f723",
                _component: "@budibase/standard-components/button",
                _styles: {
                  normal: {
                    background: "#000000",
                    "border-width": "0",
                    "border-style": "None",
                    color: "#fff",
                    "font-family": "Inter",
                    "font-weight": "500",
                    "font-size": "14px",
                  },
                  hover: {
                    background: "#4285f4",
                  },
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
                      url: `/${table.name.toLowerCase()}/new`,
                    },
                    "##eventHandlerType": "Navigate To",
                  },
                ],
                _instanceName: "New Button",
                _children: [],
              },
            ],
          },
          {
            _id: "ca686a2ed89c943e6bafb63fa66a3ead3",
            _component: "@budibase/standard-components/datagrid",
            _styles: {
              normal: {},
              hover: {},
              active: {},
              selected: {},
            },
            _code: "",
            datasource: {
              label: table.name,
              name: `all_${table._id}`,
              tableId: table._id,
              type: "table",
            },
            editable: false,
            theme: "alpine",
            height: "540",
            pagination: true,
            _instanceId: "inst_app_8fb_631af42f9dc94da2b5c48dc6c5124610",
            _instanceName: "Grid",
            _children: [],
            detailUrl: `${table.name.toLowerCase()}/:id`,
          },
        ],
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
