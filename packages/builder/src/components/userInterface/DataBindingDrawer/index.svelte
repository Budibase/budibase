<script>
  import BottomDrawer from "components/common/BottomDrawer.svelte"
  import { store, backendUiStore } from "builderStore"
  import { slide } from "svelte/transition"
  import QueryInterface from "components/integration/QueryViewer.svelte"

  $: query = $backendUiStore.queries.find(
    query => query._id === $backendUiStore.selectedQueryId
  )

  function closeDatabindingDrawer() {
    store.update(state => {
      state.bindingDrawerVisible = false
      return state
    })
  }
</script>

{#if query}
  <BottomDrawer>
    <div class="drawer-contents">
      <i class="ri-close-fill close" on:click={closeDatabindingDrawer} />
      <QueryInterface {query} />
    </div>
  </BottomDrawer>
{/if}

<style>
  i {
    position: absolute;
    top: var(--spacing-xl);
    right: var(--spacing-xl);
    font-size: var(--font-size-m);
  }
</style>
