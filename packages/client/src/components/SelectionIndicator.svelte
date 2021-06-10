<script>
  import { onMount, onDestroy } from "svelte"
  import { builderStore } from "../store"
  import Indicator from "./Indicator.svelte"
  import { domDebounce } from "../utils/domDebounce"

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
          top: elBounds.top + scrollY - 2,
          left: elBounds.left + scrollX - 2,
          width: elBounds.width + 4,
          height: elBounds.height + 4,
        })
      }
    }
    indicators = newIndicators
  }
  const debouncedUpdate = domDebounce(updatePosition)

  onMount(() => {
    debouncedUpdate()
    interval = setInterval(debouncedUpdate, 100)
    document.addEventListener("scroll", debouncedUpdate, true)
  })

  onDestroy(() => {
    clearInterval(interval)
    document.removeEventListener("scroll", debouncedUpdate, true)
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
