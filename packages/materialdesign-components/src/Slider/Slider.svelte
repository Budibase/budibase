<script>
  import { MDCSlider } from "@material/slider"
  import { onMount } from "svelte"
  import ClassBuilder from "../ClassBuilder.js"

  const cb = new ClassBuilder("slider", ["continuous"])

  let slider
  let instance

  export let variant = "continuous" //or discrete
  export let showTicks = false
  export let min = 0
  export let max = 100
  export let value = 1
  export let step = 1
  export let label = ""
  export let disabled = false

  onMount(() => {
    let s = MDCSlider.attachTo(slider)
    return () => instance.destroy()
  })

  $: {
    if (instance) {
      instance.value = value
    }
  }

  $: instance && console.log("instance dot value: ", instance.value)

  $: isDiscrete = variant === "discrete"
  $: displayMarkers = isDiscrete && showTicks

  $: modifiers = { variant, displayMarkers }
  $: props = { modifiers }
  $: sliderCls = cb.build({ props })

  $: console.log("VALUE", value)
</script>

<div
  bind:this={slider}
  class="mdc-slider mdc-slider--discrete"
  tabindex="0"
  role="slider"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="0"
  aria-label="Select Value"
  on:MDCSlider:change={e => console.log('SLIDER VAL', e.detail.value)}>
  <div class="mdc-slider__track-container">
    <div class="mdc-slider__track" />
  </div>
  <div class="mdc-slider__thumb-container">
    <div class="mdc-slider__pin">
      <span class="mdc-slider__pin-value-marker" />
    </div>
    <svg class="mdc-slider__thumb" width="21" height="21">
      <circle cx="10.5" cy="10.5" r="7.875" />
    </svg>
    <div class="mdc-slider__focus-ring" />
  </div>
</div>

<!-- 
<div
  bind:this={slider}
  class={sliderCls}
  tabindex="0"
  role="slider"
  aria-valuemin={min}
  aria-valuemax={max}
  aria-valuenow={value}
  data-step={step}
  aria-label={label}
  on:MDCSlider:input={e => console.log('INPUT', e.detail.value)}
  on:MDCSlider:change={e => console.log('CHANGE', e.detail.value)}
  aria-disabled={disabled}>
  <div class="mdc-slider__track-container">
    {#if displayMarkers}
      <div class="mdc-slider__track-container">
        <div class="mdc-slider__track" />
        <div class="mdc-slider__track-marker-container" />
      </div>
    {:else}
      <div class="mdc-slider__track" />
    {/if}
  </div>
  <div class="mdc-slider__thumb-container">
    {#if isDiscrete}
      <div class="mdc-slider__pin">
        <span class="mdc-slider__pin-value-marker" />
      </div>
    {/if}
    <svg class="mdc-slider__thumb" width="21" height="21">
      <circle cx="10.5" cy="10.5" r="7.875" />
    </svg>
    <div class="mdc-slider__focus-ring" />
  </div>
</div> -->

<!-- <div class="mdc-slider mdc-slider--discrete" tabindex="0" role="slider"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
     aria-label="Select Value">
  <div class="mdc-slider__track-container">
    <div class="mdc-slider__track"></div>
  </div>
  <div class="mdc-slider__thumb-container">
    <div class="mdc-slider__pin">
      <span class="mdc-slider__pin-value-marker"></span>
    </div>
    <svg class="mdc-slider__thumb" width="21" height="21">
      <circle cx="10.5" cy="10.5" r="7.875"></circle>
    </svg>
    <div class="mdc-slider__focus-ring"></div>
  </div>
</div> -->
