<script>
  import { onMount, getContext, setContext } from "svelte"
  import { createDataContextStore } from "../store"

  export let row

  // Get current contexts
  const dataContext = getContext("data")

  // Clone current context to this context
  const newDataContext = createDataContextStore($dataContext)
  setContext("data", newDataContext)

  // Add additional layer to context
  let loaded = false
  onMount(() => {
    newDataContext.actions.addContext(row)
    loaded = true
  })
</script>

{#if loaded}
  <slot />
{/if}
