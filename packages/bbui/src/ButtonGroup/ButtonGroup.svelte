<script>
  import "@spectrum-css/buttongroup/dist/index-vars.css"
  export let vertical = false

  function group(element) {
    const buttons = Array.from(element.getElementsByTagName("button"))
<<<<<<< HEAD
    buttons.forEach((button) => {
=======
    buttons.forEach(button => {
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
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
