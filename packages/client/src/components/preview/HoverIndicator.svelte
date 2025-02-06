<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import IndicatorSet from "./IndicatorSet.svelte"
  import { dndIsDragging, hoverStore, builderStore } from "@/stores"

  $: componentId = $hoverStore.hoveredComponentId
  $: selectedComponentId = $builderStore.selectedComponentId
  $: selected = componentId === selectedComponentId

  const onMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement

    // Ignore if dragging
    if (e.buttons > 0) {
      return
    }

    let newId
    if (target.classList.contains("anchor")) {
      // Handle resize anchors
      newId = target.dataset.id
    } else {
      // Handle normal components
      const element = target.closest(".interactive.component:not(.root)")
      if (element instanceof HTMLElement) {
        newId = element.dataset?.id
      }
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

{#if !$dndIsDragging && componentId}
  <IndicatorSet
    {componentId}
    color="var(--spectrum-global-color-static-blue-200)"
    zIndex={selected ? 890 : 910}
    allowResizeAnchors
  />
{/if}}
