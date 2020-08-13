<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import { last } from "lodash/fp"
  import { pipe } from "components/common/core"
  import ComponentDropdownMenu from "./ComponentDropdownMenu.svelte"
  import {
    XCircleIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    CopyIcon,
  } from "../common/Icons"

  export let components = []
  export let currentComponent
  export let onSelect = () => {}
  export let level = 0
  export let dragDropStore

  let dropUnderComponent
  let componentToDrop

  const capitalise = s => s.substring(0, 1).toUpperCase() + s.substring(1)
  const get_name = s => (!s ? "" : last(s.split("/")))

  const get_capitalised_name = name =>
    pipe(
      name,
      [get_name, capitalise]
    )
  const isScreenslot = name => name === "##builtin/screenslot"

  const selectComponent = component => {
    // Set current component
    store.selectComponent(component)

    // Get ID path
    const path = store.getPathToComponent(component)

    // Go to correct URL
    $goto(`./:page/:screen/${path}`)
  }

  const dragstart = component => e => {
    e.dataTransfer.dropEffect = "move"
    dragDropStore.update(s => {
      s.componentToDrop = component
      return s
    })
  }

  const dragover = (component, index) => e => {
    const canHaveChildrenButIsEmpty =
      $store.components[component._component].children &&
      component._children.length === 0

    e.dataTransfer.dropEffect = "copy"
    dragDropStore.update(s => {
      const isBottomHalf = e.offsetY > e.currentTarget.offsetHeight / 2
      s.targetComponent = component
      // only allow dropping inside when container type
      // is empty. If it has children, the user can drag over
      // it's existing children
      if (canHaveChildrenButIsEmpty) {
        if (index === 0) {
          // when its the first component in the screen,
          // we divide into 3, so we can paste above, inside or below
          const pos = e.offsetY / e.currentTarget.offsetHeight
          if (pos < 0.4) {
            s.dropPosition = "above"
          } else if (pos > 0.8) {
            // purposely giving this the least space as it is often covered
            // by the component below's "above" space
            s.dropPosition = "below"
          } else {
            s.dropPosition = "inside"
          }
        } else {
          s.dropPosition = isBottomHalf ? "below" : "inside"
        }
      } else {
        s.dropPosition = isBottomHalf ? "below" : "above"
      }
      return s
    })
    return false
  }

  const drop = () => {
    if ($dragDropStore.targetComponent !== $dragDropStore.componentToDrop) {
      store.storeComponentForCopy($dragDropStore.componentToDrop, true)
      store.pasteComponent(
        $dragDropStore.targetComponent,
        $dragDropStore.dropPosition
      )
    }
    dragDropStore.update(s => {
      s.dropPosition = ""
      s.targetComponent = null
      s.componentToDrop = null
      return s
    })
  }
</script>

<ul>
  {#each components as component, index (component._id)}
    <li on:click|stopPropagation={() => selectComponent(component)}>

      {#if $dragDropStore && $dragDropStore.targetComponent === component && $dragDropStore.dropPosition === 'above'}
        <div
          on:drop={drop}
          ondragover="return false"
          ondragenter="return false"
          class="budibase__nav-item item drop-item"
          style="margin-left: {level * 20 + 40}px" />
      {/if}

      <div
        class="budibase__nav-item item"
        class:selected={currentComponent === component}
        style="padding-left: {level * 20 + 40}px"
        draggable={true}
        on:dragstart={dragstart(component)}
        on:dragover={dragover(component, index)}
        on:drop={drop}
        ondragover="return false"
        ondragenter="return false">
        <div class="nav-item">
          <i class="icon ri-arrow-right-circle-line" />
          {isScreenslot(component._component) ? 'Screenslot' : component._instanceName}
        </div>
        <div class="actions">
          <ComponentDropdownMenu {component} />
        </div>
      </div>

      {#if component._children}
        <svelte:self
          components={component._children}
          {currentComponent}
          {onSelect}
          {dragDropStore}
          level={level + 1} />
      {/if}

      {#if $dragDropStore && $dragDropStore.targetComponent === component && ($dragDropStore.dropPosition === 'inside' || $dragDropStore.dropPosition === 'below')}
        <div
          on:drop={drop}
          ondragover="return false"
          ondragenter="return false"
          class="budibase__nav-item item drop-item"
          style="margin-left: {(level + ($dragDropStore.dropPosition === 'inside' ? 2 : 0)) * 20 + 40}px" />
      {/if}
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  .item {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    padding: 0px 5px 0px 15px;
    margin: auto 0px;
    border-radius: 5px;
    height: 36px;
    align-items: center;
  }

  .drop-item {
    background: var(--blue-light);
    height: 36px;
  }

  .actions {
    display: none;
    height: 24px;
    width: 24px;
    color: var(--ink);
    padding: 0px 5px;
    border-style: none;
    background: rgba(0, 0, 0, 0);
    cursor: pointer;
    position: relative;
  }

  .item:hover {
    background: var(--grey-1);
    cursor: pointer;
  }
  .item:hover .actions {
    display: block;
  }

  .nav-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--ink);
  }

  .icon {
    color: var(--grey-7);
    margin-right: 8px;
  }
</style>
