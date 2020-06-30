<script>
  import { store, backendUiStore } from "builderStore"
  import { goto, leftover } from "@sveltech/routify"
  import { onMount } from "svelte"

  async function selectModel(model) {
    backendUiStore.actions.models.select(model)
  }

  onMount(async () => {
    if (!$leftover && $backendUiStore.models.length > 0 && (!$backendUiStore.selectedModel || !$backendUiStore.selectedModel._id)) {
      $goto(`../${$backendUiStore.models[0]._id}`)
    }
  })
</script>

{#if $backendUiStore.models.length === 0}
Please create a model
{:else}
Please select a model
{/if}
