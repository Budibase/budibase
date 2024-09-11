<script>
  import { onMount, onDestroy } from "svelte"
  import IndicatorSet from "./IndicatorSet.svelte"
  import { dndIsDragging, hoverStore, builderStore } from "stores"

  $: componentId = $hoverStore.hoveredComponentId
  $: selectedComponentId = $builderStore.selectedComponentId
  $: selected = componentId === selectedComponentId

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
      const element = e.target.closest(".interactive.component:not(.root)")
      newId = element?.dataset?.id
    }

    if (newId !== componentId) {
      hoverStore.actions.hoverComponent(newId)
    }
  }

  const onMouseLeave = () => {
    hoverStore.actions.hoverComponent(null)
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
  zIndex={selected ? 890 : 910}
  allowResizeAnchors
/>
