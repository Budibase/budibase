<script>
  import { onMount, createEventDispatcher } from "svelte"
  import { drag } from "../actions"
  import CheckedBackground from "./CheckedBackground.svelte"

  const dispatch = createEventDispatcher()

  export let h = 0
  export let s = 0
  export let v = 0
  export let a = 1

  let palette

  let paletteHeight,
    paletteWidth = 0

  function handePaletteChange({ mouseX, mouseY }) {
    const { left, top } = palette.getBoundingClientRect()
    let x = mouseX - left
    let y = mouseY - top
    if (x > 0 && y > 0 && x < paletteWidth && y < paletteHeight) {
      let s = (x / paletteWidth) * 100
      let v = 100 - (y / paletteHeight) * 100
      dispatch("change", { s, v })
    }
  }

  $: pickerX = (s * paletteWidth) / 100
  $: pickerY = paletteHeight * ((100 - v) / 100)

  $: paletteGradient = `linear-gradient(to top, rgba(0, 0, 0, 1), transparent),
    linear-gradient(to left, hsla(${h}, 100%, 50%, ${a}), rgba(255, 255, 255, ${a}))
  `
  $: style = `background: ${paletteGradient};`

  $: pickerStyle = `transform: translate(${pickerX - 8}px, ${pickerY - 8}px);`
</script>

<CheckedBackground width="100%">
  <div
    bind:this={palette}
    bind:clientHeight={paletteHeight}
    bind:clientWidth={paletteWidth}
    on:click={event => handePaletteChange({
        mouseX: event.clientX,
        mouseY: event.clientY,
      })}
    class="palette"
    {style}>
    <div
      use:drag
      on:drag={event => handePaletteChange(event.detail)}
      class="picker"
      style={pickerStyle} />
  </div>
</CheckedBackground>

<style>
  .palette {
    position: relative;
    width: 100%;
    height: 140px;
    cursor: crosshair;
    overflow: hidden;
  }

  .picker {
    position: absolute;
    cursor: grab;
    width: 10px;
    height: 10px;
    background: transparent;
    border: 2px solid white;
    border-radius: 50%;
  }

  .picker:active {
    cursor: grabbing;
  }
</style>
