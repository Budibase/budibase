<script lang="ts">
  import "@spectrum-css/buttongroup/dist/index-vars.css"

  export let vertical: boolean = false
  export let gap: "S" | "M" | "L" = "M"

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
  style={gapStyle ? `gap: ${gapStyle};` : null}
>
  <slot />
</div>
