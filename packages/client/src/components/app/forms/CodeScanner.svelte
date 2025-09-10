<script>
  import { onMount } from "svelte"

  let CodeScannerComponent

  export let value
  export let disabled = false
  export let allowManualEntry = false
  export let autoConfirm = false
  export let scanButtonText = "Scan code"
  export let beepOnScan = false
  export let beepFrequency = 2637
  export let customFrequency = 1046
  export let preferredCamera = "environment"
  export let defaultZoom = 1
  export let validator

  onMount(async () => {
    // eslint-disable-next-line no-undef
    if (__USE_DYNAMIC_LOADING__) {
      CodeScannerComponent = (
        await import("./CodeScanner/CodeScanner.new.svelte")
      ).default
    } else {
      CodeScannerComponent = (
        await import("./CodeScanner/CodeScanner.old.svelte")
      ).default
    }
  })
</script>

{#if CodeScannerComponent}
  <svelte:component
    this={CodeScannerComponent}
    {value}
    {disabled}
    {allowManualEntry}
    {autoConfirm}
    {scanButtonText}
    {beepOnScan}
    {beepFrequency}
    {customFrequency}
    {preferredCamera}
    {defaultZoom}
    {validator}
    on:change
  />
{/if}
