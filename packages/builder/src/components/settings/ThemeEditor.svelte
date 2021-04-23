<script>
  import { themeStore } from "builderStore"
  import { Toggle } from "@budibase/bbui"

  let showAdvanced = false
</script>

<Toggle text="Dark theme" bind:value={$themeStore.darkMode} />
