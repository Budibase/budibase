<script>
  import Field from "./Field.svelte"
  import CodeScanner from "./CodeScanner.svelte"

  export let field
  export let label
  export let type = "barcodeqr"
  export let disabled = false
  export let validation
  export let defaultValue = ""
  export let onChange
  export let allowManualEntry
  export let scanButtonText

  let fieldState
  let fieldApi

  $: scanText = scanButtonText || "Scan code"

  const handleUpdate = e => {
    const changed = fieldApi.setValue(e.detail)
    if (onChange && changed) {
      onChange({ value: e.detail })
    }
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  {validation}
  {defaultValue}
  {type}
  bind:fieldState
  bind:fieldApi
>
  {#if fieldState}
    <CodeScanner
      value={fieldState.value}
      on:change={handleUpdate}
      disabled={fieldState.disabled}
      {allowManualEntry}
      scanButtonText={scanText}
    />
  {/if}
</Field>
