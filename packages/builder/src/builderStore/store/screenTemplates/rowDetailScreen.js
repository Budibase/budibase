import urlSanitize from "./urlSanitize"
import { rowListUrl } from "./rowListScreen"

export default function(tables) {
  return tables.map(table => {
    const fields = Object.keys(table.schema)
    const heading = fields.length > 0 ? `{{ data.${fields[0]} }}` : "Detail"
    return {
      name: `${table.name} - Detail`,
      create: () => createScreen(table, heading),
      id: ROW_DETAIL_TEMPLATE,
    }
  })
}

export const ROW_DETAIL_TEMPLATE = "ROW_DETAIL_TEMPLATE"
export const editRowUrl = table => urlSanitize(`/${table.name}/:id`)

const createScreen = (table, heading) => ({
  props: {
    _id: "",
    _component: "@budibase/standard-components/rowdetail",
    _styles: {
      normal: {},
      hover: {},
      active: {},
      selected: {},
    },
    table: table._id,
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
        text: heading,
        type: "h1",
        _instanceName: "Heading 1",
        _children: [],
      },
      {
        _id: "",
        _component: "@budibase/standard-components/dataform",
        _styles: {
          normal: {},
          hover: {},
          active: {},
          selected: {},
        },
        _code: "",
        _instanceName: `${table.name} Form`,
        _children: [],
      },
      {
        _id: "",
        _component: "@budibase/standard-components/container",
        _styles: {
          normal: {
            display: "flex",
            "flex-direction": "row",
            "align-items": "center",
            "justify-content": "flex-end",
          },
          hover: {},
          active: {},
          selected: {},
        },
        _code: "",
        className: "",
        onLoad: [],
        type: "div",
        _instanceName: "Buttons Container",
        _children: [
          {
            _id: "",
            _component: "@budibase/standard-components/button",
            _styles: {
              normal: {
                "margin-right": "20px",
              },
              hover: {},
              active: {},
              selected: {},
            },
            _code: "",
            text: "Back",
            className: "",
            disabled: false,
            onClick: [
              {
                parameters: {
                  url: rowListUrl(table),
                },
                "##eventHandlerType": "Navigate To",
              },
            ],
            _instanceName: "Back Button",
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
            ],
            _instanceName: "Save Button",
            _children: [],
          },
        ],
      },
    ],
    _instanceName: `${table.name} - Detail`,
    _code: "",
  },
  route: editRowUrl(table),
  name: "",
})
