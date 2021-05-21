const { BUILTIN_ROLE_IDS } = require("@budibase/auth/roles")
const { BASE_LAYOUT_PROP_IDS } = require("./layouts")

exports.createHomeScreen = () => ({
  description: "",
  url: "",
  layoutId: BASE_LAYOUT_PROP_IDS.PRIVATE,
  props: {
    _id: "d834fea2-1b3e-4320-ab34-f9009f5ecc59",
    _component: "@budibase/standard-components/container",
    _styles: {
      normal: {
        flex: "1 1 auto",
        display: "flex",
        "flex-direction": "column",
        "justify-content": "flex-start",
        "align-items": "stretch",
      },
      hover: {},
      active: {},
      selected: {},
    },
    _transition: "fade",
    type: "div",
    _children: [
      {
        _id: "ef60083f-4a02-4df3-80f3-a0d3d16847e7",
        _component: "@budibase/standard-components/heading",
        _styles: {
          normal: {
            "text-align": "left",
          },
          hover: {},
          active: {},
          selected: {},
        },
        text: "Welcome to your Budibase App 👋",
        type: "h2",
        _instanceName: "Heading",
        _children: [],
      },
    ],
    _instanceName: "Home",
  },
  routing: {
    route: "/",
    roleId: BUILTIN_ROLE_IDS.BASIC,
  },
  name: "home-screen",
})
