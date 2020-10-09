export default {
  name: `Record Detail (Empty)`,
  create: () => createScreen(),
}

const createScreen = () => ({
  props: {
    _id: "",
    _component: "@budibase/standard-components/rowdetail",
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
