<script lang="ts">
  import { getPhosphorIcon } from "../helpers"

  export let size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" = "M"
  export let name: string = "plus"
  export let hidden: boolean = false
  export let hoverable: boolean = false
  export let disabled: boolean = false
  export let color: string | undefined = undefined
  export let hoverColor: string | undefined = undefined
  export let tooltip: string | undefined = undefined
  export let weight: "regular" | "bold" | "fill" = "regular"

  const sizeMap = {
    XS: "round(0.75rem, 1px)",
    S: "round(1rem, 1px)",
    M: "round(1.25rem, 1px)",
    L: "round(1.5rem, 1px)",
    XL: "round(2rem, 1px)",
    XXL: "round(2.5rem, 1px)",
    XXXL: "round(5rem, 1px)",
  }

  $: phosphorIconName = getPhosphorIcon(name)
  $: phosphorClass = `ph ph-${weight} ph-${phosphorIconName}`
  $: style = generateStyle(size, color, hoverColor)

  const generateStyle = (
    sizeProp: typeof size,
    colorProp: typeof color,
    hoverColorProp: typeof hoverColor
  ) => {
    let style = `--size:${sizeMap[sizeProp]};`
    if (colorProp) {
      style += `--color:${colorProp};`
    }
    if (hoverColorProp) {
      style += `--hover-color:${hoverColorProp};`
    }
    return style
  }
</script>

<i
  on:contextmenu
  on:click
  on:mouseover
  on:mouseleave
  on:focus
  class:hoverable
  class:disabled
  class={phosphorClass}
  {style}
  aria-hidden={hidden ? "true" : "false"}
  aria-label={tooltip || name}
  title={tooltip}
/>

<style>
  i {
    display: grid;
    place-items: center;
    color: var(--color);
    transition: color 130ms ease-out;
    font-size: var(--size);
  }
  i.hoverable {
    pointer-events: all;
  }
  i.hoverable:hover {
    color: var(--hover-color, var(--spectrum-global-color-gray-900));
    cursor: pointer;
  }
  i.hoverable:active {
    color: var(--hover-color, var(--spectrum-global-color-gray-900));
  }
  i.disabled {
    color: var(--spectrum-global-color-gray-500);
    pointer-events: none;
  }
</style>
