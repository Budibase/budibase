<script>
  import { getContext, setContext } from "svelte"
  import { createContextStore } from "../store"

  export let data
  export let actions
  export let key

  // Clone and create new data context for this component tree
  const context = getContext("context")
  const component = getContext("component")
  const newContext = createContextStore($context)
  setContext("context", newContext)
  $: providerKey = key || $component.id

  // Add data context
  $: newContext.actions.provideData(providerKey, data)

  // Add actions context
  $: {
    actions?.forEach(({ type, callback }) => {
      newContext.actions.provideAction(providerKey, type, callback)
    })
  }
</script>

<slot />
