<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import { getComponentDefinition } from "builderStore/storeUtils"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { last } from "lodash/fp"
  import { getParent } from "builderStore/storeUtils"
  import { DropdownMenu } from "@budibase/bbui"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"

  export let component

  let confirmDeleteDialog
  let dropdown
  let anchor

  $: noChildrenAllowed =
    !component || !getComponentDefinition($store, component._component).children
  $: noPaste = !$store.componentToPaste

  const lastPartOfName = c => (c ? last(c._component.split("/")) : "")

  const hideDropdown = () => {
    dropdown.hide()
  }

  const selectComponent = component => {
    store.actions.components.select(component)
    const path = store.actions.components.findRoute(component)
    $goto(`./:page/:screen/${path}`)
  }

  const moveUpComponent = () => {
    store.update(state => {
      const parent = getParent(state.currentPreviewItem.props, component)

      if (parent) {
        const currentIndex = parent._children.indexOf(component)
        if (currentIndex === 0) return state

        const newChildren = parent._children.filter(c => c !== component)
        newChildren.splice(currentIndex - 1, 0, component)
        parent._children = newChildren
      }
      state.currentComponentInfo = component
      store.actions.preview.saveSelected()

      return state
    })
  }

  const moveDownComponent = () => {
    store.update(state => {
      const parent = getParent(state.currentPreviewItem.props, component)

      if (parent) {
        const currentIndex = parent._children.indexOf(component)
        if (currentIndex === parent._children.length - 1) return state

        const newChildren = parent._children.filter(c => c !== component)
        newChildren.splice(currentIndex + 1, 0, component)
        parent._children = newChildren
      }
      state.currentComponentInfo = component
      store.actions.preview.saveSelected()

      return state
    })
  }

  const duplicateComponent = () => {
    storeComponentForCopy(false)
    pasteComponent("below")
  }

  const deleteComponent = () => {
    store.update(state => {
      const parent = getParent(state.currentPreviewItem.props, component)

      if (parent) {
        parent._children = parent._children.filter(c => c !== component)
        selectComponent(parent)
      }

      store.actions.preview.saveSelected()
      return state
    })
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

<div bind:this={anchor} on:click|stopPropagation>
  <div class="icon" on:click={dropdown.show}><i class="ri-more-line" /></div>
  <DropdownMenu bind:this={dropdown} width="170px" {anchor} align="left">
    <DropdownContainer on:click={hideDropdown}>
      <DropdownItem
        icon="ri-delete-bin-line"
        title="Delete"
        on:click={() => confirmDeleteDialog.show()} />
      <DropdownItem
        icon="ri-arrow-up-line"
        title="Move up"
        on:click={moveUpComponent} />
      <DropdownItem
        icon="ri-arrow-down-line"
        title="Move down"
        on:click={moveDownComponent} />
      <DropdownItem
        icon="ri-repeat-one-line"
        title="Duplicate"
        on:click={duplicateComponent} />
      <DropdownItem
        icon="ri-scissors-cut-line"
        title="Cut"
        on:click={() => storeComponentForCopy(true)} />
      <DropdownItem
        icon="ri-file-copy-line"
        title="Copy"
        on:click={() => storeComponentForCopy(false)} />
      <hr class="hr-style" />
      <DropdownItem
        icon="ri-insert-row-top"
        title="Paste above"
        disabled={noPaste}
        on:click={() => pasteComponent('above')} />
      <DropdownItem
        icon="ri-insert-row-bottom"
        title="Paste below"
        disabled={noPaste}
        on:click={() => pasteComponent('below')} />
      <DropdownItem
        icon="ri-insert-column-right"
        title="Paste inside"
        disabled={noPaste || noChildrenAllowed}
        on:click={() => pasteComponent('inside')} />
    </DropdownContainer>
  </DropdownMenu>
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Deletion"
  body={`Are you sure you wish to delete this '${lastPartOfName(component)}' component?`}
  okText="Delete Component"
  onOk={deleteComponent} />

<style>
  hr {
    margin: 8px 0;
    background-color: var(--grey-4);
    height: 1px;
    border: none;
  }
</style>
