<script>
  import { Icon, ActionButton } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { isBuilderInputFocused } from "@/helpers"

  export let store
  export let showButtonGroup = false

  const handleKeyPress = e => {
    if (!(e.ctrlKey || e.metaKey)) {
      return
    }

    let keyLowerCase = e.key.toLowerCase()

    // Ignore events when typing
    if (isBuilderInputFocused(e)) {
      return
    }
    if (e.shiftKey && keyLowerCase === "z") {
      store.redo()
    } else if (keyLowerCase === "z") {
      store.undo()
    }
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeyPress)

    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  })
</script>

<div class="undo-redo" class:buttons={showButtonGroup}>
  {#if showButtonGroup}
    <div class="group">
      <ActionButton
        icon="Undo"
        quiet
        on:click={store.undo}
        disabled={!$store.canUndo}
      />
      <ActionButton
        icon="Redo"
        quiet
        on:click={store.redo}
        disabled={!$store.canRedo}
      />
    </div>
  {:else}
    <Icon
      name="Undo"
      hoverable
      on:click={store.undo}
      disabled={!$store.canUndo}
    />
    <Icon
      name="Redo"
      hoverable
      on:click={store.redo}
      disabled={!$store.canRedo}
    />
  {/if}
</div>

<style>
  .undo-redo {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
    padding-right: var(--spacing-xl);
    border-right: var(--border-light);
  }
  .undo-redo :global(svg) {
    padding: 6px;
  }

  .undo-redo.buttons :global(svg) {
    padding: 0px;
  }

  .undo-redo.buttons {
    padding-right: 0px;
  }

  .group {
    border-radius: 4px;
    display: flex;
    flex-direction: row;
  }
  .group :global(> *:not(:first-child)) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 2px solid var(--spectrum-global-color-gray-300);
  }
  .group :global(> *:not(:last-child)) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .group :global(.spectrum-Button),
  .group :global(.spectrum-ActionButton) {
    background: var(--spectrum-global-color-gray-200) !important;
  }
  .group :global(.spectrum-Button:hover),
  .group :global(.spectrum-ActionButton:hover) {
    background: var(--spectrum-global-color-gray-300) !important;
  }
</style>
