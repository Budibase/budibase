<script>
  import "@spectrum-css/tag/dist/index-vars.css"
  import { ClearButton } from "@budibase/bbui"
  import { getContext } from "svelte"

  export let onClick
  export let text = ""
  export let color
  export let textColor
  export let closable = false
  export let size = "M"

  const component = getContext("component")
  const { styleable, builderStore } = getContext("sdk")

  // Add color styles to main styles object, otherwise the styleable helper
  // overrides the color when it's passed as inline style.
  $: styles = enrichStyles($component.styles, color, textColor)
  $: componentText = getComponentText(text, $builderStore, $component)

  const getComponentText = (text, builderState, componentState) => {
    if (!builderState.inBuilder || componentState.editing) {
      return text || " "
    }
    return text || componentState.name || "Placeholder text"
  }

  const enrichStyles = (styles, color, textColor) => {
    if (!color) {
      return styles
    }
    return {
      ...styles,
      normal: {
        ...styles?.normal,
        "background-color": color,
        "border-color": color,
        color: textColor || "white",
        "--spectrum-clearbutton-medium-icon-color": "white",
      },
    }
  }
</script>

<div class="spectrum-Tag spectrum-Tag--size{size}" use:styleable={styles}>
  <span class="spectrum-Tag-label">{componentText}</span>
  {#if closable}
    <ClearButton on:click={onClick} />
  {/if}
</div>

<style>
  .spectrum-Tag--sizeS,
  .spectrum-Tag--sizeM {
    padding: 0 var(--spectrum-global-dimension-size-100);
  }
  .spectrum-Tag--sizeL {
    padding: 0 var(--spectrum-global-dimension-size-150);
  }
  .spectrum-Tag-label {
    height: auto;
  }
</style>
