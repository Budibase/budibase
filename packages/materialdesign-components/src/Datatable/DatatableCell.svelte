<script>
  import { getContext } from "svelte"
  import ClassBuilder from "../ClassBuilder.js"
  
  export let isHeader = false
  export let numeric = false
  export let _bb

  const cb = new ClassBuilder("data-table")

  let elementName = isHeader ? "header-cell" : "cell"
  let modifiers = { numeric }
  let props = { modifiers }
  let cellClass = cb.build({ elementName, props })
  let element

  $: element && _bb.attachChildren(element)

</script>

{#if isHeader}
  <th class={cellClass} role="columnheader" scope="col" bind:this={element}>
    <slot />
  </th>
{:else}
  <td class={cellClass} bind:this={element}>
    <slot />
  </td>
{/if}
