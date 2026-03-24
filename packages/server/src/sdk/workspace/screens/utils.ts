import { Screen } from "@budibase/types"
import sdk from "../.."

export async function ensureHomepageUniqueness(screen: Screen) {
  const allScreens = await sdk.screens.fetch()
  const otherScreens = allScreens.filter(
    s => s._id !== screen._id && s.workspaceAppId === screen.workspaceAppId
  )

  const toModify = otherScreens.filter(
    s => s.routing.homeScreen && s.routing.roleId === screen.routing.roleId
  )
  if (!toModify.length) {
    return []
  }

  const updatedScreens: Screen[] = []
  for (const screen of toModify) {
    screen.routing.homeScreen = false
    updatedScreens.push(await sdk.screens.update(screen))
  }

  return updatedScreens
}
