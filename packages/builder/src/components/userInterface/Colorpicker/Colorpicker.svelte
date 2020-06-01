<script>
  import {onMount} from "svelte"
  import { getAndConvertHexa, getAndConvertRgba, getHSLA, hsvaToHexa, hsvaToRgba } from "./utils.js"
  import Slider from "./Slider.svelte";
  import Palette from "./Palette.svelte";

  export let value = "#00bfffff";
  export let format = "hexa";

  let h = 0;
  let s = 0;
  let v = 0;
  let a = 1;

  onMount(() => {
    let hsva = getFormatAndConvert(value)
    setHSVA(hsva)
  })

  function getFormatAndConvert() {
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
    s = sat / 100;
    v - val / 100;
    a = alpha;
  }

  function setSaturationAndValue({detail}) {
    s = detail.s
    v = detail.v
  }

  // $: {
  //   let hsva = [h, s, v, a]
  //   value = format === "hexa" ? hsvaToHexa(hsva) : hsvaToRgba(hsva)
  //   console.log("VAL", value)
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

  <Slider type="hue" value={h} on:change={hue => (h = hue.detail)} />

  <Slider type="alpha" value={a} on:change={alpha => (a = alpha.detail)} />
</div>
