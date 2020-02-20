<script>
  import { getContext } from "svelte";

  export let onSelect = () => {};
  export let isHeader = false;

  export let _bb

  let row = null;
  let selected = false;

  const cb = getContext("BBMD:data-table:cb");

  let elementName = isHeader ? "header-row" : "row";
  let modifiers = {};

  $: modifiers = { selected };
  $: props = { modifiers };
  $: rowClass = cb.build({ elementName, props });
  $: row && _bb.attachChildren(row)
  
  function rowSelected() {
    selected = !selected;
    onSelect();
  }
</script>

<tr bind:this={row} class={rowClass} on:click={rowSelected}>
  <slot />
</tr>
