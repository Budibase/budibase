<script>
  import { setContext, onMount } from "svelte"
  import { createDataProviderStore } from "./stores/dataProvider"

  export let row

  const dataProviderStore = createDataProviderStore()
  setContext("data", dataProviderStore)

  onMount(async () => {
    await dataProviderStore.actions.setRow(row)
  })
</script>

<slot />
