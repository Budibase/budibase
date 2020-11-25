<script>
  import { getContext, setContext } from "svelte"
  import { createDataStore } from "../store"

  export let row

  // Clone and create new data context for this component tree
  const data = getContext("data")
  const component = getContext("component")
  const newData = createDataStore($data)
  setContext("data", newData)
  $: newData.actions.addContext(row, $component.id)
</script>

<slot />
