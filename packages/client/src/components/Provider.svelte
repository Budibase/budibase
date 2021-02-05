<script>
  import { getContext, setContext, onMount } from "svelte"
  import { datasourceStore, createContextStore } from "../store"
  import { ActionTypes } from "../constants"
  import { generate } from "shortid"

  export let data
  export let actions
  export let key

  // Clone and create new data context for this component tree
  const context = getContext("context")
  const component = getContext("component")
  const newContext = createContextStore($context)
  setContext("context", newContext)
  $: providerKey = key || $component.id

  // Instance ID is unique to each instance of a provider
  let instanceId

  // Add data context
  $: data !== undefined && newContext.actions.provideData(providerKey, data)

  // Add actions context
  $: {
    if (instanceId) {
      actions?.forEach(({ type, callback, metadata }) => {
        newContext.actions.provideAction(providerKey, type, callback)

        // Register any "refresh datasource" actions with a singleton store
        // so we can easily refresh data at all levels for any datasource
        if (type === ActionTypes.RefreshDatasource) {
          const { datasource } = metadata || {}
          datasourceStore.actions.registerDatasource(
            datasource,
            instanceId,
            callback
          )
        }
      })
    }
  }

  onMount(() => {
    // Generate a permanent unique ID for this component and use it to register
    // any datasource actions
    instanceId = generate()

    // Unregister all datasource instances when unmounting this provider
    return () => datasourceStore.actions.unregisterInstance(instanceId)
  })
</script>

<slot />
