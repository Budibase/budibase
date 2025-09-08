<script>
  import CodeScannerNew from "./CodeScanner/CodeScanner.new.svelte"
  import CodeScannerOld from "./CodeScanner/CodeScanner.old.svelte"

  let CodeScannerComponent

  // @ts-ignore
  if (__USE_DYNAMIC_LOADING__) {
    CodeScannerComponent = CodeScannerNew
  } else {
    CodeScannerComponent = CodeScannerOld
  }

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
</script>

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
