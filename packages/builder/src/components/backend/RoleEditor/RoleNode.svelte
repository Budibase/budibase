<script>
  import { RoleUtils } from "@budibase/frontend-core"
  import { Handle, Position, useSvelteFlow } from "@xyflow/svelte"
  import {
    Icon,
    Input,
    ColorPicker,
    Modal,
    ModalContent,
    FieldLabel,
  } from "@budibase/bbui"
  import { Roles } from "constants/backend"
  import { NodeWidth, NodeHeight } from "./constants"
  import { getContext, tick } from "svelte"
  import { autoLayout, nodeToRole } from "./layout"
  import { roles } from "stores/builder"

  export let data
  export let isConnectable
  export let id

  const { nodes, edges } = getContext("flow")
  const flow = useSvelteFlow()

  let anchor
  let modal
  let tempDisplayName
  let tempDescription
  let tempColor

  const deleteNode = async () => {
    await roles.delete(nodeToRole({ id, data }))
    flow.deleteElements({
      nodes: [{ id }],
    })
    await tick()
    doAutoLayout()
  }

  const openPopover = () => {
    tempDisplayName = data.displayName
    tempDescription = data.description
    tempColor = data.color
    modal.show()
  }

  const saveChanges = async () => {
    await roles.save(nodeToRole({ id, data }))
    flow.updateNodeData(id, {
      displayName: tempDisplayName,
      description: tempDescription,
      color: tempColor,
    })
  }

  const doAutoLayout = () => {
    const layout = autoLayout({ nodes: $nodes, edges: $edges })
    nodes.set(layout.nodes)
    edges.set(layout.edges)
    flow.fitView({ maxZoom: 1, duration: 300 })
  }
</script>

<div
  class="node"
  class:selected={false}
  style={`--color:${data.color}; --width:${NodeWidth}px; --height:${NodeHeight}px;`}
  bind:this={anchor}
>
  <div class="color" />
  <div class="content">
    <div class="title">
      <div class="name">
        {data.displayName}
      </div>
      {#if data.custom}
        <div class="buttons">
          <Icon size="S" name="Edit" hoverable on:click={openPopover} />
          <Icon size="S" name="Delete" hoverable on:click={deleteNode} />
        </div>
      {/if}
    </div>
    {#if data.description}
      <div class="description">
        {data.description}
      </div>
    {/if}
  </div>
  {#if id !== Roles.BASIC}
    <Handle type="target" position={Position.Left} {isConnectable} />
  {/if}
  {#if id !== Roles.ADMIN}
    <Handle type="source" position={Position.Right} {isConnectable} />
  {/if}
</div>

<Modal bind:this={modal}>
  <ModalContent
    title={`Edit ${data.displayName}`}
    confirmText="Save"
    onConfirm={saveChanges}
  >
    <Input
      label="Name"
      value={tempDisplayName}
      on:change={e => (tempDisplayName = e.detail)}
    />
    <Input
      label="Description"
      value={tempDescription}
      on:change={e => (tempDescription = e.detail)}
    />
    <div>
      <FieldLabel label="Color" />
      <ColorPicker value={tempColor} on:change={e => (tempColor = e.detail)} />
    </div>
  </ModalContent>
</Modal>

<style>
  .node {
    position: relative;
    background: var(--node-background);
    border-radius: 4px;
    border: 1px solid transparent;
    width: var(--width);
    height: var(--height);
    display: flex;
    flex-direction: column;
  }
  .node.selected {
    background: var(--spectrum-global-color-blue-100);
  }
  .color {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    height: 8px;
    width: 100%;
    background: var(--color);
  }
  .content {
    flex: 1 1 auto;
    padding: 0 14px 0 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: 2px;
    border: 1px solid var(--border-color);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .node.selected .content {
    border-color: transparent;
  }
  .title,
  .buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }
  .title {
    justify-content: space-between;
  }
  .buttons {
    display: none;
  }
  .title :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-600);
  }
  .name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .description {
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
  }
  .node:hover .buttons {
    display: flex;
  }
</style>
