<script>
  import BbReferenceCell from "./BBReferenceCell.svelte"

  export let value
  export let onChange
  export let api

  $: arrayValue = (!Array.isArray(value) && value ? [value] : value) || []

  $: onValueChange = value => {
    value = value[0] || null
    onChange(value)
  }
</script>

<BbReferenceCell
  bind:api
  {...$$restProps}
  value={arrayValue}
  onChange={onValueChange}
  hideCounter={true}
/>
