import { getScreenParams } from "../../db/utils"
import { Screen } from "@budibase/types"
import { makePropSafe as safe } from "@budibase/string-templates"
/**
 * Date:
 * November 2022
 *
 * Description:
 * Update table settings to use actions instead of links.
 * Legacy "linkRows", "linkURL", "linkPeek" and "linkColumn" settings on tables
 * and table blocks are migrated into a "Navigate To" action under the new
 * "onClick" setting.
 */
export const run = async (appDb: any) => {
  let screens: Screen[]

  try {
    screens = (
      await appDb.allDocs(
        getScreenParams(null, {
          include_docs: true,
        })
      )
    ).rows.map((row: any) => row.doc)
  } catch (e) {
    // sometimes the metadata document doesn't exist
    // exit early instead of failing the migration
    console.error("Error retrieving app metadata. Skipping", e)
    return
  }

  // Recursively update any relevant components and mutate the screen docs
  screens.forEach((screen: any) => {
    migrateTableSettings(screen.props, screen)

    // Save screen if we updated it
    if (screen.touched) {
      delete screen.touched
      appDb.put(screen)
      console.log(
        `Screen ${screen.routing?.route} contained tables which were migrated`
      )
    }
  })
}

// Recursively searches and mutates a screen doc to migrate table component
// and table block settings
const migrateTableSettings = (component: any, screen: any) => {
  if (!component) {
    return
  }
  // Migrate table setting
  if (
    component._component.endsWith("/table") ||
    component._component.endsWith("/tableblock")
  ) {
    const { linkRows, linkURL, linkPeek, linkColumn, onClick } = component
    if (linkRows && !onClick) {
      const action = convertLinkSettingToAction(linkURL, linkPeek, linkColumn)
      if (action) {
        screen.touched = true
        component.onClick = action
      }
    }
  }
  if (!component._children?.length) {
    return
  }
  component._children.forEach((child: any) => {
    migrateTableSettings(child, screen)
  })
}

// Util ti convert the legacy settings into a navigation action structure
const convertLinkSettingToAction = (
  linkURL: string,
  linkPeek?: boolean,
  linkColumn?: string
) => {
  if (!linkURL?.includes("/:")) {
    return null
  }

  // Convert old link URL setting, which is a screen URL, into a valid
  // binding using the new clicked row binding
  const split = linkURL.split("/:")
  const col = linkColumn || "_id"
  const binding = `{{ ${safe("eventContext")}.${safe("row")}.${safe(col)} }}`
  const url = `${split[0]}/${binding}`

  return [
    {
      "##eventHandlerType": "Navigate To",
      parameters: {
        url,
        peek: !!linkPeek,
      },
    },
  ]
}
