<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import { getComponentDefinition } from "builderStore/storeUtils"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { last, cloneDeep } from "lodash/fp"
  import { getParent, saveCurrentPreviewItem } from "builderStore/storeUtils"
  import { uuid } from "builderStore/uuid"
  import { DropdownMenu } from "@budibase/bbui"

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
    store.selectComponent(component)
    const path = store.getPathToComponent(component)
    $goto(`./:page/:screen/${path}`)
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
  <div class="icon" on:click={dropdown.show}><i class="ri-more-line" /></div>
</div>
<DropdownMenu
  bind:this={dropdown}
  on:click={hideDropdown}
  width="170px"
  {anchor}
  align="left">
  <ul>
    <li class="item" on:click={() => confirmDeleteDialog.show()}>
      <i class="ri-delete-bin-2-line" />
      Delete
    </li>
    <li class="item" on:click={moveUpComponent}>
      <i class="ri-arrow-up-line" />
      Move up
    </li>
    <li class="item" on:click={moveDownComponent}>
      <i class="ri-arrow-down-line" />
      Move down
    </li>
    <li class="item" on:click={copyComponent}>
      <i class="ri-repeat-one-line" />
      Duplicate
    </li>
    <li class="item" on:click={() => storeComponentForCopy(true)}>
      <i class="ri-scissors-cut-line" />
      Cut
    </li>
    <li class="item" on:click={() => storeComponentForCopy(false)}>
      <i class="ri-file-copy-line" />
      Copy
    </li>
    <hr class="hr-style" />
    <li
      class="item"
      class:disabled={noPaste}
      on:click={() => pasteComponent('above')}>
      <i class="ri-insert-row-top" />
      Paste above
    </li>
    <li
      class="item"
      class:disabled={noPaste}
      on:click={() => pasteComponent('below')}>
      <i class="ri-insert-row-bottom" />
      Paste below
    </li>
    <li
      class="item"
      class:disabled={noPaste || noChildrenAllowed}
      on:click={() => pasteComponent('inside')}>
      <i class="ri-insert-column-right" />
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
    margin: var(--spacing-s) 0;
  }

  li {
    display: flex;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    color: var(--ink);
    padding: var(--spacing-s) var(--spacing-m);
    margin: auto 0;
    align-items: center;
    cursor: pointer;
  }
  li:not(.disabled):hover {
    background-color: var(--grey-2);
  }
  li:active {
    color: var(--blue);
  }
  li i {
    margin-right: 8px;
    font-size: var(--font-size-s);
  }
  li.disabled {
    color: var(--grey-4);
    cursor: default;
  }

  .icon i {
    font-size: 16px;
  }

  .hr-style {
    margin: 8px 0;
    color: var(--grey-4);
  }
</style>
