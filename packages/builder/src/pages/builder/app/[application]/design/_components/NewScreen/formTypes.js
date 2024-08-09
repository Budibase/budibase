import formView from "./images/formView.svg"
import formUpdate from "./images/formUpdate.svg"
import formCreate from "./images/formCreate.svg"

const tableTypes = [
  {
    id: "create",
    img: {
      alt: "A form containing new data",
      src: formCreate,
    },
    title: "Create a new row",
    description: "For capturing and storing new data from your users",
  },
  {
    id: "update",
    img: {
      alt: "A form containing edited data",
      src: formUpdate,
    },
    title: "Update an existing row",
    description: "For viewing and updating existing data",
  },
  {
    id: "view",
    img: {
      alt: "A form containing read-only data",
      src: formView,
    },
    title: "View an existing row",
    description: "For a read only view of your data",
  },
]

export default tableTypes
