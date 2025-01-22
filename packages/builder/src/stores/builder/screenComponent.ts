import { derived } from "svelte/store"
import { tables } from "./tables"
import { selectedScreen } from "./screens"
import { viewsV2 } from "./viewsV2"
import { findComponentsBySettingsType } from "@/helpers/screen"
import { Screen } from "@budibase/types"

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

export const screenComponentErrors = derived(
  [selectedScreen, tables, viewsV2],
  ([$selectedScreen, $tables, $viewsV2]): Record<string, string[]> => {
    function getInvalidDatasources(
      screen: Screen,
      datasources: Record<string, any>
    ) {
      const friendlyNameByType = {
        viewV2: "view",
      }

      const result: Record<string, string[]> = {}
      for (const { component, setting } of findComponentsBySettingsType(
        screen,
        ["table", "dataSource"]
      )) {
        const { resourceId, type, label } = component[setting.key]
        if (!datasources[resourceId]) {
          const friendlyTypeName =
            friendlyNameByType[type as keyof typeof friendlyNameByType] ?? type
          result[component._id!] = [
            `The ${friendlyTypeName} named "${label}" does not exist`,
          ]
        }
      }

      return result
    }

    const datasources = {
      ...reduceBy("_id", $tables.list),
      ...reduceBy("id", $viewsV2.list),
    }

    return getInvalidDatasources($selectedScreen, datasources)
  }
)
