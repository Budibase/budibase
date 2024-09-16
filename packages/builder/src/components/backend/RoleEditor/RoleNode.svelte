<script>
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
  import { getContext } from "svelte"
  import { roles } from "stores/builder"

  export let data
  export let id
  export let selected

  const { dragging, updateRole, deleteRole } = getContext("flow")
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
  $: sourceClasses = `source${selected ? "" : " hidden"}`

  const validateName = (name, roles) => {
    if (!name?.length) {
      return "Please enter a name"
    }
    if (roles.some(x => x.uiMetadata.displayName === name && x._id !== id)) {
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

  const openPopover = e => {
    e.stopPropagation()
    tempDisplayName = data.displayName
    tempDescription = data.description
    tempColor = data.color
    modal.show()
  }

  const saveChanges = () => {
    updateRole(id, {
      displayName: tempDisplayName,
      description: tempDescription,
      color: tempColor,
    })
  }

  const handleDelete = async e => {
    e.stopPropagation()
    await deleteRole(id)
  }
</script>

<div
  class="node"
  class:selected
  style={`--color:${data.color}; --width:${NodeWidth}px; --height:${NodeHeight}px;`}
  bind:this={anchor}
>
  <div class="color" />
  <div class="content">
    <div class="name">
      {data.displayName}
    </div>
    {#if data.description}
      <div class="description" title={data.description}>
        {data.description}
      </div>
    {/if}
  </div>
  {#if data.custom}
    <div class="buttons">
      <Icon size="S" name="Edit" hoverable on:click={openPopover} />
      <Icon size="S" name="Delete" hoverable on:click={handleDelete} />
    </div>
  {/if}
  {#if id !== Roles.BASIC}
    <Handle
      type="target"
      position={Position.Left}
      class={targetClasses}
      isConnectable={$dragging}
    />
  {/if}
  {#if id !== Roles.ADMIN}
    <Handle type="source" position={Position.Right} class={sourceClasses} />
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
    background: var(--spectrum-global-color-gray-100);
    border-radius: 4px;
    width: var(--width);
    height: var(--height);
    display: flex;
    flex-direction: row;
    gap: 12px;
    box-sizing: border-box;
    cursor: pointer;
    transition: background 130ms ease-out;
  }
  .node:hover {
    background: var(--spectrum-global-color-gray-200);
  }
  .node.selected {
    background: var(--spectrum-global-color-blue-100);
    cursor: grab;
  }
  .color {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    height: 100%;
    width: 10px;
    flex: 0 0 10px;
    background: var(--color);
  }
  .content {
    width: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: 2px;
    border: 1px solid var(--border-color);
    border-left-width: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .node.selected .content {
    border-color: transparent;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }
  .buttons {
    display: none;
    padding-right: 12px;
  }
  .buttons :global(.spectrum-Icon) {
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
  .node.selected .buttons {
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
