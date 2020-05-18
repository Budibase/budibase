<script>
  import { onMount, beforeUpdate, afterUpdate } from "svelte"

  export let value = null
  export let onChange = () => {}
  export let swatches = []

  let picker
  let cp = null

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
  }

  function createPicker() {
    picker = Pickr.create({
      el: cp,
      theme: "nano",
      default: value || "#000000",

      swatches,
      closeWithKey: "Escape",

      components: {
        preview: true,
        opacity: true,
        hue: true,

        interaction: {
          hex: true,
          rgba: true,
          input: true,
          save: true,
        },
      },
    })
  }

  afterUpdate(() => {
    picker.setColor(value)
  })

  onMount(() => {
    getRecentColors()
    createPicker()
    return () => {
      picker.destroyAndRemove()
      picker = null
    }
  })
</script>

<div bind:this={cp} class="color-picker" />
