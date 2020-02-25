<script>
  export let value = ""
  export let text = ""
  export let _bb

  let actualValue
  let actualText

  $: actualValue = value || text || ""
  $: actualText = text || value || ""
</script>

<option value={actualValue}>{actualText}</option>
