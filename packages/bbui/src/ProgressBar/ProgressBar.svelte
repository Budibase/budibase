<script>
  import "@spectrum-css/progressbar/dist/index-vars.css"
  import { tweened } from "svelte/motion"
  import { cubicOut } from "svelte/easing"

  export let value = false
  export let easing = cubicOut
  export let duration = 1000
  export let width = false
  export let sideLabel = false
  export let overBackground = false

  export let size = "M"

  const progress = tweened(0, {
    duration: duration,
    easing: easing,
  })

  $: if (value) $progress = value
</script>

<div
  class:spectrum-ProgressBar--indeterminate={!value}
  class:spectrum-ProgressBar--sideLabel={sideLabel}
  class="spectrum-ProgressBar spectrum-ProgressBar--size{size}"
  value={$progress}
  role="progressbar"
  aria-valuenow={$progress}
  aria-valuemin="0"
  aria-valuemax="100"
  style={width ? `width: ${width}px;` : ""}
>
  {#if $$slots}
    <div
      class="spectrum-FieldLabel spectrum-ProgressBar-label spectrum-FieldLabel--size{size}"
    >
      <slot />
    </div>
  {/if}
  {#if value}
    <div
      class="spectrum-FieldLabel spectrum-ProgressBar-percentage spectrum-FieldLabel--size{size}"
    >
      {Math.round($progress)}%
    </div>
  {/if}
  <div class="spectrum-ProgressBar-track">
    <div
      class="spectrum-ProgressBar-fill"
      style={value ? `width: ${$progress}%` : ""}
    />
  </div>
  <div class="spectrum-ProgressBar-label" hidden="" />
</div>
