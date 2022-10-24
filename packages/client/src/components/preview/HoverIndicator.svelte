<script>
  import { onMount, onDestroy } from "svelte"
  import IndicatorSet from "./IndicatorSet.svelte"
  import { builderStore, dndIsDragging } from "stores"

  let componentId

  $: zIndex = componentId === $builderStore.selectedComponentId ? 900 : 920

  const onMouseOver = e => {
    // Ignore if dragging
    if (e.buttons > 0) {
      return
    }

    let newId
    if (e.target.classList.contains("anchor")) {
      // Handle resize anchors
      newId = e.target.dataset.id
    } else {
      // Handle normal components
      const element = e.target.closest(".interactive.component")
      newId = element?.dataset?.id
    }

    if (newId !== componentId) {
      componentId = newId
    }
  }

  const onMouseLeave = () => {
    componentId = null
  }

  onMount(() => {
    document.addEventListener("mouseover", onMouseOver)
    document.body.addEventListener("mouseleave", onMouseLeave)
  })

  onDestroy(() => {
    document.removeEventListener("mouseover", onMouseOver)
    document.body.removeEventListener("mouseleave", onMouseLeave)
  })
</script>

<IndicatorSet
  componentId={$dndIsDragging ? null : componentId}
  color="var(--spectrum-global-color-static-blue-200)"
  transition
  {zIndex}
  allowResizeAnchors
/>
