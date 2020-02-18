<script>
  import { getContext } from "svelte"

  export let isHeader = false
  export let numeric = false

  const cb = getContext("BBMD:data-table:cb")

  let elementName = isHeader ? "header-cell" : "cell"
  let modifiers = { numeric }
  let props = { modifiers }
  let cellClass = cb.build({ elementName, props })
</script>

{#if isHeader}
  <th class={cellClass} role="columnheader" scope="col">
    <slot />
  </th>
{:else}
  <td class={cellClass}>
    <slot />
  </td>
{/if}
