import inline from "./inline"
import modal from "./modal"
import sidePanel from "./sidePanel"
import newScreen from "./newScreen"

const createScreen = ({ tableOrView, type, permissions, screens }) => {
  if (type === "inline") {
    return inline({ tableOrView, permissions, screens })
  }
  if (type === "modal") {
    return modal({ tableOrView, permissions, screens })
  }

  if (type === "sidePanel") {
    return sidePanel({ tableOrView, permissions, screens })
  }

  if (type === "newScreen") {
    return newScreen({ tableOrView, permissions, screens })
  }

  throw new Error(`Unrecognized table type ${type}`)
}

export default createScreen
