<script>
  import { getContext, setContext } from "svelte"
  import { createDataStore } from "../store"

  export let row

  // Get current contexts
  const data = getContext("data")
  const component = getContext("component")

  // Clone current context to this context
  const newData = createDataStore($data)
  setContext("data", newData)

  // Add additional layer to context
  $: newData.actions.addContext(row, $component.id)
</script>

<slot />
