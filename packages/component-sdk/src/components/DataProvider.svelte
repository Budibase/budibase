<script>
  import { setContext, onMount } from "svelte"
  import { ContextTypes, createDataProviderStore } from "../context"

  export let row

  setContext("foo", "bar2")

  const dataProviderStore = createDataProviderStore()
  setContext(ContextTypes.DataProvider, dataProviderStore)

  onMount(async () => {
    await dataProviderStore.actions.setRow(row)
  })
</script>

<slot />
