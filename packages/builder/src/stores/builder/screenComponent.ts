import { derived } from "svelte/store"
import { tables } from "./tables"
import { selectedScreen } from "./screens"
import { viewsV2 } from "./viewsV2"
import {
  UIDatasourceType,
  Component,
  UIComponentError,
  ComponentDefinition,
  DependsOnComponentSetting,
  Screen,
} from "@budibase/types"
import { queries } from "./queries"
import { views } from "./views"
import { findAllComponents } from "@/helpers/components"
import { bindings } from "@/helpers"
import { getBindableProperties } from "@/dataBinding"
import { componentStore } from "./components"
import { getSettingsDefinition } from "@budibase/frontend-core"
import { utils } from "@budibase/shared-core"

const reduceBy = utils.toMap

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

export const screenComponentsList = derived(
  [selectedScreen],
  ([$selectedScreen]): Component[] => {
    if (!$selectedScreen) {
      return []
    }

    return findAllComponents($selectedScreen.props)
  }
)

export const screenComponentErrorList = derived(
  [selectedScreen, tables, views, viewsV2, queries, componentStore],
  ([
    $selectedScreen,
    $tables,
    $views,
    $viewsV2,
    $queries,
    $componentStore,
  ]): UIComponentError[] => {
    if (!$selectedScreen) {
      return []
    }
    const screen = $selectedScreen

    const datasources = {
      ...reduceBy("_id", $tables.list),
      ...reduceBy("name", $views.list),
      ...reduceBy("id", $viewsV2.list),
      ...reduceBy("_id", $queries.list),
    }

    const { components: definitions } = $componentStore

    const errors: UIComponentError[] = []

    function checkComponentErrors(component: Component, ancestors: string[]) {
      errors.push(...getMissingAncestors(component, definitions, ancestors))
      errors.push(
        ...getInvalidDatasources(screen, component, datasources, definitions)
      )
      errors.push(...getMissingRequiredSettings(component, definitions))

      for (const child of component._children || []) {
        checkComponentErrors(child, [...ancestors, component._component])
      }
    }

    checkComponentErrors($selectedScreen?.props, [])

    return errors
  }
)

function getInvalidDatasources(
  screen: Screen,
  component: Component,
  datasources: Record<string, any>,
  definitions: Record<string, ComponentDefinition>
) {
  const result: UIComponentError[] = []

  const datasourceTypes = ["table", "dataSource"]

  const possibleSettings = definitions[component._component]?.settings?.filter(
    s => datasourceTypes.includes(s.type)
  )
  if (possibleSettings) {
    for (const setting of possibleSettings) {
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
        ...reduceBy(
          "value",
          bindings.extractJSONArrayFields(componentBindings)
        ),
      }

      const resourceId = componentSettings[validationKey]
      if (!{ ...datasources, ...componentDatasources }[resourceId]) {
        const friendlyTypeName = friendlyNameByType[type] ?? type
        result.push({
          componentId: component._id!,
          key: setting.key,
          label: setting.label || setting.key,
          message: `The ${friendlyTypeName} named "${label}" could not be found`,

          errorType: "setting",
          cause: "invalid",
        })
      }
    }
  }

  return result
}

function parseDependsOn(dependsOn: DependsOnComponentSetting | undefined): {
  key?: string
  value?: string
} {
  if (dependsOn === undefined) {
    return {}
  }

  if (typeof dependsOn === "string") {
    return { key: dependsOn }
  }

  return { key: dependsOn.setting, value: dependsOn.value }
}

function getMissingRequiredSettings(
  component: Component,
  definitions: Record<string, ComponentDefinition>
) {
  const result: UIComponentError[] = []

  const definition = definitions[component._component]

  const settings = getSettingsDefinition(definition)

  const missingRequiredSettings = settings.filter(setting => {
    let empty = component[setting.key] == null || component[setting.key] === ""
    let missing = setting.required && empty

    // Check if this setting depends on another, as it may not be required
    if (setting.dependsOn) {
      const { key: dependsOnKey, value: dependsOnValue } = parseDependsOn(
        setting.dependsOn
      )
      const realDependentValue =
        component[dependsOnKey as keyof typeof component]

      const { key: sectionDependsOnKey, value: sectionDependsOnValue } =
        parseDependsOn(setting.sectionDependsOn)
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
    result.push(
      ...missingRequiredSettings.map<UIComponentError>(s => ({
        componentId: component._id!,
        key: s.key,
        label: s.label || s.key,
        message: `Add the <mark>${s.label}</mark> setting to start using your component`,
        errorType: "setting",
        cause: "missing",
      }))
    )
  }

  return result
}

const BudibasePrefix = "@budibase/standard-components/"
function getMissingAncestors(
  component: Component,
  definitions: Record<string, ComponentDefinition>,
  ancestors: string[]
): UIComponentError[] {
  const definition = definitions[component._component]
  if (ancestors.some(a => !a.startsWith(BudibasePrefix))) {
    // We don't have a way to know what components are used within a plugin component
    return []
  }
  if (!definition?.requiredAncestors?.length) {
    return []
  }

  const result: UIComponentError[] = []
  const missingAncestors = definition.requiredAncestors.filter(
    ancestor => !ancestors.includes(`${BudibasePrefix}${ancestor}`)
  )

  if (missingAncestors.length) {
    const pluralise = (name: string) => {
      return name.endsWith("s") ? `${name}'` : `${name}s`
    }

    result.push(
      ...missingAncestors.map<UIComponentError>(ancestor => {
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
    )
  }

  return result
}

export const screenComponentErrors = derived(
  [screenComponentErrorList],
  ([$list]): Record<string, UIComponentError[]> => {
    return $list.reduce<Record<string, UIComponentError[]>>((obj, error) => {
      obj[error.componentId] ??= []
      obj[error.componentId].push(error)
      return obj
    }, {})
  }
)
