<script>
  import { CoreDatePicker } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let enableTime = false
  export let defaultValue

  let fieldState
  let fieldApi

  const parseDate = val => {
    if (!val) {
      return null
    }
    let date
    if (isNaN(val)) {
      // Treat as date string of some sort
      date = new Date(val)
    } else {
      // Treat as numerical timestamp
      date = new Date(parseInt(val))
    }
    const time = date.getTime()
    if (isNaN(time)) {
      return null
    }
    // By rounding to the nearest second we avoid locking up in an endless
    // loop in the builder, caused by potentially enriching {{ now }} to every
    // millisecond.
    return new Date(Math.floor(time / 1000) * 1000)
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  defaultValue={parseDate(defaultValue)}
  type="datetime"
  bind:fieldState
  bind:fieldApi
>
  {#if fieldState}
    <CoreDatePicker
      value={$fieldState.value}
      on:change={e => fieldApi.setValue(e.detail)}
      disabled={$fieldState.disabled}
      error={$fieldState.error}
      id={$fieldState.fieldId}
      {enableTime}
      {placeholder}
    />
  {/if}
</Field>
