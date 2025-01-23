import { derived } from "svelte/store"
import { tables } from "./tables"
import { selectedScreen } from "./screens"
import { viewsV2 } from "./viewsV2"
import { findComponentsBySettingsType } from "@/helpers/screen"
import { DatasourceType, Screen } from "@budibase/types"
import { queries } from "./queries"

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
  [selectedScreen, tables, viewsV2, queries],
  ([$selectedScreen, $tables, $viewsV2, $queries]): Record<
    string,
    string[]
  > => {
    function getInvalidDatasources(
      screen: Screen,
      datasources: Record<string, any>
    ) {
      const friendlyNameByType: Partial<Record<DatasourceType, string>> = {
        viewV2: "view",
      }

      const primaryKeyByType: Record<DatasourceType, string> = {
        table: "resourceId",
        view: "TODO",
        viewV2: "resourceId",
        query: "_id",
        custom: "" as never,
      }

      const result: Record<string, string[]> = {}
      for (const { component, setting } of findComponentsBySettingsType(
        screen,
        ["table", "dataSource"]
      )) {
        const componentSettings = component[setting.key]
        const { type, label } = componentSettings
        if (type === "custom") {
          continue
        }
        const resourceId =
          componentSettings[primaryKeyByType[type as DatasourceType]]
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
      ...reduceBy("_id", $queries.list),
    }

    return getInvalidDatasources($selectedScreen, datasources)
  }
)
