<script>
  import { Icon } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { isBuilderInputFocused } from "helpers"

  export let store

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

<div class="undo-redo">
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
</style>
