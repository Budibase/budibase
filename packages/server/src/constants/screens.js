const { BUILTIN_ROLE_IDS } = require("../utilities/security/roles")
const { BASE_LAYOUT_PROP_IDS } = require("./layouts")

exports.createHomeScreen = app => ({
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
    _code: "",
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
        _code: "",
        text: "Welcome to your Budibase App 👋",
        type: "h2",
        _instanceName: "Heading",
        _children: [],
      },
      {
        _id: "cbbf41b27c2b44d1abba38bb694880c6a",
        _component: "@budibase/standard-components/container",
        _styles: {
          normal: {
            display: "flex",
            "flex-direction": "column",
            "justify-content": "center",
            "align-items": "stretch",
            flex: "1 1 auto",
            "border-width": "4px",
            "border-style": "Dashed",
            "margin-bottom": "32px",
          },
          hover: {},
          active: {},
          selected: {},
        },
        _code: "",
        type: "div",
        _instanceName: "Video Container",
        _children: [
          {
            _id: "c07d752cb3e544b418088fa9be84ba2e4",
            _component: "@budibase/standard-components/embed",
            _styles: {
              normal: {
                width: "100%",
                flex: "1 1 auto",
                opacity: "0",
                "transition-property": "Opacity",
                "transition-duration": "1s",
                "transition-timing-function:": "ease-in",
              },
              hover: {
                "transition-property": "Opacity",
                "transition-duration": "1s",
                "transition-timing-function:": "ease-out",
                opacity: "1",
              },
              active: {},
              selected: {},
            },
            _code: "",
            embed:
              '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
            _instanceName: "Rick Astley Video",
            _children: [],
          },
        ],
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
    _code: "",
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
        _code: "",
        logo:
          "https://d33wubrfki0l68.cloudfront.net/aac32159d7207b5085e74a7ef67afbb7027786c5/2b1fd/img/logo/bb-emblem.svg",
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
