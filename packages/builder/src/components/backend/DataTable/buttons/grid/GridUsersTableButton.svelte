<script>
  import { ActionButton } from "@budibase/bbui"
  import { createEventDispatcher, tick } from "svelte"
  import { bb } from "@/stores/bb"

  export let highlighted = false
  const dispatch = createEventDispatcher()

  const openUserSettings = async () => {
    dispatch("manage")
    bb.settings()
    await tick()
    bb.settings("/people/workspace")
  }
</script>

<div class="manage-access-button" class:highlighted>
  <ActionButton on:click={openUserSettings} icon="lock-simple-open" quiet>
    Manage
  </ActionButton>
</div>

<style>
  .manage-access-button.highlighted :global(button.spectrum-ActionButton) {
    border: 1px solid var(--spectrum-global-color-blue-500);
    background: transparent;
  }

  .manage-access-button.highlighted
    :global(button.spectrum-ActionButton:hover:not(:disabled)) {
    border: 1px solid var(--spectrum-global-color-blue-600);
    background: transparent;
  }
</style>
