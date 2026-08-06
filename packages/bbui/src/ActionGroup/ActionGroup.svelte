<script lang="ts">
  import "@spectrum-css/actiongroup/dist/index-vars.css"

  export let vertical: boolean = false
  export let justified: boolean = false
  export let quiet: boolean = false
  export let compact: boolean = false

  // Attaches a spectrum-ActionGroup-item class to buttons inside the div
  const group = (element: HTMLElement) => {
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
