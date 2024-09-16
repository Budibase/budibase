<script>
  import { Heading, Helpers } from "@budibase/bbui"
  import { writable, derived } from "svelte/store"
  import {
    SvelteFlow,
    Background,
    BackgroundVariant,
    Position,
    useSvelteFlow,
  } from "@xyflow/svelte"
  import "@xyflow/svelte/dist/style.css"
  import RoleNode from "./RoleNode.svelte"
  import RoleEdge from "./RoleEdge.svelte"
  import { autoLayout } from "./layout"
  import { setContext } from "svelte"
  import Controls from "./Controls.svelte"
  import { GridResolution, MaxAutoZoom } from "./constants"
  import { roles } from "stores/builder"
  import { Roles } from "constants/backend"
  import { getSequentialName } from "helpers/duplicate"
  import { meta } from "@roxi/routify"

  const flow = useSvelteFlow()
  const nodes = writable([])
  const edges = writable([])
  const dragging = writable(false)
  const selectedNode = derived(
    nodes,
    $nodes => $nodes.find(x => x.selected)?.id
  )

  // Ensure role changes are synced with nodes and edges
  $: handleExternalRoleChanges($roles)

  // Converts a role doc into a node structure
  const roleToNode = role => ({
    id: role._id,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    type: "role",
    position: { x: 0, y: 0 },
    data: {
      ...role.uiMetadata,
      custom: !role._id.match(/[A-Z]+/),
    },
  })

  // Converts a node structure back into a role doc
  const nodeToRole = node => {
    const role = $roles.find(x => x._id === node.id)
    const inherits = $edges.filter(x => x.target === node.id).map(x => x.source)
    console.log(inherits)
    return {
      ...role,
      // inherits,
      uiMetadata: {
        displayName: node.data.displayName,
        color: node.data.color,
        description: node.data.description,
      },
    }
  }

  // Builds a layout from an array of roles
  const rolesToLayout = roles => {
    let nodes = []
    let edges = []
    for (let role of roles.filter(role => role._id !== Roles.PUBLIC)) {
      // Add node for this role
      nodes.push(roleToNode(role))

      // Add edges for this role
      let inherits = []
      if (role.inherits) {
        inherits = Array.isArray(role.inherits)
          ? role.inherits
          : [role.inherits]
      }
      for (let sourceRole of inherits) {
        if (!roles.some(x => x._id === sourceRole)) {
          continue
        }
        edges.push({
          id: `${sourceRole}-${role._id}`,
          source: sourceRole,
          target: role._id,
        })
      }
    }
    return {
      nodes,
      edges,
    }
  }

  // Updates nodes and edges based on external changes to roles
  const handleExternalRoleChanges = roles => {
    const currentNodes = $nodes
    const newLayout = autoLayout(rolesToLayout(roles))

    // For nodes we want to persist some metadata
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

    // Edges can always be updated
    edges.set(newLayout.edges)
  }

  // Creates a new role
  const createRole = async () => {
    const newRole = {
      name: Helpers.uuid(),
      uiMetadata: {
        displayName: getSequentialName($roles, "New role ", {
          getName: x => x.uiMetadata.displayName,
        }),
        color: "var(--spectrum-global-color-gray-700)",
        description: "Custom role",
      },
      permissionId: "write",
      inherits: Roles.BASIC,
    }

    // Immediate state update
    const newNode = {
      ...roleToNode({ ...newRole, _id: newRole.name }),
      selected: true,
    }
    const layout = autoLayout({
      nodes: [...$nodes.map(node => ({ ...node, selected: false })), newNode],
      edges: $edges,
    })
    nodes.set(layout.nodes)
    edges.set(layout.edges)

    // Actually create role
    await roles.save(newRole)
  }

  // Updates a role with new metadata
  const updateRole = async (roleId, metadata) => {
    // Don't update builtins
    const node = $nodes.find(x => x.id === roleId)
    if (!node || !node.data.custom) {
      return
    }

    // Immediate state update
    if (metadata) {
      flow.updateNodeData(roleId, metadata)
    }

    // Actually save changes
    const role = nodeToRole(node)
    await roles.save(role)
  }

  // Deletes a role
  const deleteRole = async roleId => {
    // Immediate state update
    const layout = autoLayout({
      nodes: $nodes.filter(x => x.id !== roleId),
      edges: $edges.filter(x => x.source !== roleId && x.target !== roleId),
    })
    nodes.set(layout.nodes)
    edges.set(layout.edges)

    // Actually delete role
    const role = $roles.find(x => x._id === roleId)
    if (role) {
      roles.delete(role)
    }
  }

  // Saves a new connection
  const onConnect = async connection => {
    await updateRole(connection.target)
  }

  setContext("flow", {
    nodes,
    edges,
    dragging,
    selectedNode,
    createRole,
    updateRole,
    deleteRole,
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
    snapGrid={[GridResolution, GridResolution]}
    nodeTypes={{ role: RoleNode }}
    edgeTypes={{ role: RoleEdge }}
    proOptions={{ hideAttribution: true }}
    fitViewOptions={{ maxZoom: MaxAutoZoom }}
    defaultEdgeOptions={{ type: "role", animated: true, selectable: false }}
    onconnectstart={() => dragging.set(true)}
    onconnectend={() => dragging.set(false)}
    onconnect={onConnect}
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
    --border-color: var(--spectrum-global-color-gray-300);
    --edge-color: var(--spectrum-global-color-gray-500);
    --handle-color: var(--spectrum-global-color-gray-600);
    --selected-color: var(--spectrum-global-color-blue-400);
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
