<script>
  import { cssVars, createClasses } from "./cssVars"
  import { buildStyle } from "./buildStyle"
  export let className = "default"
  export let disabled = false
  export let text
  export let onClick
  export let background
  export let color
  export let border
  export let padding
  export let hoverColor
  export let hoverBackground
  export let hoverBorder
  export let fontFamily

  export let _bb
  let theButton
  let cssVariables
  let buttonStyles

  let customHoverColorClass
  let customHoverBorderClass
  let customHoverBackClass

  let customClasses = ""

  $: if (_bb.props._children && _bb.props._children.length > 0)
    theButton && _bb.attachChildren(theButton)

  $: {
    cssVariables = {
      hoverColor,
      hoverBorder,
      hoverBackground,
      background,
      color,
      border,
    }

    buttonStyles = buildStyle({
      padding,
      "font-family": fontFamily,
    })

    customClasses = createClasses({
      hoverColor,
      hoverBorder,
      hoverBackground,
      background,
      border,
      color,
    })
  }

  const clickHandler = () => {
    _bb.call(onClick)
  }
</script>

<button
  bind:this={theButton}
  use:cssVars={cssVariables}
  class="{className}
  {customClasses}"
  disabled={disabled || false}
  on:click={clickHandler}
  style={buttonStyles}>
  {#if !_bb.props._children || _bb.props._children.length === 0}{text}{/if}
</button>

<style>
  .default {
    font-family: inherit;
    font-size: inherit;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 2px;
    color: #000333;
    outline: none;
  }

  .default:active {
    background-color: #f9f9f9;
  }

  .default:focus {
    border-color: #666;
  }

  .border {
    border: var(--border);
  }

  .color {
    color: var(--color);
  }

  .background {
    background: var(--background);
  }

  .hoverBorder:hover {
    border: var(--hoverBorder);
  }

  .hoverColor:hover {
    color: var(--hoverColor);
  }

  .hoverBack:hover {
    background: var(--hoverBackground);
  }
</style>
