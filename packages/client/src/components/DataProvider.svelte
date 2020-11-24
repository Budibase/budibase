<script>
  import { getContext, setContext } from "svelte"
  import { createDataContextStore } from "../store"

  export let row

  // Get current contexts
  const dataContext = getContext("data")
  const styles = getContext("style")

  // Clone current context to this context
  const newDataContext = createDataContextStore($dataContext)
  setContext("data", newDataContext)

  // Add additional layer to context
  $: newDataContext.actions.addContext(row, $styles.id)
</script>

<slot />
