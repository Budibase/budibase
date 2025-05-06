import { PDFScreen } from "./Screen"
import { capitalise } from "@/helpers"
import getValidRoute from "./getValidRoute"
import { Roles } from "@/constants/backend"
import { Screen } from "@budibase/types"

const pdf = ({
  route,
  screens,
  projectAppId,
}: {
  route: string
  screens: Screen[]
  projectAppId: string
}) => {
  const validRoute = getValidRoute(screens, route, Roles.BASIC)

  const template = new PDFScreen(projectAppId)
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
