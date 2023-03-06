<script>
  import { tourHandler } from "./tourHandler"
  import { TOURS } from "./tours"
  import { onMount, onDestroy } from "svelte"
  import { store } from "builderStore"

  export let tourStepKey

  let currentTourStep
  let ready = false
  let handler

  onMount(() => {
    if (!$store.tourKey) return

    currentTourStep = TOURS[$store.tourKey].find(
      step => step.id === tourStepKey
    )
    if (!currentTourStep) return

    const elem = document.querySelector(currentTourStep.query)
    handler = tourHandler(elem, tourStepKey)
    ready = true
  })
  onDestroy(() => {
    if (handler) {
      handler.destroy()
    }
  })
</script>

<slot />
