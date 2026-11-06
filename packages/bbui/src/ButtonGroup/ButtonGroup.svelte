<script lang="ts">
  import "@spectrum-css/buttongroup/dist/index-vars.css"

  export let vertical: boolean = false
  export let gap: "S" | "M" | "L" = "M"
  export let fullWidth: boolean = false

  $: gapStyle =
    gap === "L"
      ? "var(--spacing-l)"
      : gap === "M"
        ? "var(--spacing-m)"
        : gap === "S"
          ? "var(--spacing-s)"
          : null

  const group = (element: HTMLElement) => {
    const buttons = Array.from(element.getElementsByTagName("button"))
    buttons.forEach(button => {
      button.classList.add("spectrum-ButtonGroup-item")
    })
  }
</script>

<div
  use:group
  class="spectrum-ButtonGroup"
  class:spectrum-ButtonGroup--vertical={vertical}
  class:spectrum-ButtonGroup--fullWidth={fullWidth}
  style={gapStyle ? `gap: ${gapStyle};` : null}
>
  <slot />
</div>

<style>
  .spectrum-ButtonGroup--fullWidth {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
</style>
