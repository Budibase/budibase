<script>
  import "@spectrum-css/buttongroup/dist/index-vars.css"
  export let vertical = false

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
>
  <slot />
</div>
