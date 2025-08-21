import { Screen } from "./Screen"
import { capitalise } from "@/helpers"
import getValidRoute from "./getValidRoute"
import { Roles } from "@/constants/backend"
import { Screen as ScreenDoc } from "@budibase/types"

const blank = ({
  route,
  screens,
  workspaceAppId,
}: {
  route: string
  screens: ScreenDoc[]
  workspaceAppId: string
}) => {
  const validRoute = getValidRoute(screens, route, Roles.BASIC, workspaceAppId)

  const template = new Screen(workspaceAppId)
    .instanceName("Blank screen")
    .customProps({ layout: "grid" })
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

export default blank
