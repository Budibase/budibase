<script>
  import { last } from "lodash/fp";
  import { pipe } from "../common/core";

  export let components = [];
  export let currentComponent;
  export let onSelect = () => {};

  const capitalise = s => s.substring(0,1).toUpperCase() + s.substring(1);
  const get_name = s => last(s.split('/'));
  const get_capitalised_name = name => pipe(name, [get_name,capitalise]);
</script>

{#each components as component}
  <ul>
    <li  on:click|stopPropagation={() => onSelect(component)}>
      <span class="item" class:selected={currentComponent === component}>
        {get_capitalised_name(component._component)}
      </span>

      {#if component._children}
        <svelte:self components={component._children}
                     {currentComponent}
                     {onSelect} />
      {/if}
    </li>

  </ul>
{/each}

<style>
  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  .item {
    display: block;
    padding: 11px 67px;
    border-radius: 3px;
  }

  .item:hover {
    background: #fafafa;
    cursor: pointer;
  }

  .selected {
    color: var(--button-text);
    background: var(--background-button)!important;
  }
</style>
