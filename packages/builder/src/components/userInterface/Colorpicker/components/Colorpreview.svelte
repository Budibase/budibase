<script>
  import Colorpicker from "./Colorpicker.svelte"
  import CheckedBackground from "./CheckedBackground.svelte"
  import { createEventDispatcher, beforeUpdate, onMount } from "svelte"

  import { buildStyle, debounce } from "../helpers.js"
  import { fade } from "svelte/transition"
  import { getColorFormat } from "../utils.js"

  export let value = "#3ec1d3ff"
  export let swatches = []
  export let disableSwatches = false
  export let open = false
  export let width = "25px"
  export let height = "25px"

  let format = "hexa"
  let dimensions = { top: 0, bottom: 0, right: 0, left: 0 }
  let positionSide = "top"
  let colorPreview = null

  let previewHeight = null
  let previewWidth = null
  let pickerWidth = 0
  let pickerHeight = 0

  let errorMsg = null

  const dispatch = createEventDispatcher()

  beforeUpdate(() => {
    format = getColorFormat(value)
    if (!format) {
      errorMsg = `Colorpicker - ${value} is an unknown color format. Please use a hex, rgb or hsl value`
      console.error(errorMsg)
    } else {
      errorMsg = null
    }
  })

  function openColorpicker(event) {
    if (colorPreview) {
      open = true
    }
  }

  function onColorChange(color) {
    value = color.detail
    dispatch("change", color.detail)
  }

  function calculateDimensions() {
    const {
      top: spaceAbove,
      width,
      bottom,
      right,
      left,
    } = colorPreview.getBoundingClientRect()

    const spaceBelow = window.innerHeight - bottom
    const previewCenter = previewWidth / 2

    let y, x

    if (spaceAbove > spaceBelow) {
      positionSide = "bottom"
      y = window.innerHeight - spaceAbove
    } else {
      positionSide = "top"
      y = bottom
    }

    x = left + previewCenter - 220 / 2

    dimensions = { [positionSide]: y.toFixed(1), left: x.toFixed(1) }
  }

  $: if (open && colorPreview) {
    calculateDimensions()
  }

  $: previewStyle = buildStyle({ width, height, background: value })
  $: errorPreviewStyle = buildStyle({ width, height })
  $: pickerStyle = buildStyle({
    [positionSide]: `${dimensions[positionSide]}px`,
    left: `${dimensions.left}px`,
  })
</script>

<svelte:window on:resize={debounce(calculateDimensions, 200)} />

<div class="color-preview-container">
  {#if !errorMsg}
    <CheckedBackground borderRadius="3px" backgroundSize="8px">
      <div
        bind:this={colorPreview}
        bind:clientHeight={previewHeight}
        bind:clientWidth={previewWidth}
        title={value}
        class="color-preview"
        style={previewStyle}
        on:click={openColorpicker} />
    </CheckedBackground>

    {#if open}
      <Colorpicker
        style={pickerStyle}
        on:change={onColorChange}
        on:addswatch
        on:removeswatch
        bind:format
        bind:value
        bind:pickerHeight
        bind:pickerWidth
        bind:open
        {swatches}
        {disableSwatches} />
      <div on:click|self={() => (open = false)} class="overlay" />
    {/if}
  {:else}
    <div
      class="color-preview preview-error"
      title="Invalid Color"
      style={errorPreviewStyle}>
      <span>&times;</span>
    </div>
  {/if}
</div>

<style>
  .color-preview-container {
    display: flex;
    flex-flow: row nowrap;
    height: fit-content;
  }

  .color-preview {
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid #dedada;
  }

  .preview-error {
    background: #cccccc;
    color: #808080;
    text-align: center;
    font-size: 18px;
    cursor: not-allowed;
  }

  /* .picker-container {
    position: absolute;
    z-index: 3;
    width: fit-content;
    height: fit-content;
  } */

  .overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
</style>
