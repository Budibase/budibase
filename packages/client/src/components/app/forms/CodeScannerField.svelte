<script>
  import Field from "./Field.svelte"
  import CodeScanner from "../CodeScanner.svelte"

  export let field
  export let label
  export let type = "code"
  export let disabled = false
  export let validation
  export let defaultValue = ""
  export let onChange

  let fieldState
  let fieldApi

  let scannedCode
  let loaded = false

  const handleInput = () => {
    const changed = fieldApi.setValue(scannedCode)
    if (onChange && changed) {
      onChange({ value: scannedCode })
    }
  }

  $: if (!loaded && !scannedCode && fieldState?.value) {
    scannedCode = fieldState.value + ""
    loaded = true
  }

  /*
    QR    Nimiq has rollup issues?
    QR    qrcodejs 12b bundle?
            https://github.com/davidshimjs/qrcodejs
    BOTH  html5-qrcode has a 330k bundle
            https://github.com/mebjas/html5-qrcode
    BOTH  zxing 360k bundle size
            https://github.com/zxing-js/library
  */
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
    <CodeScanner bind:code={scannedCode} on:input={handleInput} />
  {/if}
</Field>
