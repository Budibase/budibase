<script>
  import { screenHistoryStore } from "builderStore"
  import { isActive } from "@roxi/routify"
  import { Icon } from "@budibase/bbui"
  import { onMount } from "svelte"

  const handleKeyPress = e => {
    if (!(e.ctrlKey || e.metaKey)) {
      return
    }
    if (e.shiftKey && e.key === "Z") {
      screenHistoryStore.redo()
    } else if (e.key === "z") {
      screenHistoryStore.undo()
    }
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeyPress)

    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  })
</script>

{#if $isActive("./screens") || $isActive("./components")}
  <div class="undo-redo">
    <Icon
      name="Undo"
      hoverable
      on:click={screenHistoryStore.undo}
      disabled={!$screenHistoryStore.canUndo}
      tooltip="Undo latest change"
    />
    <Icon
      name="Redo"
      hoverable
      on:click={screenHistoryStore.redo}
      disabled={!$screenHistoryStore.canRedo}
      tooltip="Redo latest undo"
    />
  </div>
{/if}

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
