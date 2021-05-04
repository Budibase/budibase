<script>
  // WIP! Does not yet work.
  import "@spectrum-css/progresscircle/dist/index-vars.css"
  import { tweened } from "svelte/motion"
  import { cubicOut } from "svelte/easing"

  export let value = false
  export let small
  export let large

  export let overBackground
</script>

<div
  class:spectrum-ProgressBar--indeterminate={!value}
  class:spectrum-ProgressCircle--small={small}
  class:spectrum-ProgressCircle--large={large}
  class="spectrum-ProgressCircle"
>
  <div class="spectrum-ProgressCircle-track" />
  <div class="spectrum-ProgressCircle-fills">
    <div class="spectrum-ProgressCircle-fillMask1">
      <div class="spectrum-ProgressCircle-fillSubMask1">
        <div class="spectrum-ProgressCircle-fill" />
      </div>
    </div>
    <div class="spectrum-ProgressCircle-fillMask2">
      <div class="spectrum-ProgressCircle-fillSubMask2">
        <div class="spectrum-ProgressCircle-fill" />
      </div>
    </div>
  </div>
</div>
