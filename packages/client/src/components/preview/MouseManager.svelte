<script>
  import { onMount, onDestroy } from "svelte"
  import { get } from "svelte/store"
  import { builderStore } from "stores"

  onMount(() => {
    if (get(builderStore).inBuilder) {
      document.addEventListener("click", onClick)
    }
  })

  onDestroy(() => {
    if (get(builderStore).inBuilder) {
      document.removeEventListener("click", onClick)
    }
  })

  const onClick = () => {
    const state = get(builderStore)
    if (!state.inBuilder || state.editMode) {
      return
    }
    builderStore.actions.click()
  }
</script>
