import {
  navContentComponentName,
  selectNavContent,
} from "./selectedNavContentGenerator"
import { recordHomepages } from "./recordHomePageGenerator"
export const app = ({ records, indexes, helpers }) => [
  {
    name: "Application Root",
    inherits: "@budibase/bootstrap-components/nav",
    props: {
      items: recordHomepages({ indexes, records }).map(navItem),
      orientation: "horizontal",
      alignment: "start",
      fill: false,
      pills: true,
      selectedItem: {
        "##bbstate": "selectedNav",
        "##bbstatefallback": `${records[0].name}`,
        "##bbsource": "store",
      },
      className: "p-3",
    },
  },
  {
    name: "Login",
    inherits: "@budibase/standard-components/login",
    props: {},
  },
  ...selectNavContent({ records, indexes, helpers }),
]

export const navItem = ({ record }) => ({
  title: record.collectionName,
  component: {
    _component: navContentComponentName(record),
  },
})
