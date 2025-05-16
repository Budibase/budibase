import { SourceOption } from "@/pages/builder/app/[application]/design/_components/NewScreen/utils"
import { Screen, UIPermissions } from "@budibase/types"
import inline from "./inline"
import modal from "./modal"
import newScreen from "./newScreen"
import sidePanel from "./sidePanel"

const createScreen = async ({
  tableOrView,
  type,
  permissions,
  screens,
}: {
  tableOrView: SourceOption
  type: string
  permissions: UIPermissions
  screens: Screen[]
}) => {
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
