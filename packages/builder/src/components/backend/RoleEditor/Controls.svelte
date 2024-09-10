<script>
  import { Button, Helpers, ActionButton } from "@budibase/bbui"
  import { useSvelteFlow, Position } from "@xyflow/svelte"
  import { getContext } from "svelte"
  import { dagreLayout } from "./layout"

  const { nodes, edges } = getContext("flow")
  const flow = useSvelteFlow()

  const addRole = () => {
    nodes.update(state => [
      ...state,
      {
        id: Helpers.uuid(),
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        type: "role",
        data: {
          label: "New role",
          description: "Custom role",
          custom: true,
        },
        position: { x: 0, y: 0 },
      },
    ])
    autoLayout()
  }

  const autoLayout = () => {
    const layout = dagreLayout({ nodes: $nodes, edges: $edges })
    nodes.set(layout.nodes)
    edges.set(layout.edges)
    flow.fitView({ maxZoom: 1 })
  }
</script>

<div class="control top-left">
  <div class="group">
    <ActionButton icon="Add" quiet on:click={flow.zoomIn} />
    <ActionButton icon="Remove" quiet on:click={flow.zoomOut} />
  </div>
  <Button secondary on:click={() => flow.fitView({ maxZoom: 1 })}>
    Zoom to fit
  </Button>
  <Button secondary on:click={autoLayout}>Auto layout</Button>
</div>
<div class="control bottom-right">
  <Button icon="Add" cta on:click={addRole}>Add role</Button>
</div>

<style>
  .control {
    position: absolute;
    z-index: 999;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
  .top-left {
    top: 20px;
    left: 20px;
  }
  .bottom-right {
    bottom: 20px;
    right: 20px;
  }
  .top-left :global(.spectrum-Button),
  .top-left :global(.spectrum-ActionButton),
  .top-left :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-900) !important;
  }
  .top-left :global(.spectrum-Button),
  .top-left :global(.spectrum-ActionButton) {
    background: var(--spectrum-global-color-gray-200) !important;
  }
  .top-left :global(.spectrum-Button:hover),
  .top-left :global(.spectrum-ActionButton:hover) {
    background: var(--spectrum-global-color-gray-300) !important;
  }
  .group {
    border-radius: 4px;
    display: flex;
    flex-direction: row;
  }
  .group :global(> *:not(:first-child)) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 2px solid var(--spectrum-global-color-gray-300);
  }
  .group :global(> *:not(:last-child)) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
