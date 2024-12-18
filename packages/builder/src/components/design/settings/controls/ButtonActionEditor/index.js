import * as ActionComponents from "./actions"
import { get } from "svelte/store"
import { appStore } from "@/stores/builder"
// @ts-ignore
import ActionDefinitions from "./manifest.json"

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
