<script>
  import { getContext, setContext } from "svelte"
  import { createContextStore } from "../store"

  export let data
  export let actions

  // Clone and create new data context for this component tree
  const context = getContext("context")
  const component = getContext("component")
  const newContext = createContextStore($context)
  setContext("context", newContext)

  // Add data context
  $: {
    if (data !== undefined) {
      newContext.actions.provideData($component.id, data)
    }
  }

  // Add actions context
  $: {
    actions?.forEach(({ type, callback }) => {
      newContext.actions.provideAction($component.id, type, callback)
    })
  }
</script>

<slot />
