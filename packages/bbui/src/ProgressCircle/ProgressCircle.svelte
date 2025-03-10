<script lang="ts">
  import "@spectrum-css/progresscircle/dist/index-vars.css"

  export let size: "S" | "M" | "L" = "M"
  function convertSize(size: "S" | "M" | "L"): string | undefined {
    switch (size) {
      case "S":
        return "small"
      case "L":
        return "large"
      default:
        return
    }
  }

  export let value: number | null = null
  export let minValue: number = 0
  export let maxValue: number = 100

  let subMask1Style: string | undefined
  let subMask2Style: string | undefined
  $: calculateSubMasks(value)

  function calculateSubMasks(value: number | null): void {
    if (value) {
      let percentage = ((value - minValue) / (maxValue - minValue)) * 100
      let angle: number
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

  export let overBackground: boolean = false
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
