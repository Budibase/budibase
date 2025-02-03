import { derived } from "svelte/store"
import { tables } from "./tables"
import { selectedScreen } from "./screens"
import { viewsV2 } from "./viewsV2"
import {
  UIDatasourceType,
  Screen,
  Component,
  UIComponentError,
  ScreenProps,
  ComponentDefinition,
} from "@budibase/types"
import { queries } from "./queries"
import { views } from "./views"
import { findAllComponents } from "@/helpers/components"
import { bindings } from "@/helpers"
import { getBindableProperties } from "@/dataBinding"
import { componentStore } from "./components"
import { getSettingsDefinition } from "@budibase/frontend-core"

function reduceBy<TItem extends {}, TKey extends keyof TItem>(
  key: TKey,
  list: TItem[]
): Record<string, TItem> {
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
  ]): Record<string, UIComponentError[]> => {
    if (!$selectedScreen) {
      return {}
    }

    const datasources = {
      ...reduceBy("_id", $tables.list),
      ...reduceBy("name", $views.list),
      ...reduceBy("id", $viewsV2.list),
      ...reduceBy("_id", $queries.list),
    }

    const { components: definitions } = $componentStore

    const errors = {
      ...getInvalidDatasources($selectedScreen, datasources, definitions),
      ...getMissingAncestors($selectedScreen, definitions),
      ...getMissingRequiredSettings($selectedScreen, definitions),
    }
    return errors
  }
)

function getInvalidDatasources(
  screen: Screen,
  datasources: Record<string, any>,
  definitions: Record<string, ComponentDefinition>
) {
  const result: Record<string, UIComponentError[]> = {}
  for (const { component, setting } of findComponentsBySettingsType(
    screen,
    ["table", "dataSource"],
    definitions
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
          componentId: component._id!,
          key: setting.key,
          message: `The ${friendlyTypeName} named "${label}" could not be found`,
          errorType: "setting",
        },
      ]
    }
  }

  return result
}

function getMissingRequiredSettings(
  screen: Screen,
  definitions: Record<string, ComponentDefinition>
) {
  const allComponents = findAllComponents(screen.props) as Component[]

  const result: Record<string, UIComponentError[]> = {}
  for (const component of allComponents) {
    const definition = definitions[component._component]

    const settings = getSettingsDefinition(definition)

    const missingRequiredSettings = settings.filter(setting => {
      let empty =
        component[setting.key] == null || component[setting.key] === ""
      let missing = setting.required && empty

      // Check if this setting depends on another, as it may not be required
      if (setting.dependsOn && typeof setting.dependsOn !== "string") {
        const dependsOnKey = setting.dependsOn.setting || setting.dependsOn
        const dependsOnValue = setting.dependsOn.value
        const realDependentValue =
          component[dependsOnKey as keyof typeof component]

        const sectionDependsOnKey =
          setting.sectionDependsOn?.setting || setting.sectionDependsOn
        const sectionDependsOnValue = setting.sectionDependsOn?.value
        const sectionRealDependentValue =
          component[sectionDependsOnKey as keyof typeof component]

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
    })

    if (missingRequiredSettings?.length) {
      result[component._id!] = missingRequiredSettings.map(s => ({
        componentId: component._id!,
        key: s.key,
        message: `Add the <mark>${s.label}</mark> setting to start using your component`,
        errorType: "setting",
      }))
    }
  }

  return result
}

const BudibasePrefix = "@budibase/standard-components/"
function getMissingAncestors(
  screen: Screen,
  definitions: Record<string, ComponentDefinition>
) {
  const result: Record<string, UIComponentError[]> = {}

  function checkMissingAncestors(component: Component, ancestors: string[]) {
    for (const child of component._children || []) {
      checkMissingAncestors(child, [...ancestors, component._component])
    }

    const definition = definitions[component._component]

    if (!definition?.requiredAncestors?.length) {
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
        const ancestorDefinition = definitions[`${BudibasePrefix}${ancestor}`]
        return {
          componentId: component._id!,
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

export function findComponentsBySettingsType(
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

    const setting = definition?.settings?.find(s => typesArray.includes(s.type))
    if (setting) {
      result.push({
        component,
        setting: { type: setting.type, key: setting.key },
      })
    }
    component._children?.forEach(child => {
      recurseFieldComponentsInChildren(child)
    })
  }

  recurseFieldComponentsInChildren(screen?.props)
  return result
}

export const screenComponentErrorList = derived(
  [screenComponentErrors],
  ([$screenComponentErrors]): UIComponentError[] => {
    if (!featureFlag.isEnabled("CHECK_COMPONENT_SETTINGS_ERRORS")) {
      return []
    }

    return Object.values($screenComponentErrors).flatMap(errors => errors)
  }
)

export const screenComponents = derived(
  [selectedScreen],
  ([$selectedScreen]): Record<string, Component> => {
    if (!$selectedScreen) {
      return {}
    }

    return findAllComponents($selectedScreen.props).reduce<
      Record<string, Component>
    >((obj, component) => {
      obj[component._id] = component
      return obj
    }, {})
  }
)
