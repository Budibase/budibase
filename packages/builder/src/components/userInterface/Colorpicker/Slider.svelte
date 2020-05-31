<script>
  import { onMount, createEventDispatcher } from "svelte";
  import dragable from "./drag.js";

  export let type = "hue";

  const dispatch = createEventDispatcher();

  let slider;
  let dimensions = {};
  let thumbPosition = 0;

  onMount(() => {
    if (slider) {
      dimensions = slider.getBoundingClientRect();
    }
  });

  function handleClick(mouseX) {
    const { left, width } = dimensions;
    let clickPosition = mouseX - left;
    debugger;
    if (clickPosition >= 0 && clickPosition <= width) {
      thumbPosition = clickPosition;
      let percentageClick = thumbPosition / width;
      let value =
        type === "hue"
          ? Math.round(360 * percentageClick).toString()
          : percentageClick.toFixed(2);
      dispatch("change", value);
    }
  }

  $: style = `transform: translateX(${thumbPosition - 6}px);`;
</script>

<style>
  .color-format-slider {
    position: relative;
    align-self: center;
    height: 8px;
    width: 220px;
    border-radius: 10px;
    margin: 10px 0px;
    border: 1px solid #e8e8ef;
  }

  .hue {
    background: linear-gradient(
      to right,
      hsl(0, 100%, 50%),
      hsl(60, 100%, 50%),
      hsl(120, 100%, 50%),
      hsl(180, 100%, 50%),
      hsl(240, 100%, 50%),
      hsl(300, 100%, 50%),
      hsl(360, 100%, 50%)
    );
  }

  .alpha {
    background: linear-gradient(to right, transparent, rgb(0 0 0));
  }

  .slider-thumb {
    position: absolute;
    bottom: -3px;
    height: 12px;
    width: 12px;
    border: 1px solid black;
    border-radius: 50%;
    background-color: #ffffff;
  }
</style>

<div
  bind:this={slider}
  on:click={event => handleClick(event.clientX)}
  class="color-format-slider"
  class:hue={type === 'hue'}
  class:alpha={type === 'alpha'}>
  <div
    use:dragable
    on:drag={e => handleClick(e.detail)}
    class="slider-thumb"
    {style} />
</div>
