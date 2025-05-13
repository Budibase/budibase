import { Screen } from "./Screen"
import { capitalise } from "@/helpers"
import getValidRoute from "./getValidRoute"
import { Roles } from "@/constants/backend"
import { Screen as ScreenDoc } from "@budibase/types"

const blank = ({ route, screens }: { route: string; screens: ScreenDoc[] }) => {
  const validRoute = getValidRoute(screens, route, Roles.BASIC)

  const template = new Screen()
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
