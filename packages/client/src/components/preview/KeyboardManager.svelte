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
    const state = get(builderStore)
    if (!state.inBuilder || state.editMode) {
      return
    }
    const activeTag = document.activeElement?.tagName.toLowerCase()
    if (["input", "textarea"].indexOf(activeTag) !== -1) {
      return
    }

    // Need to manually block certain keys from propagating to the browser
    if (e.ctrlKey && e.key === "d") {
      e.preventDefault()
    }

    builderStore.actions.keyDown(e.key, e.ctrlKey)
  }
</script>
