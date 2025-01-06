<script>
  import { tourHandler } from "./tourHandler"
  import { TOURSBYSTEP, TOURS, getCurrentStepIdx } from "./tours"
  import { onMount, onDestroy } from "svelte"
  import { builderStore } from "@/stores/builder"

  export let stepKeys = []

  let ready = false
  let registered = {}

  const registerTourNode = (tourKey, stepKey) => {
    const step = TOURSBYSTEP[stepKey]
    if (ready && step && !registered[stepKey] && step?.tour === tourKey) {
      const elem = document.querySelector(step.query)
      registered[stepKey] = tourHandler(elem, stepKey)
    }
  }

  const scrollToStep = () => {
    let tourStepIdx = getCurrentStepIdx(
      TOURS[tourKeyWatch]?.steps,
      tourStepKeyWatch
    )
    let currentStep = TOURS[tourKeyWatch]?.steps?.[tourStepIdx]
    if (currentStep?.scrollIntoView) {
      let currentNode = $builderStore.tourNodes?.[currentStep.id]
      if (currentNode) {
        currentNode.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  $: tourKeyWatch = $builderStore.tourKey
  $: tourStepKeyWatch = $builderStore.tourStepKey
  $: if (tourKeyWatch || stepKeys || ready) {
    stepKeys.forEach(tourStepKey => {
      registerTourNode(tourKeyWatch, tourStepKey)
    })
  }
  $: scrollToStep(tourKeyWatch, tourStepKeyWatch)

  onMount(() => {
    ready = true
  })

  onDestroy(() => {
    Object.entries(registered).forEach(entry => {
      const handler = entry[1]
      const stepKey = entry[0]
      // Run step destroy, de-register nodes in the builderStore and local cache
      handler.destroy()
      delete registered[stepKey]

      // Check if the step is part of an active tour. End the tour if that is the case
      const step = TOURSBYSTEP[stepKey]
      if (step.tour === tourKeyWatch) {
        builderStore.setTour()
      }
    })
  })
</script>

<slot />
