import { derived } from "svelte/store"
import { tables, selectedScreen, viewsV2 } from "@/stores/builder"
import { DerivedBudiStore } from "../BudiStore"
import { findComponentsBySettingsType } from "@/helpers/screen"
import { Screen, Table, ViewV2 } from "@budibase/types"

interface BuilderScreenComponentStore {}

interface DerivedScreenComponentStore extends BuilderScreenComponentStore {
  errors: Record<string, string[]>
}

export class ScreenComponentStore extends DerivedBudiStore<
  BuilderScreenComponentStore,
  DerivedScreenComponentStore
> {
  constructor() {
    const makeDerivedStore = () => {
      return derived(
        [selectedScreen, tables, viewsV2],
        ([$selectedScreen, $tables, $viewsV2]): DerivedScreenComponentStore => {
          function getErrors() {
            const datasources = flattenTablesAndViews(
              $tables.list,
              $viewsV2.list
            )
            return {
              ...getInvalidDatasources($selectedScreen, datasources),
            }
          }

          return {
            errors: getErrors(),
          }
        }
      )
    }

    super({}, makeDerivedStore)
  }
}

export const screenComponentStore = new ScreenComponentStore()

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
  for (const component of findComponentsBySettingsType(screen, "table")) {
    const { resourceId, type, label } = component.dataSource
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
