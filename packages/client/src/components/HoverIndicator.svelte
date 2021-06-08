<script>
  import { onMount, onDestroy } from "svelte"
  import { builderStore } from "../store"
  import Indicator from "./Indicator.svelte"

  const offset = 2
  let indicators = []
  let interval
  let componentId
  let componentName

  const updatePosition = () => {
    let newIndicators = []

    if (componentId) {
      const parents = document.getElementsByClassName(componentId)

      // Batch reads to minimize reflow
      const scrollX = window.scrollX
      const scrollY = window.scrollY

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
    }

    indicators = newIndicators
  }

  const onMouseOver = e => {
    const element = e.target.closest("[data-type='component']")
    componentId = element?.dataset?.id
    componentName = element?.dataset?.name
  }

  const onMouseLeave = () => {
    componentId = null
    componentName = null
  }

  onMount(() => {
    interval = setInterval(updatePosition, 100)
    window.addEventListener("mouseover", onMouseOver)
    document.documentElement.addEventListener("mouseleave", onMouseLeave)
  })

  onDestroy(() => {
    clearInterval(interval)
    window.removeEventListener("mouseover", onMouseOver)
    document.documentElement.removeEventListener("mouseleave", onMouseLeave)
  })
</script>

{#if componentId !== $builderStore.selectedComponentId}
  {#each indicators as indicator, idx}
    <Indicator
      top={indicator.top}
      left={indicator.left}
      width={indicator.width}
      height={indicator.height}
      text={idx === 0 ? componentName : null}
      color="rgb(120, 170, 244)"
    />
  {/each}
{/if}
