<script>
  import { Heading, Helpers, notifications } from "@budibase/bbui"
  import { writable, derived } from "svelte/store"
  import {
    SvelteFlow,
    Background,
    BackgroundVariant,
    useSvelteFlow,
  } from "@xyflow/svelte"
  import "@xyflow/svelte/dist/style.css"
  import RoleNode from "./RoleNode.svelte"
  import EmptyStateNode from "./EmptyStateNode.svelte"
  import RoleEdge from "./RoleEdge.svelte"
  import BracketEdge from "./BracketEdge.svelte"
  import {
    autoLayout,
    getAdminPosition,
    getBasicPosition,
    rolesToLayout,
    nodeToRole,
    getBounds,
  } from "./utils"
  import { setContext, tick } from "svelte"
  import Controls from "./Controls.svelte"
  import { GridResolution, MaxAutoZoom, ZoomDuration } from "./constants"
  import { roles } from "@/stores/builder"
  import { Roles } from "@/constants/backend"
  import { getSequentialName } from "@/helpers/duplicate"
  import { derivedMemo } from "@budibase/frontend-core"

  const flow = useSvelteFlow()
  const edges = writable([])
  const nodes = writable([])
  const dragging = writable(false)

  // Derive the list of selected nodes
  const selectedNodes = derived(nodes, $nodes => {
    return $nodes.filter(node => node.selected).map(node => node.id)
  })

  // Derive the bounds of all custom role nodes
  const bounds = derivedMemo(nodes, getBounds)

  $: handleExternalRoleChanges($roles)
  $: updateBuiltins($bounds)

  // Updates nodes and edges based on external changes to roles
  const handleExternalRoleChanges = roles => {
    const currentNodes = $nodes
    const newLayout = autoLayout(rolesToLayout(roles))
    edges.set(newLayout.edges)

    // For nodes we want to persist some metadata if possible
    nodes.set(
      newLayout.nodes.map(node => {
        const currentNode = currentNodes.find(x => x.id === node.id)
        if (!currentNode) {
          return node
        }
        return {
          ...node,
          position: currentNode.position || node.position,
          selected: currentNode.selected || node.selected,
        }
      })
    )
  }

  // Positions the basic and admin role at either edge of the flow
  const updateBuiltins = bounds => {
    flow.updateNode(Roles.BASIC, {
      position: getBasicPosition(bounds),
    })
    flow.updateNode(Roles.ADMIN, {
      position: getAdminPosition(bounds),
    })
  }

  // Automatically lays out all roles and edges and zooms to fit them
  const layoutAndFit = () => {
    const layout = autoLayout({ nodes: $nodes, edges: $edges })
    nodes.set(layout.nodes)
    edges.set(layout.edges)
    flow.fitView({ maxZoom: MaxAutoZoom, duration: ZoomDuration })
  }

  const createRole = async () => {
    const roleId = Helpers.uuid()
    await roles.save({
      name: roleId,
      uiMetadata: {
        displayName: getSequentialName($roles, "New role ", {
          getName: role => role.uiMetadata.displayName,
        }),
        color: "var(--spectrum-global-color-gray-700)",
        description: "Custom role",
      },
      inherits: [Roles.BASIC],
    })
    await tick()
    layoutAndFit()

    // Select the new node
    nodes.update($nodes => {
      return $nodes.map(node => ({
        ...node,
        selected: node.id === roleId,
      }))
    })
  }

  const updateRole = async (roleId, metadata) => {
    const node = $nodes.find(node => node.id === roleId)
    if (!node) {
      return
    }
    // Update metadata immediately, before saving
    if (metadata) {
      flow.updateNodeData(roleId, metadata)
    }
    try {
      await roles.save(nodeToRole({ node, edges: $edges }))
      layoutAndFit()
    } catch (error) {
      notifications.error(error?.message || error || "Failed to update role")
      handleExternalRoleChanges($roles)
    }
  }

  const deleteRole = async roleId => {
    nodes.set($nodes.filter(node => node.id !== roleId))
    layoutAndFit()
    const role = $roles.find(role => role._id === roleId)
    if (role) {
      roles.delete(role)
    }
  }

  const deleteEdge = async edgeId => {
    const edge = $edges.find(edge => edge.id === edgeId)
    edges.set($edges.filter(edge => edge.id !== edgeId))
    await updateRole(edge.target)
  }

  const onConnect = async connection => {
    await updateRole(connection.target)
  }

  setContext("flow", {
    nodes,
    edges,
    dragging,
    selectedNodes,
    bounds,
    createRole,
    updateRole,
    deleteRole,
    deleteEdge,
    layoutAndFit,
  })
</script>

<div class="title">
  <div class="heading" />
</div>
<div class="flow">
  <SvelteFlow
    fitView
    {nodes}
    {edges}
    snapGrid={[GridResolution, GridResolution]}
    nodeTypes={{ role: RoleNode, empty: EmptyStateNode }}
    edgeTypes={{ role: RoleEdge, bracket: BracketEdge }}
    proOptions={{ hideAttribution: true }}
    fitViewOptions={{ maxZoom: MaxAutoZoom }}
    defaultEdgeOptions={{ type: "role", animated: true, selectable: false }}
    onconnectstart={() => dragging.set(true)}
    onconnectend={() => dragging.set(false)}
    onconnect={onConnect}
    deleteKey={null}
  >
    <Background variant={BackgroundVariant.Dots} />
    <Controls />
    <div class="title">
      <Heading size="S">Manage roles</Heading>
    </div>
    <div class="footer">Roles inherit permissions from each other</div>
  </SvelteFlow>
</div>

<style>
  .flow {
    margin: -28px -40px -40px -40px;
    flex: 1 1 auto;
    overflow: hidden;
    position: relative;
    --background-color: var(--spectrum-global-color-gray-50);
    --border-color: var(--spectrum-global-color-gray-300);
    --edge-color: var(--spectrum-global-color-gray-500);
    --handle-color: var(--spectrum-global-color-gray-600);
    --selected-color: var(--spectrum-global-color-blue-400);
  }
  .title {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
  }
  .footer {
    position: absolute;
    left: 20px;
    bottom: 20px;
    color: var(--spectrum-global-color-gray-600);
    z-index: 10;
  }

  /* Customise svelte-flow theme */
  .flow :global(.svelte-flow) {
    /* Panel */
    --xy-background-color: var(--background-color);

    /* Controls */
    --xy-controls-button-border-color: var(--border-color);

    /* Handles */
    --xy-handle-background-color: var(--handle-color);
    --xy-handle-border-color: var(--handle-color);

    /* Edges */
    --xy-edge-stroke: var(--edge-color);
    --xy-edge-stroke-selected: var(--edge-color);
    --xy-edge-stroke-width: 2px;
  }
</style>
