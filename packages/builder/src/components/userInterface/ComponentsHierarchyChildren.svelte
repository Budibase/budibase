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

  const capitalise = s => s.substring(0, 1).toUpperCase() + s.substring(1)
  const get_name = s => (!s ? "" : last(s.split("/")))

  const get_capitalised_name = name => pipe(name, [get_name, capitalise])

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
        style="padding-left: {level * 16 + 32}px">
        <div class="nav-item">
          <i class="icon ri-arrow-right-circle-fill" />
          {get_capitalised_name(component._component)}
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
          level={level + 1} />
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
