<script>
  import { ColorPicker } from "@budibase/bbui"
  import { store } from "builderStore"

  export let value
</script>

<ColorPicker {value} on:change spectrumTheme={$store.theme} />
