import generator from "../../generator"

const randomId = generator.guid()

const generateScreen = (): any => ({
  showNavigation: true,
  width: "Large",
  props: {
    _id: randomId,
    _component: "@budibase/standard-components/container",
    _styles: {
      normal: {},
      hover: {},
      active: {},
      selected: {},
    },
    _children: [],
    _instanceName: "New Screen",
    direction: "column",
    hAlign: "stretch",
    vAlign: "top",
    size: "grow",
    gap: "M",
  },
  routing: {
    route: "/test",
    roleId: "BASIC",
    homeScreen: false,
  },
  name: randomId,
  template: "createFromScratch",
})

export default generateScreen
