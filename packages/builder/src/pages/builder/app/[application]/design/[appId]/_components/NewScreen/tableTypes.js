import tableInline from "./images/tableInline.svg"
import tableSidePanel from "./images/tableSidePanel.svg"
import tableModal from "./images/tableModal.svg"
import tableNewScreen from "./images/tableNewScreen.svg"

const tableTypes = [
  {
    id: "inline",
    img: {
      alt: "A table of data",
      src: tableInline,
    },
    title: "Inline",
    description: "Manage data directly on your table",
  },
  {
    id: "sidePanel",
    img: {
      alt: "A side panel",
      src: tableSidePanel,
    },
    title: "Side panel",
    description: "Open row details in a side panel",
  },
  {
    id: "modal",
    img: {
      alt: "A modal",
      src: tableModal,
    },
    title: "Modal",
    description: "Open row details in a modal",
  },
  {
    id: "newScreen",
    img: {
      alt: "A new screen",
      src: tableNewScreen,
    },
    title: "New screen",
    description: "View row details on a separate screen",
  },
]

export default tableTypes
