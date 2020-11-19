<script>
  import { setContext, onMount } from "svelte"
  import { createDataProviderStore } from "./stores/dataProvider"

  const dataProviderStore = createDataProviderStore()
  setContext("data", dataProviderStore)

  export let row
  let loaded = false

  onMount(async () => {
    await dataProviderStore.actions.setRow(row)
    loaded = true
  })
</script>

{#if loaded}
  <slot />
{/if}
