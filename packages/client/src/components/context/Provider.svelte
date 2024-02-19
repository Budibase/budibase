<script>
  import { getContext, setContext, onDestroy } from "svelte"
  import { dataSourceStore, createContextStore } from "stores"
  import { ActionTypes } from "constants"
  import { generate } from "shortid"

  const { ContextScopes } = getContext("sdk")

  export let data
  export let actions
  export let key
  export let scope = ContextScopes.Global

  let context = getContext("context")
  const component = getContext("component")
  const providerKey = key || $component.id

  // Create a new layer of context if we are only locally scoped
  if (scope === ContextScopes.Local) {
    context = createContextStore(context)
    setContext("context", context)
  }

  // Generate a permanent unique ID for this component and use it to register
  // any datasource actions
  const instanceId = generate()

  // Keep previous state around so we can avoid updating unless necessary
  let lastDataKey
  let lastActionsKey

  $: provideData(data)
  $: provideActions(actions, instanceId)

  const provideData = newData => {
    const dataKey = JSON.stringify(newData)
    if (dataKey !== lastDataKey) {
      context.actions.provideData(providerKey, newData)
      lastDataKey = dataKey
    }
  }

  const provideActions = newActions => {
    const actionsKey = JSON.stringify(newActions)
    if (actionsKey !== lastActionsKey) {
      lastActionsKey = actionsKey
      newActions?.forEach(({ type, callback, metadata }) => {
        context.actions.provideAction(providerKey, type, callback)

        // Register any "refresh datasource" actions with a singleton store
        // so we can easily refresh data at all levels for any datasource
        if (type === ActionTypes.RefreshDatasource) {
          if (metadata?.dataSource) {
            dataSourceStore.actions.registerDataSource(
              metadata.dataSource,
              instanceId,
              callback
            )
          }
        }
      })
    }
  }

  onDestroy(() => {
    // Unregister all datasource instances when unmounting this provider
    dataSourceStore.actions.unregisterInstance(instanceId)
  })
</script>

<slot />
