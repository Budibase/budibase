<script>
  import { ColorPicker } from "@budibase/bbui"
  import { themeStore } from "@/stores/builder"

  export let value
</script>

<ColorPicker {value} on:change spectrumTheme={$themeStore.theme} />
