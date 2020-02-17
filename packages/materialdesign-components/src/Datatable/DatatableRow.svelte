<script>
  import { getContext } from "svelte"

  export let isHeader = false
  let selected = false

  const cb = getContext("BBMD:data-table:cb")

  let elementName = isHeader ? "header-row" : "row"
  let modifiers = { selected }
  let props = { modifiers }

  let rowClass = cb.build({ elementName, props })
</script>

<tr class={rowClass} on:click={() => (selected = !selected)}>
  <slot />
</tr>
