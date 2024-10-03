<script>
  import { getContext } from "svelte"
  import { onMount, afterUpdate } from "svelte"
  import JsBarcode from "jsbarcode"
  import { createQrSvgString, createQrSvgDataUrl } from "@svelte-put/qr"
  import "@spectrum-css/vars/dist/spectrum-global.css"

  export let value
  export let showQR
  export let showValue
  export let customLogo
  export let size = 200
  export let primColor

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
        lineColor: "black",
        background: "white",
      })
    }
  }

  onMount(() => {
    if (!showQR) {
      generateBarcode()
    }
  })

  afterUpdate(() => {
    if (!showQR) {
      generateBarcode()
    }
  })
</script>

<div class="overall" use:styleable={$component.styles}>
  {#if value}
    {#if showQR}
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
      <div class="barcode-container">
        <div class="logo-and-barcode">
          {#if customLogo}
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
            {value}
          </div>
        {/if}
      </div>
    {/if}
  {:else}
    <p>Please add a value to generate your {showQR ? "QR Code" : "Barcode"}</p>
  {/if}
</div>

<style>
  .overall {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .barcode-container {
    background-color: white;
  }

  .logo-and-barcode {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .barcode-value {
    color: black;
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
