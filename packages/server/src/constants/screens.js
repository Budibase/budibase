const { BUILTIN_ROLE_IDS } = require("../utilities/security/roles")
const { BASE_LAYOUT_PROP_IDS } = require("./layouts")
const { LOGO_URL } = require("../constants")

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

exports.createLoginScreen = app => ({
  description: "",
  url: "",
  layoutId: BASE_LAYOUT_PROP_IDS.PUBLIC,
  props: {
    _instanceName: "LoginScreenContainer",
    _id: "5beb4c7b-3c8b-49b2-b8b3-d447dc76dda7",
    _component: "@budibase/standard-components/container",
    _styles: {
      normal: {
        flex: "1 1 auto",
        display: "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
      },
      hover: {},
      active: {},
      selected: {},
    },
    _transition: "fade",
    type: "div",
    _children: [
      {
        _id: "781e497e-2e7c-11eb-adc1-0242ac120002",
        _component: "@budibase/standard-components/login",
        _styles: {
          normal: {
            padding: "64px",
            background: "rgba(255, 255, 255, 0.4)",
            "border-radius": "0.5rem",
            "margin-top": "0px",
            "box-shadow":
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            "font-size": "16px",
            "font-family": "Inter",
            flex: "0 1 auto",
          },
          hover: {},
          active: {},
          selected: {},
        },
        logo: LOGO_URL,
        title: `Log in to ${app.name}`,
        buttonText: "Log In",
        _children: [],
        _instanceName: "Login",
      },
    ],
  },
  routing: {
    route: "/",
    roleId: BUILTIN_ROLE_IDS.PUBLIC,
  },
  name: "login-screen",
})
