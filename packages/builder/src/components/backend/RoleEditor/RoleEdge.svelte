<script>
  import {
    getBezierPath,
    BaseEdge,
    EdgeLabelRenderer,
    useSvelteFlow,
  } from "@xyflow/svelte"
  import { Icon } from "@budibase/bbui"
  import { onMount } from "svelte"

  export let sourceX
  export let sourceY
  export let sourcePosition
  export let targetX
  export let targetY
  export let targetPosition
  export let id

  const flow = useSvelteFlow()

  let edgeHovered = false
  let labelHovered = false

  $: hovered = edgeHovered || labelHovered
  $: edgeClasses = getEdgeClasses(hovered, labelHovered)
  $: [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const getEdgeClasses = (hovered, labelHovered) => {
    let classes = ""
    if (hovered) classes += `hovered `
    if (labelHovered) classes += `delete `
    return classes
  }

  const onEdgeMouseOver = e => {
    edgeHovered = true
  }

  const onEdgeMouseOut = e => {
    edgeHovered = false
  }

  const deleteEdge = () => {
    flow.deleteElements({
      edges: [{ id }],
    })
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
    class:hovered
    on:click={deleteEdge}
    on:mouseover={() => (labelHovered = true)}
    on:mouseout={() => (labelHovered = false)}
  >
    <Icon name="Delete" />
  </div>
</EdgeLabelRenderer>

<style>
  .edge-label {
    position: absolute;
    padding: 8px;
    opacity: 0;
    pointer-events: all;
  }
  .edge-label:hover,
  .edge-label.hovered {
    opacity: 1;
    cursor: pointer;
  }
  .edge-label:hover :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-red-400);
  }
  .edge-label :global(.spectrum-Icon) {
    background: var(--background-color);
    color: var(--spectrum-global-color-gray-600);
  }
  :global(.svelte-flow__edge:hover .svelte-flow__edge-path),
  :global(.svelte-flow__edge-path.hovered) {
    stroke: var(--spectrum-global-color-blue-400);
  }
  :global(.svelte-flow__edge-path.hovered.delete) {
    stroke: var(--spectrum-global-color-red-400);
  }
</style>
