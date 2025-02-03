import { derived } from "svelte/store"
import { tables } from "./tables"
import { selectedScreen } from "./screens"
import { viewsV2 } from "./viewsV2"
import {
  UIDatasourceType,
  Screen,
  Component,
  ScreenProps,
} from "@budibase/types"
import { queries } from "./queries"
import { views } from "./views"
import { bindings, featureFlag } from "@/helpers"
import { getBindableProperties } from "@/dataBinding"
import { componentStore, ComponentDefinition } from "./components"
import { findAllComponents } from "@/helpers/components"

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
  [selectedScreen, tables, views, viewsV2, queries, componentStore],
  ([
    $selectedScreen,
    $tables,
    $views,
    $viewsV2,
    $queries,
    $componentStore,
  ]): Record<string, string[]> => {
    if (!featureFlag.isEnabled("CHECK_COMPONENT_SETTINGS_ERRORS")) {
      return {}
    }
    function getInvalidDatasources(
      screen: Screen,
      datasources: Record<string, any>
    ) {
      const result: Record<string, string[]> = {}

      for (const { component, setting } of findComponentsBySettingsType(
        screen,
        ["table", "dataSource"],
        $componentStore.components
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

function findComponentsBySettingsType(
  screen: Screen,
  type: string | string[],
  definitions: Record<string, ComponentDefinition>
) {
  const typesArray = Array.isArray(type) ? type : [type]

  const result: {
    component: Component
    setting: {
      type: string
      key: string
    }
  }[] = []

  function recurseFieldComponentsInChildren(component: ScreenProps) {
    if (!component) {
      return
    }

    const definition = definitions[component._component]

    const setting = definition?.settings?.find((s: any) =>
      typesArray.includes(s.type)
    )
    if (setting && "type" in setting) {
      result.push({
        component,
        setting: { type: setting.type!, key: setting.key! },
      })
    }
    component._children?.forEach(child => {
      recurseFieldComponentsInChildren(child)
    })
  }

  recurseFieldComponentsInChildren(screen?.props)
  return result
}

export const screenComponents = derived(
  [selectedScreen],
  ([$selectedScreen]) => {
    if (!$selectedScreen) {
      return []
    }
    return findAllComponents($selectedScreen.props) as Component[]
  }
)
