<script lang="ts">
  import "@spectrum-css/progressbar/dist/index-vars.css"

  export let value: number | boolean = false
  export let duration: number = 1000
  export let width: string | boolean = false
  export let sideLabel: boolean = false
  export let hidePercentage: boolean = true
  export let color: "red" | "green" | undefined = undefined // red, green, default = blue
  export let size: string = "M"
</script>

<div
  class:spectrum-ProgressBar--indeterminate={!value && value !== 0}
  class:spectrum-ProgressBar--sideLabel={sideLabel}
  class="spectrum-ProgressBar spectrum-ProgressBar--size{size}"
  role="progressbar"
  aria-valuenow={typeof value === "number" ? value : undefined}
  aria-valuemin="0"
  aria-valuemax="100"
  style={width ? `width: ${typeof width === "string" ? width : ""};` : ""}
>
  {#if $$slots}
    <div
      class="spectrum-FieldLabel spectrum-ProgressBar-label spectrum-FieldLabel--size{size}"
    >
      <slot />
    </div>
  {/if}
  {#if !hidePercentage && (value || value === 0)}
    <div
      class="spectrum-FieldLabel spectrum-ProgressBar-percentage spectrum-FieldLabel--size{size}"
    >
      {Math.round(Number(value))}%
    </div>
  {/if}
  <div class="spectrum-ProgressBar-track">
    <div
      class="spectrum-ProgressBar-fill"
      class:color-green={color === "green"}
      class:color-red={color === "red"}
      style="width: {typeof value === 'number'
        ? value
        : 0}%; --duration: {duration}ms;"
    />
  </div>
  <div class="spectrum-ProgressBar-label" hidden={false} />
</div>

<style>
  .color-green {
    background: #009562;
  }
  .color-red {
    background: #dd2019;
  }
  .spectrum-ProgressBar-fill {
    transition: width var(--duration) ease-out;
  }
</style>
