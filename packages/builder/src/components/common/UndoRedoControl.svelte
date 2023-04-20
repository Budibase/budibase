<script>
  import { Icon } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { _ } from "../../../lang/i18n"

  export let store

  const handleKeyPress = e => {
    if (!(e.ctrlKey || e.metaKey)) {
      return
    }
    if (e.shiftKey && e.key === "Z") {
      store.redo()
    } else if (e.key === "z") {
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
    tooltip={$_("components.common.UndoRedoControl.Undo_change")}
  />
  <Icon
    name="Redo"
    hoverable
    on:click={store.redo}
    disabled={!$store.canRedo}
    tooltip={$_("components.common.UndoRedoControl.Redo_change")}
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
