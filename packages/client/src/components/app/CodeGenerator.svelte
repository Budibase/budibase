<script lang="ts">
  import { getContext } from "svelte"
  import { onMount, afterUpdate } from "svelte"
  import JsBarcode from "jsbarcode"
  import { createQrSvgString } from "@svelte-put/qr"
  import "@spectrum-css/vars/dist/spectrum-global.css"

  export let value: string
  export let codeType: "QR Code" | "Barcode"
  export let showValue: boolean
  export let showLogo: boolean
  export let customLogo: string
  export let size: number
  export let primColor: string
  export let vertical: boolean

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  const generateBarcode = () => {
    let barcodeSize = size / 100
    if (!!value) {
      JsBarcode("#barcode-img", value, {
        displayValue: false, // Hide the library's built in value, optionally display it later
        width: barcodeSize,
        height: size,
      })
    }
  }
  onMount(() => {
    if (codeType === "Barcode") {
      generateBarcode()
    }
  })
  afterUpdate(() => {
    if (codeType === "Barcode") {
      generateBarcode()
    }
  })
</script>

<div
  class="overall {vertical ? 'vertical' : ''}"
  use:styleable={$component.styles}
  styles="border: 3px solid red; width: 100px; height: 200px;"
>
  {#if value}
    {#if codeType === "QR Code"}
      <div class="qr-container">
        {@html createQrSvgString({
          data: value,
          logo: showLogo ? customLogo : "",
          moduleFill: primColor,
          anchorOuterFill: primColor,
          anchorInnerFill: primColor,
          width: size,
          height: size,
        })}
        <div class="qr-value" style="color: {primColor}; max-width: {size}px;">
          {showValue ? value : ""}
        </div>
      </div>
    {:else}
      <div id="barcode-container">
        <div id="logo-and-barcode" style="height: {size}px, width: 100%">
          {#if showLogo && customLogo}
            <img
              id="custom-logo"
              src={customLogo}
              alt="logo"
              class="custom-logo"
              style="height: {size}px"
            />
          {/if}
          <img
            id="barcode-img"
            alt="barcode {value ? value : ''}"
            class="barcode-img"
          />
        </div>
        {#if showValue}
          <div id="barcode-value">
            <p />
            {value}
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
  #barcode-container {
    max-width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: 12px;
    background-color: white;
  }
  #logo-and-barcode {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
</style>
