import { derived } from "svelte/store"
import { tables } from "./tables"
import { selectedScreen } from "./screens"
import { viewsV2 } from "./viewsV2"
import { findComponentsBySettingsType } from "@/helpers/screen"
import { UIDatasourceType, Screen } from "@budibase/types"
import { queries } from "./queries"
import { views } from "./views"
import { featureFlag } from "@/helpers"

function reduceBy<TItem extends {}, TKey extends keyof TItem>(
  key: TKey,
  list: TItem[]
) {
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
        const { label } = componentSettings
        const type = componentSettings.type as UIDatasourceType

        const validationKey = validationKeyByType[type]
        if (!validationKey) {
          continue
        }
        const resourceId = componentSettings[validationKey]
        if (!datasources[resourceId]) {
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

    return getInvalidDatasources($selectedScreen, datasources)
  }
)
