import * as ActionComponents from "../components/design/settings/controls/ButtonActionEditor/actions/index"
import { get } from "svelte/store"
import { appStore } from "stores/builder"
//@ts-ignore
import ActionDefinitions from "../components/design/settings/controls/ButtonActionEditor/manifest.json"
import { findAllMatchingComponents } from "./components"

// Defines which actions are available to configure in the front end.
// Unfortunately the "name" property is used as the identifier so please don't
// change them.
// The client library removes any spaces when processing actions, so they can
// be considered as camel case too.
// There is technical debt here to sanitize all these and standardise them
// across the packages but it's a breaking change to existing apps.
export const getAvailableActions = (getAllActions = false) => {
  return ActionDefinitions.actions
    .filter(action => {
      // Filter down actions to those supported by the current client lib version
      if (getAllActions || !action.dependsOnFeature) {
        return true
      }
      return get(appStore).clientFeatures?.[action.dependsOnFeature] === true
    })
    .map(action => {
      // Then enrich the actions with real components
      return {
        ...action,
        component: ActionComponents[action.component],
      }
    })
    .filter(action => {
      // Then strip any old actions for which we don't have constructors
      return action.component != null
    })
}

export const ActionParameterMappings = {
  "Export Data": {
    _searchLabels: ["Button: Export Data"],
    tableComponentId: [
      {
        componentType: "@budibase/standard-components/tableblock",
        key: "_id",
        transform: value => `${value}-table`,
        updateDependency: component => (component.allowSelectRows = true),
      },
    ],
  },
}

// Returns true if a component in the tree has an action that
// matches the provided actionName and parameter values
export const hasExistingAction = (
  rootComponent,
  actionName,
  parameters,
  event,
  componentType
) => {
  return findAllMatchingComponents(
    rootComponent,
    component => component._component === componentType
  )
    .flatMap(button => button[event] || [])
    .some(
      action =>
        action["##eventHandlerType"] === actionName &&
        Object.entries(action.parameters || {}).some(
          ([key, value]) => parameters[key] === value
        )
    )
}
