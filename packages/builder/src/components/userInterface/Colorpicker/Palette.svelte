<script>
  import { onMount } from "svelte";
  export let h,
    a = 0;

  let palette;
  let dimensions;

  onMount(() => {
    if (palette) {
      dimensions = palette.getBoundingClientRect();
    }
  });

  function handleClick(event) {
    const { left, top, width, height } = dimensions;
    let pickerX = (event.clientX - left) / width;
    let pickerY = (event.clientY - top) / height;
    //Saturation - adds white: pickerX * 100
    //value - adds black: 100 - pickerY * 100
    console.log("X", pickerX, "Y", pickerY);
  }

  $: paletteGradient = `linear-gradient(to top, rgba(0, 0, 0, 1), transparent),
    linear-gradient(to left, hsla(${h}, 100%, 50%, ${a}), rgba(255, 255, 255, ${a}))
  `;
  $: style = `background: ${paletteGradient};`;
</script>

<style>
  .palette {
    position: relative;
    width: 100%;
    height: 175px;
  }

  .picker {
    position: absolute;
    width: 16px;
    height: 16px;
    background: transparent;
    border: 2px solid white;
    border-radius: 50%;
  }
</style>

<div bind:this={palette} on:click={handleClick} class="palette" {style}>
  <div class="picker" />
</div>
