<script>
  import { last } from "lodash/fp";
  import { pipe } from "../common/core";

  export let components = [];
  export let onSelect = () => {};

  const capitalise = s => s.substring(0,1).toUpperCase() + s.substring(1);
  const get_name = s => last(s.split('/'));
  const get_capitalised_name = name => pipe(name, [get_name,capitalise]);
</script>

{#each components as component}
  <ul>
    <li on:click|stopPropagation={() => onSelect(component)}>
      {get_capitalised_name(component._component)}

      {#if component._children}
        <svelte:self components={component._children}/>
      {/if}
    </li>

  </ul>
{/each}
