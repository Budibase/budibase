import { PDFScreen } from "./Screen"
import { capitalise } from "@/helpers"
import getValidRoute from "./getValidRoute"
import { Roles } from "@/constants/backend"

const pdf = ({ route, screens }) => {
  const validRoute = getValidRoute(screens, route, Roles.BASIC)

  const template = new PDFScreen().role(Roles.BASIC).route(validRoute).json()

  return [
    {
      data: template,
      navigationLinkLabel:
        validRoute === "/" ? null : capitalise(validRoute.split("/")[1]),
    },
  ]
}

export default pdf
