<script>
  import { onMount } from "svelte"
  import { HsvPicker } from "svelte-color-picker"

  // export let initialValue = "#ffffff"
  export let onChange = color => {}
  export let open = false
  let value = "#ffffff"

  let _justMounted = true //see onColorChange
  let pickerHeight = 275
  let colorPreview
  let pickerTopPosition = null

  function rbgaToHexa({ r, g, b, a }) {
    r = r.toString(16)
    g = g.toString(16)
    b = b.toString(16)
    a = Math.round(a * 255).toString(16)

    if (r.length == 1) r = "0" + r
    if (g.length == 1) g = "0" + g
    if (b.length == 1) b = "0" + b
    if (a.length == 1) a = "0" + a

    return "#" + r + g + b + a
  }

  function onColourChange(rgba) {
    value = rbgaToHexa(rgba.detail)

    //Hack: so that color change doesn't fire onMount
    if (!_justMounted) {
      // onChange(value)
    }
    _justMounted = false
  }

  function toggleColorpicker(isOpen) {
    if (isOpen) {
      const {
        y: previewYPosition,
        height: previewHeight,
      } = colorPreview.getBoundingClientRect()

      let wiggleRoom = window.innerHeight - previewYPosition
      let displayTop = wiggleRoom < pickerHeight

      if (displayTop) {
        pickerTopPosition = previewYPosition - (pickerHeight - window.scrollY)
      } else {
        pickerTopPosition = null
      }
    }
    open = isOpen
  }

  $: style = open ? "display: block;" : "display: none;"
  $: pickerStyle = pickerTopPosition ? `top: ${pickerTopPosition}px;` : ""
</script>

<div
  bind:this={colorPreview}
  on:click={() => toggleColorpicker(true)}
  class="color-preview"
  style={`background: ${value}`} />

<div class="colorpicker" {style}>
  <div class="overlay" on:click|self={() => toggleColorpicker(false)} />
  <div class="cp" style={pickerStyle}>
    <HsvPicker on:colorChange={onColourChange} startColor={value} />
  </div>
</div>
<!-- 
OLD LOCAL STORAGE OPTIONS. INCLUDING FOR ADDING LATER
  function getRecentColors() {
    let colorStore = localStorage.getItem("bb:recentColors")
    if (!!colorStore) {
      swatches = JSON.parse(colorStore)
    }
  }

  function setRecentColor(color) {
    if (swatches.length >= 15) {
      swatches.splice(0, 1)
      picker.removeSwatch(0)
    }
    if (!swatches.includes(color)) {
      swatches = [...swatches, color]
      picker.addSwatch(color)
      localStorage.setItem("bb:recentColors", JSON.stringify(swatches))
    }
  } -->

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* background: rgba(5, 5, 5, 0.25); */
  }

  .cp {
    position: absolute;
    right: 25px;
  }
  .color-preview {
    height: 30px;
    width: 100%;
    margin: 5px;
    cursor: pointer;
    border: 1px solid gainsboro;
  }
</style>
