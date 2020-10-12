export default {
  name: `New Row (Empty)`,
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
    table: "",
  },
  route: "",
  name: "screen-id",
})
