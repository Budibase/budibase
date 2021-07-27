<script>
  import { get } from "svelte/store"
  import { store, currentAsset } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { findComponentParent } from "builderStore/storeUtils"
  import { ActionMenu, MenuItem, Icon } from "@budibase/bbui"

  export let component

  let confirmDeleteDialog

  $: definition = store.actions.components.getDefinition(component?._component)
  $: noChildrenAllowed = !component || !definition?.hasChildren
  $: noPaste = !$store.componentToPaste

  const moveUpComponent = () => {
    const asset = get(currentAsset)
    const parent = findComponentParent(asset.props, component._id)
    if (!parent) {
      return
    }
    const currentIndex = parent._children.indexOf(component)
    if (currentIndex === 0) {
      return
    }
    const newChildren = parent._children.filter(c => c !== component)
    newChildren.splice(currentIndex - 1, 0, component)
    parent._children = newChildren
    store.actions.preview.saveSelected()
  }

  const moveDownComponent = () => {
    const asset = get(currentAsset)
    const parent = findComponentParent(asset.props, component._id)
    if (!parent) {
      return
    }
    const currentIndex = parent._children.indexOf(component)
    if (currentIndex === parent._children.length - 1) {
      return
    }
    const newChildren = parent._children.filter(c => c !== component)
    newChildren.splice(currentIndex + 1, 0, component)
    parent._children = newChildren
    store.actions.preview.saveSelected()
  }

  const duplicateComponent = () => {
    storeComponentForCopy(false)
    pasteComponent("below")
  }

  const deleteComponent = async () => {
    await store.actions.components.delete(component)
  }

  const storeComponentForCopy = (cut = false) => {
    // lives in store - also used by drag drop
    store.actions.components.copy(component, cut)
  }

  const pasteComponent = mode => {
    // lives in store - also used by drag drop
    store.actions.components.paste(component, mode)
  }
</script>

{#if definition?.editable !== false}
  <ActionMenu>
    <div slot="control" class="icon">
      <Icon size="S" hoverable name="MoreSmallList" />
    </div>
    <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>
      Delete
    </MenuItem>
    <MenuItem noClose icon="ChevronUp" on:click={moveUpComponent}>
      Move up
    </MenuItem>
    <MenuItem noClose icon="ChevronDown" on:click={moveDownComponent}>
      Move down
    </MenuItem>
    <MenuItem noClose icon="Duplicate" on:click={duplicateComponent}>
      Duplicate
    </MenuItem>
    <MenuItem icon="Cut" on:click={() => storeComponentForCopy(true)}>
      Cut
    </MenuItem>
    <MenuItem icon="Copy" on:click={() => storeComponentForCopy(false)}>
      Copy
    </MenuItem>
    <MenuItem
      icon="LayersBringToFront"
      on:click={() => pasteComponent("above")}
      disabled={noPaste}
    >
      Paste above
    </MenuItem>
    <MenuItem
      icon="LayersSendToBack"
      on:click={() => pasteComponent("below")}
      disabled={noPaste}
    >
      Paste below
    </MenuItem>
    <MenuItem
      icon="ShowOneLayer"
      on:click={() => pasteComponent("inside")}
      disabled={noPaste || noChildrenAllowed}
    >
      Paste inside
    </MenuItem>
  </ActionMenu>
  <ConfirmDialog
    bind:this={confirmDeleteDialog}
    title="Confirm Deletion"
    body={`Are you sure you wish to delete this '${definition?.name}' component?`}
    okText="Delete Component"
    onOk={deleteComponent}
  />
{/if}
