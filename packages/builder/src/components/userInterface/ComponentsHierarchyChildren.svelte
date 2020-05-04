<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import { last } from "lodash/fp"
  import { pipe } from "../common/core"
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
  export let onDeleteComponent
  export let onMoveUpComponent
  export let onMoveDownComponent
  export let onCopyComponent

  const capitalise = s => s.substring(0, 1).toUpperCase() + s.substring(1)
  const get_name = s => (!s ? "" : last(s.split("/")))

  const get_capitalised_name = name => pipe(name, [get_name, capitalise])

  const moveDownComponent = component => {
    const c = component
    return () => {
      return onMoveDownComponent(c)
    }
  }

  const selectComponent = component => {
    // Set current component
    store.selectComponent(component)

    // Get ID path
    const path = store.getPathToComponent(component)

    // Go to correct URL
    $goto(`./:page/:screen/${path}`)
  }
</script>

<ul>
  {#each components as component, index (component._id)}
    <li on:click|stopPropagation={() => selectComponent(component)}>
      <div
        class="budibase__nav-item item"
        class:selected={currentComponent === component}
        style="padding-left: {level * 20 + 53}px">
        <div>{get_capitalised_name(component._component)}</div>
        <div class="reorder-buttons">
          {#if index > 0}
            <button
              class:solo={index === components.length - 1}
              on:click|stopPropagation={() => onMoveUpComponent(component)}>
              <ChevronUpIcon />
            </button>
          {/if}
          {#if index < components.length - 1}
            <button
              class:solo={index === 0}
              on:click|stopPropagation={moveDownComponent(component)}>
              <ChevronDownIcon />
            </button>
          {/if}
        </div>
        <button
          class="copy"
          on:click|stopPropagation={() => onCopyComponent(component)}>
          <CopyIcon />
        </button>
        <button on:click|stopPropagation={() => onDeleteComponent(component)}>
          <XCircleIcon />
        </button>
      </div>

      {#if component._children}
        <svelte:self
          components={component._children}
          {currentComponent}
          {onSelect}
          level={level + 1}
          {onDeleteComponent}
          {onMoveUpComponent}
          {onMoveDownComponent}
          {onCopyComponent} />
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
    border-radius: 3px;
    height: 35px;
    align-items: center;
    font-weight: 400;
    font-size: 13px;
  }

  .item button {
    display: none;
    height: 20px;
    width: 28px;
    color: var(--slate);
    padding: 0px 5px;
    border-style: none;
    background: rgba(0, 0, 0, 0);
    cursor: pointer;
  }

  .item button.copy {
    width: 26px;
  }

  .item:hover {
    background: #fafafa;
    cursor: pointer;
  }
  .item:hover button {
    display: block;
  }

  .item:hover button:hover {
    color: var(--button-text);
  }

  .reorder-buttons {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .reorder-buttons > button {
    flex: 1 1 auto;
    width: 30px;
    height: 15px;
  }

  .reorder-buttons > button.solo {
    padding-top: 2px;
  }
</style>
