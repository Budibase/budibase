<script>
  import AttachmentCell from "./AttachmentCell.svelte"

  export let value
  export let onChange

  $: arrayValue = (!Array.isArray(value) && value ? [value] : value) || []

  $: onFileChange = value => {
    value = value[0] || null
    onChange(value)
  }
</script>

<AttachmentCell
  {...$$restProps}
  maximum={1}
  value={arrayValue}
  onChange={onFileChange}
/>
