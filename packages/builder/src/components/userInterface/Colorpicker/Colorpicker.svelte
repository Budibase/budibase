<script>
  import Slider from "./Slider.svelte";
  import Palette from "./Palette.svelte";

  export let value = "#00000000";

  let h = 0;
  let s = 0;
  let v = 0;
  let a = 1;
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

  <Palette {h} {a} />

  <Slider type="hue" on:change={hue => (h = hue.detail)} />

  <Slider type="alpha" on:change={alpha => (a = alpha.detail)} />
</div>
