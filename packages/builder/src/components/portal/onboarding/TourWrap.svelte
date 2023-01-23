<script>
  import { tourHandler } from "./tourHandler"
  import { TOURS } from "./tours"
  import { onMount, onDestroy } from "svelte"
  import { store } from "builderStore"

  export let tourStepKey

  let currentTour
  let ready = false
  let handler

  onMount(() => {
    if (!$store.tourKey) return

    currentTour = TOURS[$store.tourKey].find(step => step.id === tourStepKey)

    const elem = document.querySelector(currentTour.query)
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
