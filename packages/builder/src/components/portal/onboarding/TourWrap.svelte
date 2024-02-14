<script>
  import { tourHandler } from "./tourHandler"
  import { TOURSBYSTEP } from "./tours"
  import { onMount, onDestroy } from "svelte"
  import { builderStore } from "stores/builder"

  export let stepKeys = []

  let ready = false
  let handler
  let registered = []

  const registerTourNode = (tourKey, stepKey) => {
    const step = TOURSBYSTEP[stepKey]
    if (
      ready &&
      step &&
      !registered.includes(stepKey) &&
      step?.tour === tourKey
    ) {
      const elem = document.querySelector(step.query)
      handler = tourHandler(elem, stepKey)
      registered.push(stepKey)
    }
  }

  $: tourKeyWatch = $builderStore.tourKey
  $: if (tourKeyWatch || stepKeys || ready) {
    stepKeys.forEach(tourStepKey => {
      registerTourNode(tourKeyWatch, tourStepKey)
    })
  }

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
