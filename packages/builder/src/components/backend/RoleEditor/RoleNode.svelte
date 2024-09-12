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
  export let id

  const { nodes, edges, dragging } = getContext("flow")
  const flow = useSvelteFlow()

  let anchor
  let modal
  let tempDisplayName
  let tempDescription
  let tempColor

  $: nameError = validateName(tempDisplayName, $roles)
  $: descriptionError = validateDescription(tempDescription)
  $: invalid = nameError || descriptionError
  $: targetClasses = `target${$dragging ? "" : " hidden"}`

  const validateName = (name, roles) => {
    if (!name?.length) {
      return "Please enter a name"
    }
    if (roles.some(x => x.displayName === name && x._id !== id)) {
      return "That name is already used by another role"
    }
    return null
  }

  const validateDescription = description => {
    if (!description?.length) {
      return "Please enter a name"
    }
    return null
  }

  const deleteNode = async () => {
    flow.deleteElements({
      nodes: [{ id }],
    })
    await tick()
    doAutoLayout()
    await roles.delete(nodeToRole({ id, data }))
  }

  const openPopover = () => {
    tempDisplayName = data.displayName
    tempDescription = data.description
    tempColor = data.color
    modal.show()
  }

  const saveChanges = async () => {
    const newData = {
      displayName: tempDisplayName,
      description: tempDescription,
      color: tempColor,
    }
    flow.updateNodeData(id, newData)
    await roles.save(nodeToRole({ id, data: newData }))
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
      <div class="description" title={data.description}>
        {data.description}
      </div>
    {/if}
  </div>
  {#if id !== Roles.BASIC}
    <Handle
      type="target"
      position={Position.Left}
      class={targetClasses}
      isConnectable={$dragging}
    />
  {/if}
  {#if id !== Roles.ADMIN}
    <Handle type="source" position={Position.Right} />
  {/if}
</div>

<Modal bind:this={modal}>
  <ModalContent
    title={`Edit ${data.displayName}`}
    confirmText="Save"
    onConfirm={saveChanges}
    disabled={invalid}
  >
    <Input
      label="Name"
      value={tempDisplayName}
      error={nameError}
      on:change={e => (tempDisplayName = e.detail)}
    />
    <Input
      label="Description"
      value={tempDescription}
      error={descriptionError}
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
  .name,
  .description {
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
  .node :global(.svelte-flow__handle) {
    width: 6px;
    height: 6px;
    border-width: 2px;
  }
  .node :global(.svelte-flow__handle.target) {
    background: var(--background-color);
  }
  .node :global(.svelte-flow__handle.hidden) {
    opacity: 0;
    pointer-events: none;
  }
</style>
