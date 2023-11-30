<script>
  import "@spectrum-css/buttongroup/dist/index-vars.css"

  export let vertical = false
  export let gap = "M"

  $: gapStyle =
    gap === "L"
      ? "var(--spacing-l)"
      : gap === "M"
      ? "var(--spacing-m)"
      : gap === "S"
      ? "var(--spacing-s)"
      : null

  function group(element) {
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
