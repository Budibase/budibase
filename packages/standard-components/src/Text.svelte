<script>
  import { getContext } from "svelte"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let text
  export let color
  export let align
  export let bold
  export let italic
  export let underline
  export let size

  $: placeholder = $builderStore.inBuilder && !text
  $: componentText = $builderStore.inBuilder
    ? text || $component.name || "Placeholder text"
    : text || ""

  // Add color styles to main styles object, otherwise the styleable helper
  // overrides the color when it's passed as inline style.
  $: styles = enrichStyles($component.styles, color)

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
</script>

<p
  use:styleable={styles}
  class:placeholder
  class:bold
  class:italic
  class:underline
  class="align--{align || 'left'} size--{size || 'M'}"
>
  {componentText}
</p>

<style>
  p {
    display: inline-block;
    white-space: pre-wrap;
    margin: 0;
  }
  .placeholder {
    font-style: italic;
    color: var(--spectrum-global-color-gray-600);
  }
  .bold {
    font-weight: 600;
  }
  .italic {
    font-style: italic;
  }
  .underline {
    text-decoration: underline;
  }
  .size--S {
    font-size: 14px;
  }
  .size--M {
    font-size: 16px;
  }
  .size--L {
    font-size: 18px;
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
