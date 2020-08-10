<script>
  import { store, backendUiStore } from "builderStore"
  import { goto, leftover } from "@sveltech/routify"
  import { onMount } from "svelte"

  async function selectModel(model) {
    backendUiStore.actions.models.select(model)
  }

  onMount(async () => {
    // navigate to first model in list, if not already selected
    // and this is the final url (i.e. no selectedModel)
    if (
      !$leftover &&
      $backendUiStore.models.length > 0 &&
      (!$backendUiStore.selectedModel || !$backendUiStore.selectedModel._id)
    ) {
      // this file routes as .../models/index, so, go up one.
      $goto(`../${$backendUiStore.models[0]._id}`)
    }
  })
</script>

{#if $backendUiStore.models.length === 0}
  Please create a table
{:else}
Please select a table
{/if}
