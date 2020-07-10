<script>
  import { onMount, createEventDispatcher } from "svelte"
  import { fade } from "svelte/transition"
  import Swatch from "./Swatch.svelte"
  import CheckedBackground from "./CheckedBackground.svelte"
  import { buildStyle } from "../helpers.js"
  import {
    getColorFormat,
    convertToHSVA,
    convertHsvaToFormat,
  } from "../utils.js"
  import Slider from "./Slider.svelte"
  import Palette from "./Palette.svelte"
  import ButtonGroup from "./ButtonGroup.svelte"
  import Input from "./Input.svelte"
  import Portal from "./Portal.svelte"
  import { keyevents } from "../actions"

  export let value = "#3ec1d3ff"
  export let open = false
  export let swatches = []

  export let disableSwatches = false
  export let format = "hexa"
  export let style = ""
  export let pickerHeight = 0
  export let pickerWidth = 0

  let colorPicker = null
  let adder = null
  let swatchesSetFromLocalStore = false

  let h = 0
  let s = 0
  let v = 0
  let a = 0

  const dispatch = createEventDispatcher()

  onMount(() => {
    if (!swatches.length > 0) {
      //Don't use locally stored recent colors if swatches have been passed as props
      swatchesSetFromLocalStore = true
      swatches = getRecentColors() || []
    }

    if (swatches.length > 12) {
      console.warn(
        `Colorpicker - ${swatches.length} swatches were provided. Only the first 12 swatches will be displayed.`
      )
    }

    if (colorPicker) {
      colorPicker.focus()
    }

    if (format) {
      convertAndSetHSVA()
    }
  })

  function getRecentColors() {
    let colorStore = localStorage.getItem("cp:recent-colors")
    if (colorStore) {
      return JSON.parse(colorStore)
    }
  }

  function handleEscape() {
    if (open) {
      open = false
    }
  }

  function setRecentColors(color) {
    const s = swatchesSetFromLocalStore
      ? swatches
      : [...getRecentColors(), color]
    localStorage.setItem("cp:recent-colors", JSON.stringify(s))
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
    format = f.detail
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
      if (swatches.length === 12) {
        swatches.splice(0, 1)
      }

      if (!swatches.includes(value)) {
        swatches = [...swatches, value]
        setRecentColors(value)
      }

      dispatch("addswatch", value)
    }
  }

  function removeSwatch(idx) {
    let [removedSwatch] = swatches.splice(idx, 1)
    swatches = swatches
    dispatch("removeswatch", removedSwatch)
    if (swatchesSetFromLocalStore) {
      //as could be a swatch not present in local storage
      setRecentColors()
    }
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
  $: hasSwatches = swatches.length > 0
</script>

<Portal>
  <div
    class="colorpicker-container"
    use:keyevents={{ Escape: handleEscape }}
    transition:fade
    bind:this={colorPicker}
    {style}
    tabindex="0"
    bind:clientHeight={pickerHeight}
    bind:clientWidth={pickerWidth}>

    <div class="palette-panel">
      <Palette on:change={setSaturationAndValue} {h} {s} {v} {a} />
    </div>

    <div class="control-panel">
      <div class="alpha-hue-panel">
        <div>
          <CheckedBackground borderRadius="50%" backgroundSize="8px">
            <div
              class="selected-color"
              title={value}
              style={selectedColorStyle} />
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
          {#if hasSwatches}
            {#each swatches as color, idx}
              {#if idx < 12}
                <Swatch
                  {color}
                  on:click={() => applySwatch(color)}
                  on:removeswatch={() => removeSwatch(idx)} />
              {/if}
            {/each}
          {/if}
          {#if swatches.length < 12}
            <div
              tabindex="0"
              title="Add Swatch"
              use:keyevents={{ Enter: addSwatch }}
              bind:this={adder}
              transition:fade
              class="adder"
              class:shrink={hasSwatches}
              on:click={addSwatch}>
              <span>&plus;</span>
            </div>
          {/if}
        </div>
      {/if}

      <div class="format-input-panel">
        <ButtonGroup {format} on:click={changeFormatAndConvert} />
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
    transition: top 0.1s, left 0.1s;
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
    transition: flex 0.3s;
    justify-content: center;
    align-items: center;
    background: #f1f3f4;
    cursor: pointer;
    border: 1px solid #d4d4d4;
    border-radius: 8px;
    margin-left: 5px;
    margin-top: 3px;
    font-weight: 500;
    outline-color: #003cb0;
    outline-width: thin;
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
