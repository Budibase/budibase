<script>
  import { DatePicker } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { styleable } = getContext("app")

  export let placeholder
  export let value
  export let styles

  function handleChange(event) {
    const [fullDate] = event.detail
    value = fullDate
  }
</script>

<div use:styleable={styles}>
  <DatePicker {placeholder} on:change={handleChange} {value} />
</div>
