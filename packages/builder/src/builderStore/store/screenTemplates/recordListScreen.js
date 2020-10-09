export default function(models) {
  return models.map(model => {
    return {
      name: `Record List - ${model.name}`,
      create: () => createScreen(model),
      id: RECORD_LIST_TEMPLATE,
    }
  })
}

export const RECORD_LIST_TEMPLATE = "RECORD_LIST_TEMPLATE"

const createScreen = model => ({
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
            text: `${model.name} List`,
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
                  url: `/${model.name}/new`,
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
          name: `all_${model._id}`,
          modelId: model._id,
          isModel: true,
        },
        stripeColor: "",
        borderColor: "",
        backgroundColor: "",
        color: "",
        _instanceName: `${model.name} Table`,
        _children: [],
      },
    ],
    _instanceName: `${model.name} List`,
    _code: "",
    className: "",
    onLoad: [],
  },
  route: `/${model.name.toLowerCase()}`,
  name: "",
})
