<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { fade } from 'svelte/transition';
  import CheckedBackground from "./CheckedBackground.svelte"
  import {buildStyle} from "./helpers.js"
  import {
    getColorFormat,
    convertToHSVA,
    convertHsvaToFormat
  } from "./utils.js";
  import Slider from "./Slider.svelte";
  import Palette from "./Palette.svelte";
  import ButtonGroup from "./ButtonGroup.svelte";
  import Input from "./Input.svelte";

  export let value = "#3ec1d3ff";
  export let format = "hexa";
  
  let recentColors = []

  export let pickerHeight = 0;
  export let pickerWidth = 0;

  let h = null;
  let s = null;
  let v = null;
  let a = null;

  const dispatch = createEventDispatcher();

  onMount(() => {
    getRecentColors()

    if (format) {
      convertAndSetHSVA()
    }
  });

  function getRecentColors() {
    let colorStore = localStorage.getItem("cp:recent-colors")
    if (colorStore) {
      recentColors = JSON.parse(colorStore)
    }
  }

  function setRecentColor(color) {
    if (recentColors.length === 6) {
      recentColors.splice(0, 1)
    }
    if (!recentColors.includes(color)) {
      recentColors = [...recentColors, color]
      localStorage.setItem("cp:recent-colors", JSON.stringify(recentColors))
    }
  }

  function convertAndSetHSVA() {
    let hsva = convertToHSVA(value, format);
    setHSVA(hsva);
  }

  function setHSVA([hue, sat, val, alpha]) {
    h = hue;
    s = sat;
    v = val;
    a = alpha;
  }

  //fired by choosing a color from the palette
  function setSaturationAndValue({ detail }) {
    s = detail.s;
    v = detail.v;
    value = convertHsvaToFormat([h, s, v, a], format);
    setRecentColor(value)
    dispatchValue()
  }

  function setHue({color, isDrag}) {
    h = color;
    value = convertHsvaToFormat([h, s, v, a], format);   
    if(!isDrag) {
      setRecentColor(value)
      dispatchValue()
    } 
  }

  function setAlpha({color, isDrag}) {
    a = color === "1.00" ? "1" : color;
    value = convertHsvaToFormat([h, s, v, a], format);    
    if(!isDrag) {
        setRecentColor(value)
        dispatchValue()
      } 
  }

  function dispatchValue() {
    dispatch("change", value)
  }

  function changeFormatAndConvert(f) {
    format = f;
    value = convertHsvaToFormat([h, s, v, a], format);
  }

  function handleColorInput(text) {
    let format = getColorFormat(text)
    if(format) {
      value = text
      convertAndSetHSVA()
    }
  }

  function dispatchInputChange() {
    if(format) {
      setRecentColor(value)
      dispatchValue()
    }
  }
  

  function applyRecentColor(color) {
    if(value !== color) {
      format = getColorFormat(color)
      if(format) {
        value = color
        convertAndSetHSVA()
        dispatchValue()
      }
    }
  }
    $: border = (v > 90 && s < 5) ? "1px dashed #dedada" : ""
    $: style = buildStyle({background: value, border})
</script>

<style>
  .colorpicker-container {
    display: flex;
    font-size: 11px;
    font-weight: 400;
    flex-direction: column;
    /* height: 265px; */
    height: auto;
    width: 220px;
    background: #ffffff;
    border-radius: 2px;
    box-shadow: 0 0.15em 1.5em 0 rgba(0,0,0,.1), 0 0 1em 0 rgba(0,0,0,.03);
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

  .recent-color-panel {
    flex: 0 0 15px;
    display: grid;
    grid-gap: 10px;
    justify-content: flex-start;
    grid-auto-flow: column;
    padding: 5px;
    margin-left: 6px;
  }

  .recent-color {
    cursor: pointer;
    border-radius: 6px;
    border: 1px solid #dedada;  
    height: 20px; 
    width: 20px;   
  }

  .format-input-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>

<div class="colorpicker-container" bind:clientHeight={pickerHeight} bind:clientWidth={pickerWidth}>

  <div class="palette-panel">
    <Palette on:change={setSaturationAndValue} {h} {s} {v} {a} />
  </div>

  <div class="control-panel">
    <div class="alpha-hue-panel">
      <div>
        <CheckedBackground borderRadius="50%" backgroundSize="8px">
          <div class="selected-color" {style} />
        </CheckedBackground>
      </div>
      <div>
        <Slider type="hue" value={h} on:change={(hue) => setHue(hue.detail)} on:dragend={dispatchValue} />

        <CheckedBackground borderRadius="10px" backgroundSize="7px">
          <Slider
            type="alpha"
            value={a}
            on:change={(alpha, isDrag) => setAlpha(alpha.detail, isDrag)} 
            on:dragend={dispatchValue}
            />
        </CheckedBackground>
        
      </div>
    </div>

    {#if recentColors.length > 0}
      <div transition:fade class="recent-color-panel">
        {#each recentColors as color}
          <CheckedBackground borderRadius="6px"> 
            <div transition:fade class="recent-color" style={`background: ${color};`} on:click={() => applyRecentColor(color)} />
          </CheckedBackground>
        {/each}
      </div>
    {/if}

    <div class="format-input-panel">
      <ButtonGroup {format} onclick={changeFormatAndConvert} />
      <Input {value} on:input={event => handleColorInput(event.target.value)} on:change={dispatchInputChange} />
    </div>
  </div>

</div>
