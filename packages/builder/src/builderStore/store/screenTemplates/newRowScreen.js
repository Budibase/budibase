export default function(tables) {
  return tables.map(table => {
    return {
      name: `${table.name} - New`,
      create: () => createScreen(table),
      id: NEW_ROW_TEMPLATE,
    }
  })
}

export const NEW_ROW_TEMPLATE = "NEW_ROW_TEMPLATE"

const createScreen = table => ({
  props: {
    _id: "c683c4ca8ffc849c6bdd3b7d637fbbf3c",
    _component: "@budibase/standard-components/newrow",
    _styles: {
      normal: {},
      hover: {},
      active: {},
      selected: {},
    },
    table: table._id,
    _children: [
      {
        _id: "ccad6cc135c7947a7ba9c631f655d6e0f",
        _component: "@budibase/standard-components/container",
        _styles: {
          normal: {
            width: "700px",
            padding: "0px",
            background: "white",
            "border-radius": "0.5rem",
            "box-shadow": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            margin: "auto",
            "margin-top": "20px",
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
            _id: "c6e91622ba7984f468f70bf4bf5120246",
            _component: "@budibase/standard-components/container",
            _styles: {
              normal: {
                "font-size": "14px",
                color: "#757575",
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
            _instanceName: "Breadcrumbs",
            _children: [
              {
                _id: "caa33353c252c4931b2a51b48a559a7fc",
                _component: "@budibase/standard-components/link",
                _styles: {
                  normal: {
                    color: "#757575",
                    "text-transform": "capitalize",
                  },
                  hover: {
                    color: "#4285f4",
                  },
                  active: {},
                  selected: {},
                },
                _code: "",
                url: `/${table.name.toLowerCase()}`,
                openInNewTab: false,
                text: table.name,
                color: "",
                hoverColor: "",
                underline: false,
                fontSize: "",
                fontFamily: "initial",
                _instanceId: "inst_app_8fb_631af42f9dc94da2b5c48dc6c5124610",
                _instanceName: "Back Link",
                _children: [],
              },
              {
                _id: "c6e218170201040e7a74e2c8304fe1860",
                _component: "@budibase/standard-components/text",
                _styles: {
                  normal: {
                    "margin-right": "4px",
                    "margin-left": "4px",
                  },
                  hover: {},
                  active: {},
                  selected: {},
                },
                _code: "",
                text: ">",
                type: "none",
                _instanceId: "inst_app_8fb_631af42f9dc94da2b5c48dc6c5124610",
                _instanceName: "Arrow",
                _children: [],
              },
              {
                _id: "c799da1fa3a84442e947cc9199518f64c",
                _component: "@budibase/standard-components/text",
                _styles: {
                  normal: {
                    color: "#000000",
                  },
                  hover: {},
                  active: {},
                  selected: {},
                },
                _code: "",
                text: "New",
                type: "none",
                _instanceId: "inst_app_8fb_631af42f9dc94da2b5c48dc6c5124610",
                _instanceName: "Identifier",
                _children: [],
              },
            ],
          },
          {
            _id: "cbd1637cd1e274287a3c28ef0bf235d08",
            _component: "@budibase/standard-components/container",
            _styles: {
              normal: {
                display: "flex",
                "flex-direction": "row",
                "justify-content": "space-between",
                "align-items": "center",
                "margin-top": "32px",
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
                _id: "c98d3675d04114558bbf28661c5ccfb8e",
                _component: "@budibase/standard-components/heading",
                _styles: {
                  normal: {
                    margin: "0px",
                    "margin-bottom": "0px",
                    "margin-right": "0px",
                    "margin-top": "0px",
                    "margin-left": "0px",
                    flex: "1 1 auto",
                  },
                  hover: {},
                  active: {},
                  selected: {},
                },
                _code: "",
                className: "",
                text: "New Row",
                type: "h3",
                _instanceName: "Title",
                _children: [],
              },
              {
                _id: "cae402bd3c6a44618a8341bf7ab9ab086",
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
                    "margin-left": "16px",
                  },
                  hover: {
                    background: "#4285f4",
                  },
                  active: {},
                  selected: {},
                },
                _code: "",
                text: "Save",
                className: "",
                disabled: false,
                onClick: [
                  {
                    parameters: {
                      contextPath: "data",
                      tableId: table._id,
                    },
                    "##eventHandlerType": "Save Row",
                  },
                  {
                    parameters: {
                      url: `/${table.name.toLowerCase()}`,
                    },
                    "##eventHandlerType": "Navigate To",
                  },
                ],
                _instanceName: "Save Button",
                _children: [],
              },
            ],
          },
          {
            _id: "c5e6c98d7363640f9ad3a7d19c8c10f67",
            _component: "@budibase/standard-components/dataformwide",
            _styles: {
              normal: {},
              hover: {},
              active: {},
              selected: {},
            },
            _code: "",
            _instanceId: "inst_app_8fb_631af42f9dc94da2b5c48dc6c5124610",
            _instanceName: "Form",
            _children: [],
          },
        ],
      },
    ],
    _instanceName: `${table.name} - New`,
    _code: "",
  },
  route: `/${table.name.toLowerCase()}/new`,
  name: "",
})
