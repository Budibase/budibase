<script>
  import { onMount, createEventDispatcher } from "svelte"
  import { fade } from "svelte/transition"
  import Swatch from "./Swatch.svelte"
  import CheckedBackground from "./CheckedBackground.svelte"
  import { buildStyle } from "./helpers.js"
  import {
    getColorFormat,
    convertToHSVA,
    convertHsvaToFormat,
  } from "./utils.js"
  import Slider from "./Slider.svelte"
  import Palette from "./Palette.svelte"
  import ButtonGroup from "./ButtonGroup.svelte"
  import Input from "./Input.svelte"
  import Portal from "./Portal.svelte"

  export let value = "#3ec1d3ff"
  export let open = false;
  export let swatches = [] //TODO: Safe swatches - limit to 12. warn in console
  export let disableSwatches = false
  export let format = "hexa"
  export let style = ""
  export let pickerHeight = 0
  export let pickerWidth = 0

  let colorPicker = null
  let adder = null

  let h = null
  let s = null
  let v = null
  let a = null

  const dispatch = createEventDispatcher()

  onMount(() => {
    if (!swatches.length > 0) {
      //Don't use locally stored recent colors if swatches have been passed as props
      getRecentColors()
    }

    if(colorPicker) {
      colorPicker.focus()
    }

    if (format) {
      convertAndSetHSVA()
    }
  })

  function getRecentColors() {
    let colorStore = localStorage.getItem("cp:recent-colors")
    if (colorStore) {
      swatches = JSON.parse(colorStore)
    }
  }

  function handleEscape(e) {
    if(open && e.key === "Escape") {
      open = false
    }
  }

  function setRecentColor(color) {
    if (swatches.length === 12) {
      swatches.splice(0, 1)
    }
    if (!swatches.includes(color)) {
      swatches = [...swatches, color]
      localStorage.setItem("cp:recent-colors", JSON.stringify(swatches))
    }
  }

  function convertAndSetHSVA() {
    let hsva = convertToHSVA(value, format)
    setHSVA(hsva)
  }

  function setHSVA([hue, sat, val, alpha]) {
    h = hue
    s = sat
    v = val
    a = alpha
  }

  //fired by choosing a color from the palette
  function setSaturationAndValue({ detail }) {
    s = detail.s
    v = detail.v
    value = convertHsvaToFormat([h, s, v, a], format)
    dispatchValue()
  }

  function setHue({ color, isDrag }) {
    h = color
    value = convertHsvaToFormat([h, s, v, a], format)
    if (!isDrag) {
      dispatchValue()
    }
  }

  function setAlpha({ color, isDrag }) {
    a = color === "1.00" ? "1" : color
    value = convertHsvaToFormat([h, s, v, a], format)
    if (!isDrag) {
      dispatchValue()
    }
  }

  function dispatchValue() {
    dispatch("change", value)
  }

  function changeFormatAndConvert(f) {
    format = f
    value = convertHsvaToFormat([h, s, v, a], format)
  }

  function handleColorInput(text) {
    let format = getColorFormat(text)
    if (format) {
      value = text
      convertAndSetHSVA()
    }
  }

  function dispatchInputChange() {
    if (format) {
      dispatchValue()
    }
  }

  function addSwatch() {
    if (format) {
      dispatch("addswatch", value)
      setRecentColor(value)
    }
  }

  function removeSwatch(idx) {
    let removedSwatch = swatches.splice(idx, 1)
    swatches = swatches
    dispatch("removeswatch", removedSwatch)
    localStorage.setItem("cp:recent-colors", JSON.stringify(swatches))
  }

  function applySwatch(color) {
    if (value !== color) {
      format = getColorFormat(color)
      if (format) {
        value = color
        convertAndSetHSVA()
        dispatchValue()
      }
    }
  }

  $: border = v > 90 && s < 5 ? "1px dashed #dedada" : ""
  $: selectedColorStyle = buildStyle({ background: value, border })
  $: shrink = swatches.length > 0
  
</script>


<Portal>
  <div
    class="colorpicker-container"
    transition:fade
    bind:this={colorPicker}
    {style}
    tabindex="0"
    on:keydown={handleEscape}
    bind:clientHeight={pickerHeight}
    bind:clientWidth={pickerWidth}>

    <div class="palette-panel">
      <Palette on:change={setSaturationAndValue} {h} {s} {v} {a} />
    </div>

    <div class="control-panel">
      <div class="alpha-hue-panel">
        <div>
          <CheckedBackground borderRadius="50%" backgroundSize="8px">
            <div class="selected-color" style={selectedColorStyle} />
          </CheckedBackground>
        </div>
        <div>
          <Slider
            type="hue"
            value={h}
            on:change={hue => setHue(hue.detail)}
            on:dragend={dispatchValue} />

          <CheckedBackground borderRadius="10px" backgroundSize="7px">
            <Slider
              type="alpha"
              value={a}
              on:change={(alpha, isDrag) => setAlpha(alpha.detail, isDrag)}
              on:dragend={dispatchValue} />
          </CheckedBackground>

        </div>
      </div>

      {#if !disableSwatches}
        <div transition:fade class="swatch-panel">
          {#if swatches.length > 0}
            {#each swatches as color, idx}
              <Swatch
                {color}
                on:click={() => applySwatch(color)}
                on:removeswatch={() => removeSwatch(idx)} />
            {/each}
          {/if}
          {#if swatches.length !== 12}
            <div
              bind:this={adder}
              transition:fade
              class="adder"
              on:click={addSwatch}
              class:shrink>
              <span>&plus;</span>
            </div>
          {/if}
        </div>
      {/if}

      <div class="format-input-panel">
        <ButtonGroup {format} onclick={changeFormatAndConvert} />
        <Input
          {value}
          on:input={event => handleColorInput(event.target.value)}
          on:change={dispatchInputChange} />
      </div>
    </div>

  </div>
</Portal>

<style>
  .colorpicker-container {
    position: absolute;
    outline: none;
    z-index: 3;
    display: flex;
    font-size: 11px;
    font-weight: 400;
    flex-direction: column;
    margin: 5px 0px;
    height: auto;
    width: 220px;
    background: #ffffff;
    border-radius: 2px;
    box-shadow: 0 0.15em 1.5em 0 rgba(0, 0, 0, 0.1),
      0 0 1em 0 rgba(0, 0, 0, 0.03);
  }

  .palette-panel {
    flex: 1;
  }

  .control-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 8px;
    background: white;
    border: 1px solid #d2d2d2;
    color: #777373;
  }

  .alpha-hue-panel {
    display: grid;
    grid-template-columns: 25px 1fr;
    grid-gap: 15px;
    justify-content: center;
    align-items: center;
  }

  .selected-color {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .swatch-panel {
    flex: 0 0 15px;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    padding: 0 5px;
    max-height: 56px;
  }

  .adder {
    flex: 1;
    height: 20px;
    display: flex;
    transition: flex 0.5s;
    justify-content: center;
    align-items: center;
    background: #f1f3f4;
    cursor: pointer;
    border: 1px solid #d4d4d4;
    border-radius: 8px;
    margin-left: 5px;
    margin-top: 3px;
    font-weight: 500;
  }

  .shrink {
    flex: 0 0 20px;
  }

  .format-input-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 3px;
  }
</style>
