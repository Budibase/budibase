<script>
  import "@spectrum-css/actiongroup/dist/index-vars.css"

  export let vertical = false
  export let justified = false
  export let quiet = false
  export let compact = false

  // Attaches a spectrum-ActionGroup-item class to buttons inside the div
  function group(element) {
    const buttons = Array.from(element.getElementsByTagName("button"))
    buttons.forEach(button => {
      button.classList.add("spectrum-ActionGroup-item")
    })
  }
</script>

<div
  use:group
  class:spectrum-ActionGroup--vertical={vertical}
  class:spectrum-ActionGroup--justified={justified}
  class:spectrum-ActionGroup--quiet={quiet}
  class:spectrum-ActionGroup--compact={compact}
  class="spectrum-ActionGroup"
>
  <slot />
</div>
