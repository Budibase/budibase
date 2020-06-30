<script>
  import { backendUiStore } from "builderStore"
  import { goto, leftover } from "@sveltech/routify"
  import { onMount } from "svelte"

  async function selectModel(model) {
    backendUiStore.actions.models.select(model)
  }

  onMount(async () => {
    if (!$leftover && $backendUiStore.models.length > 0 && (!$backendUiStore.selectedModel || !$backendUiStore.selectedModel._id)) {
      $goto(`./${$backendUiStore.models[0]._id}`)
    }
  })
</script>

<div class="root">
  <div class="node-view">
    <slot />
  </div>
</div>

<style>
  .root {
    height: 100%;
    position: relative;
  }

  .node-view {
    overflow-y: auto;
    flex: 1 1 auto;
  }
</style>
