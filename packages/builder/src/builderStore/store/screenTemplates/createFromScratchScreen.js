export default {
  name: `Create from scratch`,
  create: () => createScreen(),
}

const createScreen = () => ({
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
    _children: [],
    _instanceName: "",
  },
  route: "",
  name: "screen-id",
})
