<script>
  import { tourHandler } from "./tourHandler"
  import { TOURS } from "./tours"
  import { onMount, onDestroy } from "svelte"
  import { store } from "builderStore"

  export let tourStepKey

  let currentTourStep
  let ready = false
  let registered = false
  let handler

  const registerTourNode = (tourKey, stepKey) => {
    if (ready && !registered && tourKey) {
      currentTourStep = TOURS[tourKey].steps.find(step => step.id === stepKey)
      if (!currentTourStep) {
        return
      }
      const elem = document.querySelector(currentTourStep.query)
      handler = tourHandler(elem, stepKey)
      registered = true
    }
  }

  $: tourKeyWatch = $store.tourKey
  $: registerTourNode(tourKeyWatch, tourStepKey, ready)

  onMount(() => {
    ready = true
  })

  onDestroy(() => {
    if (handler) {
      handler.destroy()
    }
  })
</script>

<slot />
