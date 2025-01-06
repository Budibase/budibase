<script>
  import "@spectrum-css/progresscircle/dist/index-vars.css"

  export let size = "M"
  function convertSize(size) {
    switch (size) {
      case "S":
        return "small"
      case "L":
        return "large"
      default:
        return
    }
  }

  export let value = null
  export let minValue = 0
  export let maxValue = 100

  let subMask1Style
  let subMask2Style
  $: calculateSubMasks(value)

  function calculateSubMasks(value) {
    if (value) {
      let percentage = ((value - minValue) / (maxValue - minValue)) * 100
      let angle
      if (percentage > 0 && percentage <= 50) {
        angle = -180 + (percentage / 50) * 180
        subMask1Style = `transform: rotate(${angle}deg);`
        subMask2Style = "transform: rotate(-180deg);"
      } else if (percentage > 50) {
        angle = -180 + ((percentage - 50) / 50) * 180
        subMask1Style = "transform: rotate(0deg);"
        subMask2Style = `transform: rotate(${angle}deg);`
      }
    }
  }

  export let overBackground = false
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  on:click
  class:spectrum-ProgressCircle--indeterminate={value == null}
  class:spectrum-ProgressCircle--overBackground={overBackground}
  class="spectrum-ProgressCircle spectrum-ProgressCircle--{convertSize(size)}"
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
