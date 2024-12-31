<script>
  import { getBezierPath, BaseEdge, EdgeLabelRenderer } from "@xyflow/svelte"
  import { Icon, TooltipPosition } from "@budibase/bbui"
  import { getContext, onMount } from "svelte"
  import { roles } from "@/stores/builder"

  export let sourceX
  export let sourceY
  export let sourcePosition
  export let targetX
  export let targetY
  export let targetPosition
  export let id
  export let source
  export let target

  const { deleteEdge, selectedNodes } = getContext("flow")

  let iconHovered = false
  let edgeHovered = false

  $: hovered = iconHovered || edgeHovered
  $: active =
    hovered ||
    $selectedNodes.includes(source) ||
    $selectedNodes.includes(target)
  $: edgeClasses = getEdgeClasses(active, iconHovered)
  $: [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  $: sourceRole = $roles.find(x => x._id === source)
  $: targetRole = $roles.find(x => x._id === target)
  $: tooltip =
    sourceRole && targetRole
      ? `Stop ${targetRole.uiMetadata.displayName} from inheriting ${sourceRole.uiMetadata.displayName}`
      : null

  const getEdgeClasses = (active, iconHovered) => {
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
<EdgeLabelRenderer>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <div
    style:transform="translate(-50%, -50%) translate({labelX}px,{labelY}px)"
    class="edge-label nodrag nopan"
    class:active
    on:click={() => deleteEdge(id)}
    on:mouseover={() => (iconHovered = true)}
    on:mouseout={() => (iconHovered = false)}
  >
    <Icon
      name="Delete"
      size="S"
      {tooltip}
      tooltipPosition={TooltipPosition.Top}
    />
  </div>
</EdgeLabelRenderer>

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
  .edge-label:hover :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-red-400);
  }
  .edge-label :global(.spectrum-Icon) {
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
