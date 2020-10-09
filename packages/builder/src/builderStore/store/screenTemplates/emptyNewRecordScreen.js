export default {
  name: `New Record (Empty)`,
  create: () => createScreen(),
}

const createScreen = () => ({
  props: {
    _id: "",
    _component: "@budibase/standard-components/newrow",
    _styles: {
      normal: {},
      hover: {},
      active: {},
      selected: {},
    },
    _children: [],
    _instanceName: "",
    model: "",
  },
  route: "",
  name: "screen-id",
})
