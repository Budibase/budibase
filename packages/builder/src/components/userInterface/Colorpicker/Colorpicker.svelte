<script>
  import {onMount} from "svelte"
  import { getAndConvertHexa, getAndConvertRgba, getHSLA, hsvaToHexa, hsvaToRgba, getColorFormat, convertToHSVA } from "./utils.js"
  import Slider from "./Slider.svelte";
  import Palette from "./Palette.svelte";

  export let value = "rgba(255,255,255,1)";
  export let format = "hexa";

  let h = null;
  let s = null;
  let v = null;
  let a = null;

  onMount(() => {
    format = getColorFormat(value)
    if(format) {
      let hsva = convertToHSVA(value, format)
      setHSVA(hsva)
    }
})

  const hsvaIsNull = () => [h,s,v,a].every(c => c === null)

  function setFormatAndConvert() {
    if (value.startsWith('#')) {
      format = "hexa"
      return getAndConvertHexa(value)
    } else if (value.startsWith('rgba')) {
      format = "rgba"
      return getAndConvertRgba(value)
    }
  }

  function setHSVA([hue, sat, val, alpha]) {
    h = hue;
    s = sat;
    v = val;
    a = alpha;
  }

  //fired by choosing a color from the palette
  function setSaturationAndValue({detail}) {
    s = detail.s
    v = detail.v
    let res = convertHSVA()
    console.log("SAT-VAL", res)
  }
    
  function setHue(hue) {
    h = hue
    let res = convertHSVA()
    console.log("HUE",res)
  }

  function setAlpha(alpha) {
    a = alpha
    let res = convertHSVA()
    console.log("ALPHA",res)

  }

  function convertHSVA() {
    let hsva = [h, s, v, a]
    let _value = format === "hexa" ? hsvaToHexa(hsva, true) : hsvaToRgba(hsva, true)
    return _value;
    // onchange(_value)
  }

  // $: {
  //   if(!hsvaIsNull()) {
  //     let hsva = [h, s, v, a]
  //     // let t = value + "abs"
  //     value = format === "hexa" ? hsvaToHexa(hsva) : hsvaToRgba(hsva)
  //     debugger
  //     // console.log("VAL", value)
  //   }
  // }
</script>

<style>
  .colorpicker-container {
    display: flex;
    flex-direction: column;
    height: 300px;
    width: 250px;
    background: #ffffff;
    border: 1px solid #e8e8ef;
    border-radius: 2px;
  }
</style>

<div class="colorpicker-container">

  <Palette on:change={setSaturationAndValue} {h} {s} {v} {a} />

  <Slider type="hue" value={h} on:change={hue => setHue(hue.detail)} />

  <Slider type="alpha" value={a} on:change={alpha => setAlpha(alpha.detail)} />
</div>
