<script>
  import { MoreIcon } from "components/common/Icons"
  import { store } from "builderStore"
  import { getComponentDefinition } from "builderStore/storeUtils"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { last, cloneDeep } from "lodash/fp"
  import {
    selectComponent,
    getParent,
    walkProps,
    saveCurrentPreviewItem,
    regenerateCssForCurrentScreen,
  } from "builderStore/storeUtils"
  import { uuid } from "builderStore/uuid"
  import { DropdownMenu } from "@budibase/bbui"

  export let component

  let confirmDeleteDialog
  let dropdown
  let anchor

  $: noChildrenAllowed = !component || !getComponentDefinition($store, component._component).children
  $: noPaste = !$store.componentToPaste

  const lastPartOfName = c => (c ? last(c._component.split("/")) : "")

  const hideDropdown = () => {
    dropdown.hide()
  }

  const moveUpComponent = () => {
    store.update(s => {
      const parent = getParent(s.currentPreviewItem.props, component)

      if (parent) {
        const currentIndex = parent._children.indexOf(component)
        if (currentIndex === 0) return s

        const newChildren = parent._children.filter(c => c !== component)
        newChildren.splice(currentIndex - 1, 0, component)
        parent._children = newChildren
      }
      s.currentComponentInfo = component
      saveCurrentPreviewItem(s)

      return s
    })
  }

  const moveDownComponent = () => {
    store.update(s => {
      const parent = getParent(s.currentPreviewItem.props, component)

      if (parent) {
        const currentIndex = parent._children.indexOf(component)
        if (currentIndex === parent._children.length - 1) return s

        const newChildren = parent._children.filter(c => c !== component)
        newChildren.splice(currentIndex + 1, 0, component)
        parent._children = newChildren
      }
      s.currentComponentInfo = component
      saveCurrentPreviewItem(s)

      return s
    })
  }

  const copyComponent = () => {
    store.update(s => {
      const parent = getParent(s.currentPreviewItem.props, component)
      const copiedComponent = cloneDeep(component)
      walkProps(copiedComponent, p => {
        p._id = uuid()
      })
      parent._children = [...parent._children, copiedComponent]
      saveCurrentPreviewItem(s)
      s.currentComponentInfo = copiedComponent
      regenerateCssForCurrentScreen(s)
      return s
    })
  }

  const deleteComponent = () => {
    store.update(state => {
      const parent = getParent(state.currentPreviewItem.props, component)

      if (parent) {
        parent._children = parent._children.filter(c => c !== component)
      }

      saveCurrentPreviewItem(state)

      return state
    })
  }

  const storeComponentForCopy = (cut = false) => {
    // lives in store - also used by drag drop
    store.storeComponentForCopy(component, cut)
  }

  const pasteComponent = mode => {
    // lives in store - also used by drag drop
    store.pasteComponent(component, mode)
  }
</script>

<div bind:this={anchor} on:click|stopPropagation={() => {}}>
  <button on:click={dropdown.show}>
    <MoreIcon />
  </button>
</div>
<DropdownMenu class="menu" bind:this={dropdown} on:click={hideDropdown} width="170px" {anchor} align="left">
  <ul>
    <li class="item" on:click={() => confirmDeleteDialog.show()}>
      <i class="icon ri-delete-bin-2-line" />
      Delete
    </li>
    <li class="item" on:click={moveUpComponent}>
      <i class="icon ri-arrow-up-line" />
      Move up
    </li>
    <li class="item" on:click={moveDownComponent}>
      <i class="icon ri-arrow-down-line" />
      Move down
    </li>
    <li class="item" on:click={copyComponent}>
      <i class="icon ri-repeat-one-line" />
      Duplicate
    </li>
    <li class="item" on:click={() => storeComponentForCopy(true)}>
      <i class="icon ri-scissors-cut-line" />
      Cut
    </li>
    <li class="item" on:click={() => storeComponentForCopy(false)}>
      <i class="icon ri-file-copy-line" />
      Copy
    </li>
    <hr class="hr-style" />
    <li class="item" class:disabled={noPaste} on:click={() => pasteComponent('above')}>
      <i class="icon ri-insert-row-top" />
      Paste above
    </li>
    <li class="item" class:disabled={noPaste} on:click={() => pasteComponent('below')}>
      <i class="icon ri-insert-row-bottom" />
      Paste below
    </li>
    <li class="item" class:disabled={noPaste || noChildrenAllowed} on:click={() => pasteComponent('inside')}>
      <i class="icon ri-insert-column-right" />
      Paste inside
    </li>
  </ul>
</DropdownMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Delete"
  body={`Are you sure you wish to delete this '${lastPartOfName(component)}' component?`}
  okText="Delete Component"
  onOk={deleteComponent} />

<style>
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    color: var(--ink);
    padding: var(--spacing-s) var(--spacing-m);
    margin: auto 0px;
    align-items: center;
    cursor: pointer;
  }

  button {
    border-style: none;
    border-radius: 2px;
    padding: 0;
    background: transparent;
    cursor: pointer;
    color: var(--ink);
    outline: none;
  }

  li:hover {
    background-color: var(--grey-2);
  }

  li:active {
    color: var(--blue);
  }

  .item {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .icon {
    margin-right: 8px;
  }

  .disabled {
    color: var(--grey-4);
    cursor: default;
  }

  .hr-style {
    margin: 8px 0;
    color: var(--grey-4);
  }
</style>
