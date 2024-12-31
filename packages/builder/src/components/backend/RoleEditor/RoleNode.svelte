<script>
  import { Handle, Position } from "@xyflow/svelte"
  import {
    Icon,
    Input,
    ColorPicker,
    Modal,
    ModalContent,
    FieldLabel,
  } from "@budibase/bbui"
  import { NodeWidth, NodeHeight } from "./constants"
  import { getContext } from "svelte"
  import { roles } from "@/stores/builder"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"

  export let data
  export let id
  export let selected
  export let isConnectable

  const { dragging, updateRole, deleteRole } = getContext("flow")

  let anchor
  let modal
  let tempDisplayName
  let tempDescription
  let tempColor
  let deleteModal

  $: nameError = validateName(tempDisplayName, $roles)
  $: descriptionError = validateDescription(tempDescription)
  $: invalid = nameError || descriptionError

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
</script>

<div
  class="node"
  class:dragging={$dragging}
  class:selected
  class:interactive={data.interactive}
  class:custom={data.custom}
  class:selectable={isConnectable}
  style={`--color:${data.color}; --width:${NodeWidth}px; --height:${NodeHeight}px;`}
  bind:this={anchor}
>
  <div class="color" />
  <div class="content">
    <div class="text">
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
        <Icon size="S" name="Delete" hoverable on:click={deleteModal?.show} />
      </div>
    {/if}
  </div>
  <Handle
    type="target"
    position={Position.Left}
    isConnectable={isConnectable && $dragging && data.custom}
  />
  <Handle type="source" position={Position.Right} {isConnectable} />
</div>

<ConfirmDialog
  bind:this={deleteModal}
  title={`Delete ${data.displayName}`}
  body="Are you sure you want to delete this role? This can't be undone."
  okText="Delete"
  onOk={async () => await deleteRole(id)}
/>

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
  /* Node styles */
  .node {
    position: relative;
    background: var(--spectrum-global-color-gray-100);
    border-radius: 4px;
    width: var(--width);
    height: var(--height);
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    transition: background 130ms ease-out;
  }
  .node.selectable:hover {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-200);
  }
  .node.selectable.selected {
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

  /* Main container */
  .content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    border: 1px solid var(--border-color);
    border-left-width: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 12px;
    gap: 6px;
  }
  .node.selected .content {
    border-color: var(--spectrum-global-color-blue-100);
  }

  /* Text */
  .text {
    width: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
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

  /* Icons */
  .buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }
  .buttons :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-600);
  }

  /* Handles */
  .node :global(.svelte-flow__handle) {
    width: 6px;
    height: 6px;
    border-width: 2px;
  }
  .node :global(.svelte-flow__handle.target) {
    background: var(--background-color);
  }
  .node:not(.dragging) :global(.svelte-flow__handle.target),
  .node:not(.interactive) :global(.svelte-flow__handle),
  .node:not(.custom) :global(.svelte-flow__handle.target) {
    visibility: hidden;
    pointer-events: none;
  }
</style>
