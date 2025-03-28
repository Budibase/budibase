<script>
  import { formatNumber } from "@budibase/frontend-core"
  import TextCell from "./TextCell.svelte"

  export let api
  export let onChange

  const numberOnChange = value => {
    const float = parseFloat(value)
    const newValue = isNaN(float) ? null : float
    onChange(newValue)
  }
</script>

<TextCell
  {...$$props}
  onChange={numberOnChange}
  bind:api
  type="number"
  format={formatNumber}
/>
