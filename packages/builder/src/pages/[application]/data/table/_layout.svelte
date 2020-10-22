<script>
  import { backendUiStore } from "builderStore"
  import { goto, leftover } from "@sveltech/routify"
  import { onMount } from "svelte"

  async function selectTable(table) {
    backendUiStore.actions.tables.select(table)
  }

  onMount(async () => {
    // navigate to first table in list, if not already selected
    // and this is the final url (i.e. no selectedTable)
    if (
      !$leftover &&
      $backendUiStore.tables.length > 0 &&
      (!$backendUiStore.selectedTable || !$backendUiStore.selectedTable._id)
    ) {
      $goto(`./${$backendUiStore.tables[0]._id}`)
    }
  })
</script>

<div class="root">
  <slot />
</div>

<style>
  .root {
    height: 100%;
    position: relative;
  }
</style>
