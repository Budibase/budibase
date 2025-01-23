import { get } from "svelte/store"
import { getDatasourceForProvider } from "@/dataBinding"
import { rowActions, selectedScreen, componentStore } from "@/stores/builder"
import { Helpers } from "@budibase/bbui"
import { findComponent } from "@/helpers/components"

export const getRowActionButtonTemplates = async ({
  screen,
  component,
  instance,
}) => {
  // Find root component instance if not specified
  if (!instance) {
    if (!component) {
      return []
    }
    if (!screen) {
      screen = get(selectedScreen)
    }
    const id = component._rootId
    instance = findComponent(screen?.props, id)
  }
  if (!instance) {
    return []
  }

  // The row ID binding depends on what component this is.
  // Therefore we need to whitelist this to only function for certain components.
  const type = instance?._component
  const isGridBlock = type?.endsWith("/gridblock")
  const isFormBlock =
    type?.endsWith("/formblock") || type?.endsWith("/multistepformblock")
  if (!isGridBlock && !isFormBlock) {
    return []
  }

  // Check we have a valid datasource that can contain row actions
  const ds = getDatasourceForProvider(screen, instance)
  if (ds?.type !== "table" && ds?.type !== "viewV2") {
    return []
  }
  const resourceId = ds.id || ds.tableId
  if (!resourceId) {
    return []
  }
  await rowActions.refreshRowActions(resourceId)
  const enabledActions = get(rowActions)[resourceId] || []

  // Generate the row ID binding depending on the component
  let rowIdBinding
  if (isGridBlock) {
    rowIdBinding = `{{ [${instance._id}].[_id] }}`
  } else if (isFormBlock) {
    rowIdBinding = `{{ [${instance._id}-repeater].[_id] }}`
  }

  // Create templates
  return enabledActions.map(action => {
    // Create a button instance
    const button = componentStore.createInstance(
      `@budibase/standard-components/button`,
      {
        _instanceName: Helpers.uuid(),
        text: action.name,
        type: "primary",
        quiet: true,
      }
    )

    // Row action button action
    const onClick = [
      {
        parameters: {
          rowActionId: action.id,
          resourceId,
          rowId: rowIdBinding,
        },
        "##eventHandlerType": "Row Action",
        id: Helpers.uuid(),
      },
    ]

    // For form blocks we need to manually refresh the form after running the action
    if (isFormBlock) {
      onClick.push({
        parameters: {
          componentId: `${instance._id}-provider`,
        },
        "##eventHandlerType": "Refresh Data Provider",
        id: Helpers.uuid(),
      })
    }

    return {
      ...button,
      onClick,
    }
  })
}
