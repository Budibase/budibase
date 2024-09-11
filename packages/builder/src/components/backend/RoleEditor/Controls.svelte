<script>
  import { Button, Helpers, ActionButton } from "@budibase/bbui"
  import { useSvelteFlow, Position } from "@xyflow/svelte"
  import { getContext, tick } from "svelte"
  import { autoLayout, roleToNode } from "./layout"
  import { ZoomDuration } from "./constants"
  import { getSequentialName } from "helpers/duplicate"
  import { roles } from "stores/builder"
  import { Roles } from "constants/backend"

  const { nodes, edges } = getContext("flow")
  const flow = useSvelteFlow()

  const addRole = async () => {
    const role = {
      name: Helpers.uuid(),
      displayName: getSequentialName($nodes, "New role ", {
        getName: x => x.data.displayName,
      }),
      color: "var(--spectrum-global-color-gray-700)",
      description: "Custom role",
      permissionId: "write",
      inherits: Roles.BASIC,
    }
    const savedRole = await roles.save(role)
    nodes.update(state => [...state, roleToNode(savedRole)])
    await doAutoLayout()
  }

  const doAutoLayout = async () => {
    const layout = autoLayout({ nodes: $nodes, edges: $edges })
    nodes.set(layout.nodes)
    edges.set(layout.edges)
    await tick()
    flow.fitView({
      maxZoom: 1,
      duration: ZoomDuration,
    })
  }
</script>

<div class="control top-left">
  <div class="group">
    <ActionButton
      icon="Add"
      quiet
      on:click={() => flow.zoomIn({ duration: ZoomDuration })}
    />
    <ActionButton
      icon="Remove"
      quiet
      on:click={() => flow.zoomOut({ duration: ZoomDuration })}
    />
  </div>
  <Button
    secondary
    on:click={() => flow.fitView({ maxZoom: 1, duration: ZoomDuration })}
  >
    Zoom to fit
  </Button>
  <Button secondary on:click={doAutoLayout}>Auto layout</Button>
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
