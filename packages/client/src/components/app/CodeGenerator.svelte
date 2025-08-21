<script lang="ts">
  import { getContext } from "svelte"
  import { onMount } from "svelte"
  import JsBarcode from "jsbarcode"
  import { createQrSvgString } from "@svelte-put/qr"

  export let value: string
  export let codeType: "QR Code" | "Barcode"
  export let showValue: boolean
  export let showLogo: boolean
  export let customLogo: string | undefined
  export let size: number
  export let primColor: string

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  let barcodeElement: SVGSVGElement

  function generateBarcode() {
    if (barcodeElement && value) {
      JsBarcode(barcodeElement, value, {
        displayValue: false, // Hide the library's built in value, optionally display it later
        width: size / 100,
        height: size,
      })
    }
  }

  let qrContainer: HTMLElement

  const generateQr = () => {
    if (qrContainer && codeType === "QR Code" && value) {
      const svg = createQrSvgString({
        data: value,
        logo: showLogo ? customLogo : "",
        moduleFill: primColor,
        anchorOuterFill: primColor,
        anchorInnerFill: primColor,
        width: size,
        height: size,
      })
      qrContainer.innerHTML = svg
    }
  }

  onMount(() => {
    if (codeType === "Barcode") {
      generateBarcode()
    } else {
      generateQr()
    }
  })

  $: if (codeType === "Barcode" && value && barcodeElement && size) {
    generateBarcode()
  }

  $: if (
    codeType === "QR Code" &&
    value &&
    qrContainer &&
    (showLogo !== undefined || customLogo !== undefined || size || primColor)
  ) {
    generateQr()
  }
</script>

<div
  class="overall"
  use:styleable={$component.styles}
  styles="border: 3px solid red; width: 100px; height: 200px;"
>
  {#if value}
    {#if codeType === "QR Code"}
      <div class="qr-container">
        <div bind:this={qrContainer} />
        <div class="qr-value" style="color: {primColor}; max-width: {size}px;">
          {showValue ? value : ""}
        </div>
      </div>
    {:else}
      <div class="barcode-container">
        <div class="logo-and-barcode" style="height: {size}px, width: 100%">
          {#if showLogo && customLogo}
            <img
              class="custom-logo"
              src={customLogo}
              alt="logo"
              style="height: {size}px"
            />
          {/if}
          {#if value}
            <svg class="barcode" bind:this={barcodeElement} height={size} />
          {/if}
        </div>
        {#if showValue}
          <div class="barcode-value">
            <p>{value}</p>
          </div>
        {/if}
      </div>
    {/if}
  {:else}
    <p>
      Please add a value to generate your {codeType === "QR Code"
        ? "QR Code"
        : "Barcode"}
    </p>
  {/if}
</div>

<style>
  .overall {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .qr-value {
    word-wrap: break-word;
    overflow-wrap: break-word;
    text-align: center;
  }
  .qr-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .barcode-container {
    max-width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: 12px;
    background-color: white;
  }
  .logo-and-barcode {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .logo-and-barcode img {
    margin-left: 10px;
  }

  .barcode-value p {
    margin: 0;
    color: black;
  }
</style>
