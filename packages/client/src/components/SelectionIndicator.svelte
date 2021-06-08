<script>
  import { onMount, onDestroy } from "svelte"
  import { builderStore } from "../store"
  import Indicator from "./Indicator.svelte"

  const offset = 2
  let indicators = []
  let interval

  const updatePosition = () => {
    const id = $builderStore.selectedComponentId
    const parents = document.getElementsByClassName(id)

    // Batch reads to minimize reflow
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    let newIndicators = []
    for (let i = 0; i < parents.length; i++) {
      const child = parents[i]?.childNodes?.[0]
      if (child) {
        const elBounds = child.getBoundingClientRect()
        newIndicators.push({
          top: elBounds.top + scrollY - offset * 2,
          left: elBounds.left + scrollX - offset * 2,
          width: elBounds.width + offset * 2,
          height: elBounds.height + offset * 2,
        })
      }
    }
    indicators = newIndicators
  }

  onMount(() => {
    interval = setInterval(updatePosition, 100)
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

{#each indicators as indicator, idx}
  <Indicator
    top={indicator.top}
    left={indicator.left}
    width={indicator.width}
    height={indicator.height}
    text={idx === 0 ? $builderStore.selectedComponent._instanceName : null}
    color="rgb(66, 133, 244)"
  />
{/each}
