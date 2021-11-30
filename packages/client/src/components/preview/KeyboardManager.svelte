<script>
  import { onMount, onDestroy } from "svelte"
  import { get } from "svelte/store"
  import { builderStore } from "stores"

  onMount(() => {
    if (get(builderStore).inBuilder) {
      document.addEventListener("keydown", onKeyDown)
    }
  })

  onDestroy(() => {
    if (get(builderStore).inBuilder) {
      document.removeEventListener("keydown", onKeyDown)
    }
  })

  const onKeyDown = e => {
    if (e.key === "Delete" || e.key === "Backspace") {
      deleteSelectedComponent()
    }
  }

  const deleteSelectedComponent = () => {
    const state = get(builderStore)
    if (!state.inBuilder || !state.selectedComponentId || state.editMode) {
      return
    }
    const activeTag = document.activeElement?.tagName.toLowerCase()
    if (["input", "textarea"].indexOf(activeTag) !== -1) {
      return
    }
    builderStore.actions.deleteComponent(state.selectedComponentId)
  }
</script>
