<script>
  import { onMount, createEventDispatcher } from "svelte"
  import {drag, keyevents} from "../actions"

  export let value = 1
  export let type = "hue"

  const dispatch = createEventDispatcher()

  let slider
  let sliderWidth = 0
  let upperLimit = type === "hue" ? 360 : 1
  let incrementFactor = type === "hue" ? 1 : 0.01

  const isWithinLimit = value => value >= 0 && value <= upperLimit

  function onSliderChange(mouseX, isDrag = false) {
    const { left, width } = slider.getBoundingClientRect()
    let clickPosition = mouseX - left

    let percentageClick = (clickPosition / sliderWidth).toFixed(2)

    if (percentageClick >= 0 && percentageClick <= 1) {
      
      let value = type === "hue" ? 360 * percentageClick : percentageClick
      dispatch("change", { color: value, isDrag })
    }
  }
  
  function handleLeftKey() {
    let v = value - incrementFactor
    if(isWithinLimit(v)) {
      value = v
      dispatch("change", { color: value })
    }
  }

  function handleRightKey() {
    let v = value + incrementFactor
    if(isWithinLimit(v)) {
      value = v
      dispatch("change", { color: value })

    }
  }
  
  $: thumbPosition =
    type === "hue" ? sliderWidth * (value / 360) : sliderWidth * value

  $: style = `transform: translateX(${thumbPosition - 6}px);`
</script>

<div
  tabindex="0"
  bind:this={slider}
  use:keyevents={{37: handleLeftKey, 39: handleRightKey}}
  bind:clientWidth={sliderWidth}
  on:click={event => onSliderChange(event.clientX)}
  class="color-format-slider"
  class:hue={type === 'hue'}
  class:alpha={type === 'alpha'}>
  <div
    use:drag
    on:drag={e => onSliderChange(e.detail, true)}
    on:dragend
    class="slider-thumb"
    {style} />
</div>

<style>
  .color-format-slider {
    position: relative;
    align-self: center;
    height: 8px;
    width: 150px;
    border-radius: 10px;
    margin: 10px 0px;
    border: 1px solid #e8e8ef;
    cursor: pointer;
    outline-color:  #003cb0;
    outline-width: thin;
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
    border: 1px solid #777676;
    border-radius: 50%;
    background-color: #ffffff;
    cursor: grab;
  }
</style>
