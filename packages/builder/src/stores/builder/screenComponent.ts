import { derived } from "svelte/store"
import { tables } from "./tables"
import { selectedScreen } from "./screens"
import { viewsV2 } from "./viewsV2"
import { findComponentsBySettingsType } from "@/helpers/screen"
import { UIDatasourceType, Screen } from "@budibase/types"
import { queries } from "./queries"
import { views } from "./views"
import { bindings, featureFlag } from "@/helpers"
import { getBindableProperties } from "@/dataBinding"

function reduceBy<TItem extends {}, TKey extends keyof TItem>(
  key: TKey,
  list: TItem[]
): Record<string, any> {
  return list.reduce(
    (result, item) => ({
      ...result,
      [item[key] as string]: item,
    }),
    {}
  )
}

const friendlyNameByType: Partial<Record<UIDatasourceType, string>> = {
  viewV2: "view",
}

const validationKeyByType: Record<UIDatasourceType, string | null> = {
  table: "tableId",
  view: "name",
  viewV2: "id",
  query: "_id",
  custom: null,
  link: "rowId",
  field: "value",
  jsonarray: "value",
}

export const screenComponentErrors = derived(
  [selectedScreen, tables, views, viewsV2, queries],
  ([$selectedScreen, $tables, $views, $viewsV2, $queries]): Record<
    string,
    string[]
  > => {
    if (!featureFlag.isEnabled("CHECK_SCREEN_COMPONENT_SETTINGS_ERRORS")) {
      return {}
    }
    function getInvalidDatasources(
      screen: Screen,
      datasources: Record<string, any>
    ) {
      const result: Record<string, string[]> = {}
      for (const { component, setting } of findComponentsBySettingsType(
        screen,
        ["table", "dataSource"]
      )) {
        const componentSettings = component[setting.key]
        if (!componentSettings) {
          continue
        }
        const { label } = componentSettings
        const type = componentSettings.type as UIDatasourceType

        const validationKey = validationKeyByType[type]
        if (!validationKey) {
          continue
        }

        const componentBindings = getBindableProperties(
          $selectedScreen,
          component._id
        )

        const componentDatasources = {
          ...reduceBy(
            "rowId",
            bindings.extractRelationships(componentBindings)
          ),
          ...reduceBy("value", bindings.extractFields(componentBindings)),
          ...reduceBy(
            "value",
            bindings.extractJSONArrayFields(componentBindings)
          ),
        }

        const resourceId = componentSettings[validationKey]
        if (!{ ...datasources, ...componentDatasources }[resourceId]) {
          const friendlyTypeName = friendlyNameByType[type] ?? type
          result[component._id!] = [
            `The ${friendlyTypeName} named "${label}" could not be found`,
          ]
        }
      }

      return result
    }

    const datasources = {
      ...reduceBy("_id", $tables.list),
      ...reduceBy("name", $views.list),
      ...reduceBy("id", $viewsV2.list),
      ...reduceBy("_id", $queries.list),
    }

    if (!$selectedScreen) {
      // Skip validation if a screen is not selected.
      return {}
    }

    return getInvalidDatasources($selectedScreen, datasources)
  }
)
