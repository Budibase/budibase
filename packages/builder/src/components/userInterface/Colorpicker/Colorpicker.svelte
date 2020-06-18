<script>
  import { onMount, createEventDispatcher } from "svelte";
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

  let h = null;
  let s = null;
  let v = null;
  let a = null;

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (format) {
      convertAndSetHSVA()
    }
  });

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
    dispatch("change", value)
  }

  function setHue(hue) {
    h = hue;
    value = convertHsvaToFormat([h, s, v, a], format);    
  }

  function setAlpha(alpha) {
    a = alpha === "1.00" ? "1" :alpha;
    value = convertHsvaToFormat([h, s, v, a], format);    
  }

  function changeFormatAndConvert(f) {
    format = f;
    value = convertHsvaToFormat([h, s, v, a], format);
  }

  function handleColorInput(text) {
    let f = getColorFormat(text)
    if(f) {
      format = f;
      value = text
      convertAndSetHSVA()
      dispatch("change", value)
    }
  }

    $: border = s < 10 ? "1px dashed #dedada" : ""
    $: style = buildStyle({background: value, border})
</script>

<style>
  .colorpicker-container {
    display: flex;
    font-size: 11px;
    font-weight: 400;
    flex-direction: column;
    height: 265px;
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

  .format-input-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>

<div class="colorpicker-container">

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
        <Slider type="hue" value={h} on:change={hue => setHue(hue.detail)} />

        <CheckedBackground borderRadius="10px" backgroundSize="7px">
          <Slider
            type="alpha"
            value={a}
            on:change={alpha => setAlpha(alpha.detail)} />
        </CheckedBackground>
        
      </div>
    </div>

    <div class="format-input-panel">
      <ButtonGroup {format} onclick={changeFormatAndConvert} />
      <Input {value} on:input={event => handleColorInput(event.target.value)} />
    </div>
  </div>

</div>
