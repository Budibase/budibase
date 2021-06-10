<script>
  import { onMount, onDestroy } from "svelte"
  import { builderStore } from "../store"
  import Indicator from "./Indicator.svelte"
  import { domDebounce } from "../utils/domDebounce"

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
            top: elBounds.top + scrollY - 2,
            left: elBounds.left + scrollX - 2,
            width: elBounds.width + 4,
            height: elBounds.height + 4,
          })
        }
      }
    }

    indicators = newIndicators
  }
  const debouncedUpdate = domDebounce(updatePosition)

  const onMouseOver = e => {
    const element = e.target.closest("[data-type='component']")
    const newId = element?.dataset?.id
    const newName = element?.dataset?.name
    if (newId !== componentId) {
      componentId = newId
      componentName = newName
      debouncedUpdate()
    }
  }

  const onMouseLeave = () => {
    componentId = null
    componentName = null
  }

  onMount(() => {
    debouncedUpdate()
    interval = setInterval(debouncedUpdate, 100)
    document.addEventListener("mouseover", onMouseOver)
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("scroll", debouncedUpdate, true)
  })

  onDestroy(() => {
    clearInterval(interval)
    document.removeEventListener("mouseover", onMouseOver)
    document.removeEventListener("mouseleave", onMouseLeave)
    document.removeEventListener("scroll", debouncedUpdate, true)
  })
</script>

{#key componentId}
  {#if componentId !== $builderStore.selectedComponentId}
    {#each indicators as indicator, idx}
      <Indicator
        top={indicator.top}
        left={indicator.left}
        width={indicator.width}
        height={indicator.height}
        text={idx === 0 ? componentName : null}
        color="rgb(120, 170, 244)"
        transition
      />
    {/each}
  {/if}
{/key}
