<script>
  import cssVars from "./cssVars"
  import { buildStyle } from "./buildStyle"
  export let className = "default"
  export let disabled = false
  export let contentText
  export let onClick
  export let background
  export let color
  export let border
  export let padding
  export let hoverColor
  export let hoverBackground
  export let hoverBorder
  export let _children

  export let _bb
  let theButton
  let cssVariables
  let buttonStyles

  let customHoverColorClass
  let customHoverBorderClass
  let customHoverBackClass

  let customClasses = ""

  const createClasses = classes => {
    let all = ""
    for (let cls in classes) {
      if (classes[cls]) {
        all = all + " " + cls
      }
    }
    return all
  }

  $: {
    if (_bb && theButton && _children && _children.length)
      _bb.hydrateChildren(_children, theButton)
  }

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
  {#if !_children || _children.length === 0}{contentText}{/if}
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
    color: #333;
    background-color: #f4f4f4;
    outline: none;
  }

  .default:active {
    background-color: #ddd;
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
