<script context="module">
  const NumberFormatter = Intl.NumberFormat()
</script>

<script>
  import TextCell from "./TextCell.svelte"

  export let api
  export let onChange

  const numberOnChange = value => {
    const float = parseFloat(value)
    const newValue = isNaN(float) ? null : float
    onChange(newValue)
  }

  const formatNumber = value => {
    const type = typeof value
    if (type !== "string" && type !== "number") {
      return ""
    }
    if (type === "string" && !value.trim().length) {
      return ""
    }
    const res = NumberFormatter.format(value)
    return res === "NaN" ? value : res
  }
</script>

<TextCell
  {...$$props}
  onChange={numberOnChange}
  bind:api
  type="number"
  format={formatNumber}
/>
