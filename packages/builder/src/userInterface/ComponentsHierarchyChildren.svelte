<script>
  import { last } from "lodash/fp"
  import { pipe } from "../common/core"

  export let components = []
  export let currentComponent
  export let onSelect = () => {}
  export let level = 0

  const capitalise = s => s.substring(0, 1).toUpperCase() + s.substring(1)
  const get_name = s => last(s.split("/"))

  const get_capitalised_name = name =>
    pipe(
      name,
      [get_name, capitalise]
    )

  // $: console.log(components)
</script>

<ul>
  {#each components as component}
    <li on:click|stopPropagation={() => onSelect(component)}>
      <span
        class="item"
        class:selected={currentComponent === component}
        style="padding-left: {level * 20 + 67}px">
        {get_capitalised_name(component._component)}
      </span>

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
    background: var(--background-button) !important;
  }
</style>
