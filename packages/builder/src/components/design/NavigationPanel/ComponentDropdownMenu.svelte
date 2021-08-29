<script>
  import { get } from "svelte/store"
  import { store, currentAsset } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { findComponentParent } from "builderStore/storeUtils"
  import { ActionMenu, MenuItem, Icon } from "@budibase/bbui"
  import { _ as t } from "svelte-i18n"

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
      {$t("delete")}
    </MenuItem>
    <MenuItem noClose icon="ChevronUp" on:click={moveUpComponent}>
      {$t("move-up")}
    </MenuItem>
    <MenuItem noClose icon="ChevronDown" on:click={moveDownComponent}>
      {$t("move-down")}
    </MenuItem>
    <MenuItem noClose icon="Duplicate" on:click={duplicateComponent}>
      {$t("duplicate")}
    </MenuItem>
    <MenuItem icon="Cut" on:click={() => storeComponentForCopy(true)}>
      {$t("cut")}
    </MenuItem>
    <MenuItem icon="Copy" on:click={() => storeComponentForCopy(false)}>
      {$t("copy")}
    </MenuItem>
    <MenuItem
      icon="LayersBringToFront"
      on:click={() => pasteComponent("above")}
      disabled={noPaste}
    >
      {$t("paste-above")}
    </MenuItem>
    <MenuItem
      icon="LayersSendToBack"
      on:click={() => pasteComponent("below")}
      disabled={noPaste}
    >
      {$t("paste-below")}
    </MenuItem>
    <MenuItem
      icon="ShowOneLayer"
      on:click={() => pasteComponent("inside")}
      disabled={noPaste || noChildrenAllowed}
    >
      {$t("paste-inside")}
    </MenuItem>
  </ActionMenu>
  <ConfirmDialog
    bind:this={confirmDeleteDialog}
    title={$t("confirm-deletion")}
    body={$t("are-you-sure-you-wish-to-delete-this") +
      ` '${definition?.name}' ` +
      $t("component") +
      `?`}
    okText={$t("delete-component")}
    onOk={deleteComponent}
  />
{/if}
