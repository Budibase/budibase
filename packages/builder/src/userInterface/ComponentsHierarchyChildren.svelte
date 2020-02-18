<script>
  import { last } from "lodash/fp"
  import { pipe } from "../common/core"
  import { XCircleIcon } from "../common/Icons"

  export let components = []
  export let currentComponent
  export let onSelect = () => {}
  export let level = 0
  export let onDeleteComponent

  
  const capitalise = s => s.substring(0, 1).toUpperCase() + s.substring(1)
  const get_name = s => !s ? "" : last(s.split("/"))

  const get_capitalised_name = name =>
    pipe(
      name,
      [get_name, capitalise]
    )

</script>

<ul>
  {#each components as component}
    <li on:click|stopPropagation={() => onSelect(component)}>
      <span
        class="item"
        class:selected={currentComponent === component}
        style="padding-left: {level * 20 + 67}px">
        <span class="item-name">{get_capitalised_name(component._component)}</span>
        <button 
          class="delete-component"
          on:click={() => onDeleteComponent(component)}>
          <XCircleIcon />
        </button>
      </span>

      {#if component._children}
        <svelte:self
          components={component._children}
          {currentComponent}
          {onSelect}
          level={level + 1}
          {onDeleteComponent} />
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
    display: flex;
    flex-direction: row;
    padding: 11px 5px 11px 67px;
    border-radius: 3px;
  }

  .item > span {
    width: 1px;
    flex: 1 1 auto;
  }

  .item > button {
    display: none;
    height: 20px;
    color: var(--slate)
  }

  .item:hover {

    background: #fafafa;
    cursor: pointer;
  }
  .item:hover > button {
    border-style: none;
    background: rgba(0,0,0,0);
    display: block;
    cursor: pointer;
  }

  .item:hover > button:hover {
    color: var(--button-text);
  }

  .selected {
    color: var(--button-text);
    background: var(--background-button) !important;
  }
</style>
