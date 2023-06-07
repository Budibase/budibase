<script>
  import LongFormCell from "./LongFormCell.svelte"

  export let onChange
  export let value
  export let api

  $: stringified = getStringifiedValue(value)

  const getStringifiedValue = value => {
    if (!value) {
      return value
    }
    try {
      return JSON.stringify(value, null, 2)
    } catch (error) {
      return null
    }
  }

  const parse = value => {
    const trimmed = value?.trim()
    if (!trimmed) {
      onChange(null)
      return
    }
    try {
      const parsed = JSON.parse(trimmed)
      onChange(parsed)
    } catch (error) {
      // Swallow
    }
  }
</script>

<LongFormCell {...$$props} bind:api value={stringified} onChange={parse} />
