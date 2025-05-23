import { PDFScreen } from "./Screen"
import { capitalise } from "@/helpers"
import getValidRoute from "./getValidRoute"
import { Roles } from "@/constants/backend"
import { Screen } from "@budibase/types"

const pdf = ({
  route,
  screens,
  workspaceAppId,
}: {
  route: string
  screens: Screen[]
  workspaceAppId: string | undefined
}) => {
  const validRoute = getValidRoute(screens, route, Roles.BASIC)

  const template = new PDFScreen(workspaceAppId)
    .role(Roles.BASIC)
    .route(validRoute)
    .json()

  return [
    {
      data: template,
      navigationLinkLabel:
        validRoute === "/" ? null : capitalise(validRoute.split("/")[1]),
    },
  ]
}

export default pdf
