import { derived } from "svelte/store"
import { tables } from "./tables"
import { selectedScreen } from "./screens"
import { viewsV2 } from "./viewsV2"
import {
  findComponentsBySettingsType,
  getManifestDefinition,
} from "@/helpers/screen"
import {
  UIDatasourceType,
  Screen,
  Component,
  UIComponentError,
} from "@budibase/types"
import { queries } from "./queries"
import { views } from "./views"
import { findAllComponents } from "@/helpers/components"
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
    UIComponentError[]
  > => {
    if (
      !featureFlag.isEnabled("CHECK_SCREEN_COMPONENT_SETTINGS_ERRORS") ||
      !$selectedScreen
    ) {
      return {}
    }

    const datasources = {
      ...reduceBy("_id", $tables.list),
      ...reduceBy("name", $views.list),
      ...reduceBy("id", $viewsV2.list),
      ...reduceBy("_id", $queries.list),
    }

    const errors = {
      ...getInvalidDatasources($selectedScreen, datasources),
      ...getMissingAncestors($selectedScreen),
      ...getMissingRequiredSettings($selectedScreen),
    }
    return errors
  }
)

function getInvalidDatasources(
  screen: Screen,
  datasources: Record<string, any>
) {
  const result: Record<string, UIComponentError[]> = {}
  for (const { component, setting } of findComponentsBySettingsType(screen, [
    "table",
    "dataSource",
  ])) {
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

    const componentBindings = getBindableProperties(screen, component._id)

    const componentDatasources = {
      ...reduceBy("rowId", bindings.extractRelationships(componentBindings)),
      ...reduceBy("value", bindings.extractFields(componentBindings)),
      ...reduceBy("value", bindings.extractJSONArrayFields(componentBindings)),
    }

    const resourceId = componentSettings[validationKey]
    if (!{ ...datasources, ...componentDatasources }[resourceId]) {
      const friendlyTypeName = friendlyNameByType[type] ?? type
      result[component._id!] = [
        {
          key: setting.key,
          message: `The ${friendlyTypeName} named "${label}" could not be found`,
          errorType: "setting",
        },
      ]
    }
  }

  return result
}

function getMissingRequiredSettings(screen: Screen) {
  const allComponents = findAllComponents(screen.props) as Component[]

  const result: Record<string, UIComponentError[]> = {}
  for (const component of allComponents) {
    const definition = getManifestDefinition(component)
    if (!("settings" in definition)) {
      continue
    }

    const missingRequiredSettings = definition.settings.filter(
      (setting: any) => {
        let empty =
          component[setting.key] == null || component[setting.key] === ""
        let missing = setting.required && empty

        // Check if this setting depends on another, as it may not be required
        if (setting.dependsOn) {
          const dependsOnKey = setting.dependsOn.setting || setting.dependsOn
          const dependsOnValue = setting.dependsOn.value
          const realDependentValue = component[dependsOnKey]

          const sectionDependsOnKey =
            setting.sectionDependsOn?.setting || setting.sectionDependsOn
          const sectionDependsOnValue = setting.sectionDependsOn?.value
          const sectionRealDependentValue = component[sectionDependsOnKey]

          if (dependsOnValue == null && realDependentValue == null) {
            return false
          }
          if (dependsOnValue != null && dependsOnValue !== realDependentValue) {
            return false
          }

          if (
            sectionDependsOnValue != null &&
            sectionDependsOnValue !== sectionRealDependentValue
          ) {
            return false
          }
        }

        return missing
      }
    )

    if (missingRequiredSettings.length) {
      result[component._id!] = missingRequiredSettings.map((s: any) => ({
        key: s.key,
        message: `Add the <mark>${s.label}</mark> setting to start using your component`,
        errorType: "setting",
      }))
    }
  }

  return result
}

const BudibasePrefix = "@budibase/standard-components/"
function getMissingAncestors(screen: Screen) {
  const result: Record<string, UIComponentError[]> = {}

  function checkMissingAncestors(component: Component, ancestors: string[]) {
    for (const child of component._children || []) {
      checkMissingAncestors(child, [...ancestors, component._component])
    }

    const definition = getManifestDefinition(component)

    if (!("requiredAncestors" in definition)) {
      return
    }

    const missingAncestors = definition.requiredAncestors.filter(
      ancestor => !ancestors.includes(`${BudibasePrefix}${ancestor}`)
    )

    if (missingAncestors.length) {
      const pluralise = (name: string) => {
        return name.endsWith("s") ? `${name}'` : `${name}s`
      }

      result[component._id!] = missingAncestors.map(ancestor => {
        const ancestorDefinition: any = getManifestDefinition(ancestor)
        return {
          message: `${pluralise(definition.name)} need to be inside a
<mark>${ancestorDefinition.name}</mark>`,
          errorType: "ancestor-setting",
          ancestor: {
            name: ancestorDefinition.name,
            fullType: `${BudibasePrefix}${ancestor}`,
          },
        }
      })
    }
  }

  checkMissingAncestors(screen.props, [])
  return result
}
