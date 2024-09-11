<script>
  import { Heading, Helpers } from "@budibase/bbui"
  import { derived, writable } from "svelte/store"
  import { SvelteFlow, Background, BackgroundVariant } from "@xyflow/svelte"
  import "@xyflow/svelte/dist/style.css"
  import RoleNode from "./RoleNode.svelte"
  import { rolesToLayout, dagreLayout, layoutToRoles } from "./layout"
  import { onMount, setContext, tick } from "svelte"
  import Controls from "./Controls.svelte"
  import { Roles } from "constants/backend"
  import { derivedMemo } from "@budibase/frontend-core"

  const nodes = writable([])
  const edgeStore = writable([])
  const enrichedEdges = derived([edgeStore, nodes], ([$edgeStore, $nodes]) => {
    let additions = []
    for (let node of $nodes) {
      // If a certain node does not inherit anything, make it inherit basic
      if (
        !$edgeStore.some(x => x.target === node.id) &&
        node.id !== Roles.BASIC
      ) {
        additions.push({
          id: Helpers.uuid(),
          source: Roles.BASIC,
          target: node.id,
          animated: true,
        })
      }
    }
    return [...$edgeStore, ...additions]
  })
  const edges = {
    ...edgeStore,
    subscribe: enrichedEdges.subscribe,
  }

  const roles = derivedMemo([nodes, edges], ([$nodes, $edges]) => {
    return layoutToRoles({ nodes: $nodes, edges: $edges })
  })
  $: console.log("new roles", $roles)

  setContext("flow", {
    nodes,
    edges,
    autoLayout: async () => {
      const layout = dagreLayout({ nodes: $nodes, edges: $edges })
      nodes.set(layout.nodes)
      edges.set(layout.edges)
    },
  })

  onMount(() => {
    const layout = dagreLayout(rolesToLayout())
    nodes.set(layout.nodes)
    edges.set(layout.edges)
  })
</script>

<div class="title">
  <div class="heading">
    <Heading size="S">Manage roles</Heading>
  </div>
  <div class="description">Roles inherit permissions from each other.</div>
</div>
<div class="flow">
  <SvelteFlow
    fitView
    {nodes}
    {edges}
    snapGrid={[25, 25]}
    nodeTypes={{ role: RoleNode }}
    proOptions={{ hideAttribution: true }}
    fitViewOptions={{ maxZoom: 1 }}
    defaultEdgeOptions={{ type: "bezier", animated: true }}
    on:nodeclick={event => console.log("on node click", event.detail.node)}
  >
    <Background variant={BackgroundVariant.Dots} />
    <Controls />
  </SvelteFlow>
</div>

<style>
  .heading {
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    margin-bottom: 20px;
    padding-bottom: 12px;
  }
  .description {
    color: var(--spectrum-global-color-gray-600);
    margin-bottom: calc(20px - var(--spacing-l));
  }
  .flow {
    flex: 1 1 auto;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    --background-color: var(--spectrum-global-color-gray-50);
    --node-background: var(--spectrum-global-color-gray-100);
    --node-background-hover: var(--spectrum-global-color-gray-300);
    --border-color: var(--spectrum-global-color-gray-300);
    --edge-color: var(--spectrum-global-color-gray-500);
    --handle-color: var(--spectrum-global-color-gray-600);
    --selected-color: var(--spectrum-global-color-blue-400);
  }
  .flow :global(.svelte-flow) {
    /* Panel */
    --xy-background-color: var(--background-color);
    --xy-background-pattern-color-props: transparent;

    /* Controls */
    --xy-controls-button-background-color: var(--node-background);
    --xy-controls-button-background-color-hover: var(--node-background-hover);
    --xy-controls-button-border-color: var(--border-color);

    /* Handles */
    --xy-handle-background-color: var(--handle-color);
    --xy-handle-border-color: var(--handle-color);

    /* Edges */
    --xy-edge-stroke: var(--edge-color);
    --xy-edge-stroke-selected: var(--selected-color);

    /* Minimap */
    /* --xy-minimap-background-color-props: var(--node-background);
    --xy-minimap-mask-background-color-props: var(--translucent-grey); */
  }

  /* Arrow edge markers */
  /* .flow :global(.svelte-flow__arrowhead > polyline) {
    fill: var(--edge-color);
    stroke: var(--edge-color);
  } */
</style>
