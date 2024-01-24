<script>
  import Field from "./Field.svelte"
  import CodeScanner from "./CodeScanner.svelte"

  export let field
  export let label
  export let type = "barcodeqr"
  export let disabled = false
  export let readonly = false
  export let validation
  export let defaultValue = ""
  export let onChange
  export let allowManualEntry
  export let autoConfirm
  export let scanButtonText
  export let beepOnScan
  export let beepFrequency
  export let customFrequency
  export let preferredCamera
  export let helpText = null

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
  {readonly}
  {validation}
  {defaultValue}
  {type}
  {helpText}
  bind:fieldState
  bind:fieldApi
>
  {#if fieldState}
    <CodeScanner
      value={fieldState.value}
      on:change={handleUpdate}
      disabled={fieldState.disabled || fieldState.readonly}
      {allowManualEntry}
      {autoConfirm}
      scanButtonText={scanText}
      {beepOnScan}
      {beepFrequency}
      {customFrequency}
      {preferredCamera}
      validator={fieldState.validator}
    />
  {/if}
</Field>
