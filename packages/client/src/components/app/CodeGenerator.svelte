<script>
  import { getContext } from "svelte"
  import { onMount, afterUpdate } from "svelte"
  import JsBarcode from "jsbarcode"
  import { createQrSvgString, createQrSvgDataUrl } from "@svelte-put/qr"
  import "@spectrum-css/vars/dist/spectrum-global.css"
  import { sdk } from "@budibase/shared-core"
  import { orgStore } from "stores"

  export let value
  export let codeType
  export let showValue
  export let showLogo
  export let customLogo
  export let size
  export let primColor
  export let invertColors

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  const generateBarcode = () => {
    console.log(size)
    let barcodeSize = size / 100
    if (value) {
      JsBarcode("#barcode", value, {
        displayValue: false, // Hide the library's built in value, optionally display it later
        width: barcodeSize,
        height: size,
        lineColor: invertColors ? "white" : "black",
        background: invertColors ? "black" : "white",
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

<div class="overall" use:styleable={$component.styles}>
  {#if value}
    {#if codeType === "QR Code"}
      <div class="qr-container">
        {@html createQrSvgString({
          data: value,
          logo: customLogo,
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
      <div
        class="barcode-container"
        style="background-color: {invertColors ? 'black' : 'white'}"
      >
        <div class="logo-and-barcode">
          {#if showLogo && customLogo}
            <img
              src={customLogo}
              alt="logo"
              class="custom-logo"
              style="height: {size}px;"
            />
          {/if}
          <img
            id="barcode"
            alt="barcode {value ? value : ''}"
            class="barcode-image"
          />
        </div>
        {#if showValue}
          <div class="barcode-value">
            <p style="background-color: {invertColors ? 'white' : 'black'}" />
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

  .logo-and-barcode {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .barcode-value {
    text-align: center;
    padding-bottom: 5px;
  }

  .custom-logo {
    padding-left: 10px;
    transform: rotate(90);
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
</style>
