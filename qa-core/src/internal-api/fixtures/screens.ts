import { generator } from "../../shared"
import { ScreenRequest } from "../../types"
const randomId = generator.guid()

export const generateScreen = (roleId: string): ScreenRequest => ({
  showNavigation: true,
  width: "Large",
  name: randomId,
  template: "createFromScratch",
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
    roleId: roleId,
    homeScreen: false,
  },
})
