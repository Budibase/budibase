import { derived } from "svelte/store"
import { tables } from "./tables"
import { selectedScreen } from "./screens"
import { viewsV2 } from "./viewsV2"
import { findComponentsBySettingsType } from "@/helpers/screen"
import { Screen, Table, ViewV2 } from "@budibase/types"

export const screenComponentErrors = derived(
  [selectedScreen, tables, viewsV2],
  ([$selectedScreen, $tables, $viewsV2]): Record<string, string[]> => {
    function flattenTablesAndViews(tables: Table[], views: ViewV2[]) {
      return {
        ...tables.reduce(
          (list, table) => ({
            ...list,
            [table._id!]: table,
          }),
          {}
        ),
        ...views.reduce(
          (list, view) => ({
            ...list,
            [view.id]: view,
          }),
          {}
        ),
      }
    }

    function getInvalidDatasources(
      screen: Screen,
      datasources: Record<string, any>
    ) {
      const friendlyNameByType = {
        table: "table",
        view: "view",
        viewV2: "view",
      }

      const result: Record<string, string[]> = {}
      for (const { component, setting } of findComponentsBySettingsType(
        screen,
        "table"
      )) {
        const { resourceId, type, label } = component[setting.key]
        if (!datasources[resourceId]) {
          const friendlyTypeName =
            friendlyNameByType[type as keyof typeof friendlyNameByType]
          result[component._id!] = [
            `The ${friendlyTypeName} named "${label}" does not exist`,
          ]
        }
      }

      return result
    }

    const datasources = flattenTablesAndViews($tables.list, $viewsV2.list)
    return getInvalidDatasources($selectedScreen, datasources)
  }
)
