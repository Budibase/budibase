<script>
  // WIP! Does not yet work.
  import "@spectrum-css/progresscircle/dist/index-vars.css"
  import { tweened } from "svelte/motion"
  import { cubicOut } from "svelte/easing"

  export let small
  export let large

  export let value = false
  export let minValue = 0
  export let maxValue = 0

  let subMask1Style
  let subMask2Style
  if (!value) {
    let percentage = ((value - minValue) / (maxValue - minValue)) * 100
    let angle
    if (percentage > 0 && percentage <= 50) {
      angle = -180 + (percentage / 50) * 180
      subMask1Style = `rotate(${angle}deg)`
      subMask2Style = "rotate(-180deg)"
    } else if (percentage > 50) {
      angle = -180 + ((percentage - 50) / 50) * 180
      subMask1Style = "rotate(0deg)"
      subMask2Style = `rotate(${angle}deg)`
    }
  }

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
      <div class="spectrum-ProgressCircle-fillSubMask1" style={subMask1Style}>
        <div class="spectrum-ProgressCircle-fill" />
      </div>
    </div>
    <div class="spectrum-ProgressCircle-fillMask2">
      <div class="spectrum-ProgressCircle-fillSubMask2" style={subMask2Style}>
        <div class="spectrum-ProgressCircle-fill" />
      </div>
    </div>
  </div>
</div>
