<script>
  import { getContext } from "svelte"
  import "@spectrum-css/typography/dist/index-vars.css"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let text
  export let color
  export let align
  export let bold
  export let italic
  export let underline
  export let size

  let node
  let touched = false

  $: $component.editing && node?.focus()
  $: placeholder = $builderStore.inBuilder && !text && !$component.editing
  $: componentText = getComponentText(text, $builderStore, $component)
  $: sizeClass = `spectrum-Heading--size${size || "M"}`
  $: alignClass = `align--${align || "left"}`

  // Add color styles to main styles object, otherwise the styleable helper
  // overrides the color when it's passed as inline style.
  $: styles = enrichStyles($component.styles, color)

  const getComponentText = (text, builderState, componentState) => {
    if (!builderState.inBuilder || componentState.editing) {
      return text || ""
    }
    return text || componentState.name || "Placeholder text"
  }

  const enrichStyles = (styles, color) => {
    if (!color) {
      return styles
    }
    return {
      ...styles,
      normal: {
        ...styles?.normal,
        color,
      },
    }
  }

  // Convert contenteditable HTML to text and save
  const updateText = e => {
    if (touched) {
      builderStore.actions.updateProp("text", e.target.textContent)
    }
    touched = false
  }
</script>

{#key $component.editing}
  <h1
    bind:this={node}
    contenteditable={$component.editing}
    use:styleable={styles}
    class:placeholder
    class:bold
    class:italic
    class:underline
    class="spectrum-Heading {sizeClass} {alignClass}"
    on:blur={$component.editing ? updateText : null}
    on:input={() => (touched = true)}
  >
    {componentText}
  </h1>
{/key}

<style>
  h1 {
    white-space: pre-wrap;
    font-weight: 600;
  }
  .placeholder {
    font-style: italic;
    color: var(--spectrum-global-color-gray-600);
  }
  .bold {
    font-weight: 700;
  }
  .italic {
    font-style: italic;
  }
  .underline {
    text-decoration: underline;
  }

  .align--left {
    text-align: left;
  }
  .align--center {
    text-align: center;
  }
  .align--right {
    text-align: right;
  }
  .align-justify {
    text-align: justify;
  }
</style>
