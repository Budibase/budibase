<script lang="ts">
  import {
    getBezierPath,
    BaseEdge,
    EdgeLabel,
    type EdgeProps,
  } from "@xyflow/svelte"
  import { Icon, TooltipPosition } from "@budibase/bbui"
  import { getContext, onMount } from "svelte"
  import { roles } from "@/stores/builder"
  import type { Writable } from "svelte/store"

  let {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    id,
    source,
    target,
  }: EdgeProps = $props()

  const { deleteEdge, selectedNodes } = getContext<{
    deleteEdge: (id: string) => void
    selectedNodes: Writable<string[]>
  }>("flow")

  let iconHovered = $state(false)
  let edgeHovered = $state(false)

  let hovered = $derived(iconHovered || edgeHovered)
  let active = $derived(
    hovered ||
      $selectedNodes.includes(source) ||
      $selectedNodes.includes(target)
  )
  let edgeClasses = $derived(getEdgeClasses(active, iconHovered))
  let [edgePath, labelX, labelY] = $derived(
    getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    })
  )
  let sourceRole = $derived($roles.find(x => x._id === source))
  let targetRole = $derived($roles.find(x => x._id === target))
  let tooltip = $derived(
    sourceRole && targetRole
      ? `Stop ${targetRole.uiMetadata.displayName} from inheriting ${sourceRole.uiMetadata.displayName}`
      : null
  )

  function getEdgeClasses(active: boolean, iconHovered: boolean) {
    let classes = ""
    if (active) classes += `active `
    if (iconHovered) classes += `delete `
    return classes
  }

  const onEdgeMouseOver = () => {
    edgeHovered = true
  }

  const onEdgeMouseOut = () => {
    edgeHovered = false
  }

  onMount(() => {
    const edge = document.querySelector(`.svelte-flow__edge[data-id="${id}"]`)
    if (edge) {
      edge.addEventListener("mouseover", onEdgeMouseOver)
      edge.addEventListener("mouseout", onEdgeMouseOut)
    }
    return () => {
      if (edge) {
        edge.removeEventListener("mouseover", onEdgeMouseOver)
        edge.removeEventListener("mouseout", onEdgeMouseOut)
      }
    }
  })
</script>

<BaseEdge path={edgePath} class={edgeClasses} />
<EdgeLabel x={labelX} y={labelY}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_mouse_events_have_key_events -->
  <div
    class="edge-label nodrag nopan"
    class:active
    onclick={() => deleteEdge(id)}
    onmouseover={() => (iconHovered = true)}
    onmouseout={() => (iconHovered = false)}
  >
    <Icon
      name="trash"
      size="S"
      tooltip={tooltip || undefined}
      tooltipPosition={TooltipPosition.Top}
    />
  </div>
</EdgeLabel>

<style>
  .edge-label {
    position: absolute;
    padding: 8px;
    opacity: 0;
    pointer-events: none;
  }
  .edge-label.active {
    opacity: 1;
    pointer-events: all;
    cursor: pointer;
  }
  .edge-label:hover :global(i) {
    color: var(--spectrum-global-color-red-400);
  }
  .edge-label :global(i) {
    background: var(--background-color);
    color: var(--spectrum-global-color-gray-600);
  }
  .edge-label :global(svg) {
    padding: 4px;
  }
  :global(.svelte-flow__edge-path.active) {
    stroke: var(--spectrum-global-color-blue-400);
  }
  :global(.svelte-flow__edge-path.active.delete) {
    stroke: var(--spectrum-global-color-red-400);
  }
</style>
