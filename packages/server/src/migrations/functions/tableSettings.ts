import { getScreenParams } from "../../db/utils"
import { Screen } from "@budibase/types"
import { makePropSafe as safe } from "@budibase/string-templates"
/**
 * Date:
 * November 2022
 *
 * Description:
 * Update table settings to use actions instead of links. We do not remove the
 * legacy values here as we cannot guarantee that their apps are up-t-date.
 * It is safe to simply save both the new and old structure in the definition.
 *
 * Migration 1:
 * Legacy "linkRows", "linkURL", "linkPeek" and "linkColumn" settings on tables
 * and table blocks are migrated into a "Navigate To" action under the new
 * "onClick" setting.
 *
 * Migration 2:
 * Legacy "titleButtonURL" and "titleButtonPeek" settings on table blocks are
 * migrated into a "Navigate To" action under the new "onClickTitleButton"
 * setting.
 */
export const run = async (appDb: any) => {
  // Get all app screens
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
  for (let screen of screens) {
    const changed = migrateTableSettings(screen.props)

    // Save screen if we updated it
    if (changed) {
      await appDb.put(screen)
      console.log(
        `Screen ${screen.routing?.route} contained table settings which were migrated`
      )
    }
  }
}

// Recursively searches and mutates a screen doc to migrate table component
// and table block settings
const migrateTableSettings = (component: any) => {
  let changed = false
  if (!component) {
    return changed
  }

  // Migration 1: migrate table row click settings
  if (
    component._component.endsWith("/table") ||
    component._component.endsWith("/tableblock")
  ) {
    const { linkRows, linkURL, linkPeek, linkColumn, onClick } = component
    if (linkRows && !onClick) {
      const column = linkColumn || "_id"
      const action = convertLinkSettingToAction(linkURL, !!linkPeek, column)
      if (action) {
        changed = true
        component.onClick = action
        if (component._component.endsWith("/tableblock")) {
          component.clickBehaviour = "actions"
        }
      }
    }
  }

  // Migration 2: migrate table block title button settings
  if (component._component.endsWith("/tableblock")) {
    const {
      showTitleButton,
      titleButtonURL,
      titleButtonPeek,
      onClickTitleButton,
    } = component
    if (showTitleButton && !onClickTitleButton) {
      const action = convertLinkSettingToAction(
        titleButtonURL,
        !!titleButtonPeek
      )
      if (action) {
        changed = true
        component.onClickTitleButton = action
        component.titleButtonClickBehaviour = "actions"
      }
    }
  }

  // Recurse down the tree as needed
  component._children?.forEach((child: any) => {
    const childChanged = migrateTableSettings(child)
    changed = changed || childChanged
  })
  return changed
}

// Util ti convert the legacy settings into a navigation action structure
const convertLinkSettingToAction = (
  linkURL: string,
  linkPeek: boolean,
  linkColumn?: string
) => {
  // Sanity check we have a URL
  if (!linkURL) {
    return null
  }

  // Default URL to the old URL setting
  let url = linkURL

  // If we enriched the old URL with a column, update the url
  if (linkColumn && linkURL.includes("/:")) {
    // Convert old link URL setting, which is a screen URL, into a valid
    // binding using the new clicked row binding
    const split = linkURL.split("/:")
    const col = linkColumn || "_id"
    const binding = `{{ ${safe("eventContext")}.${safe("row")}.${safe(col)} }}`
    url = `${split[0]}/${binding}`
  }

  // Create action structure
  return [
    {
      "##eventHandlerType": "Navigate To",
      parameters: {
        url,
        peek: linkPeek,
      },
    },
  ]
}
