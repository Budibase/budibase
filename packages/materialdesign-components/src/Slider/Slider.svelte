<script>
  import { MDCSlider } from "@material/slider"
  import { onMount } from "svelte"
  import ClassBuilder from "../ClassBuilder.js"

  const cb = new ClassBuilder("slider", ["continuous"])

  let slider
  let instance

  export let _bb
  export let onChange = value => {}
  export let variant = "continuous"
  export let showTicks = false
  export let min = 0
  export let max = 100
  export let value = 1
  export let step = 1
  export let label = ""
  export let disabled = false

  function handleChange(val) {
    value = val
    if (_bb.isBound(_bb.props.value)) {
      _bb.setStateFromBinding(_bb.props.value, value)
    }
    _bb.call(onChange, val)
  }

  onMount(() => {
    instance = new MDCSlider(slider)
    return () => instance.destroy()
  })

  $: {
    if (instance) {
      instance.value = value
    }
  }

  $: isDiscrete = variant === "discrete"
  $: displayMarkers = isDiscrete && showTicks

  $: modifiers = { variant, displayMarkers }
  $: props = { modifiers }
  $: sliderCls = cb.build({ props })
</script>

<div
  bind:this={slider}
  class={sliderCls}
  tabindex="0"
  role="slider"
  data-step={step}
  aria-valuemin={min}
  aria-valuemax={max}
  aria-valuenow={value}
  aria-label={label}
  aria-disabled={disabled}
  on:MDCSlider:input={e => handleChange(e.detail.value)}
  on:MDCSlider:change={e => handleChange(e.detail.value)}>
  <div class="mdc-slider__track-container">
    <div class="mdc-slider__track" />
    {#if displayMarkers}
      <div class="mdc-slider__track-marker-container" />
    {/if}
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
