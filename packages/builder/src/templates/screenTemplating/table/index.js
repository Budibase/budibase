import inline from "./inline"
import modal from "./modal"
import sidePanel from "./sidePanel"
import newScreen from "./newScreen"

const createScreen = async ({ tableOrView, type, permissions, screens }) => {
  if (type === "inline") {
    return await inline({ tableOrView, permissions, screens })
  }
  if (type === "modal") {
    return await modal({ tableOrView, permissions, screens })
  }

  if (type === "sidePanel") {
    return await sidePanel({ tableOrView, permissions, screens })
  }

  if (type === "newScreen") {
    return await newScreen({ tableOrView, permissions, screens })
  }

  throw new Error(`Unrecognized table type ${type}`)
}

export default createScreen
