<script>
  import { themeStore } from "builderStore"
  import { Select } from "@budibase/bbui"
  import { capitalise } from "../../helpers"
</script>

<Select
  options={$themeStore.options}
  bind:value={$themeStore.theme}
  placeholder={null}
  getOptionLabel={capitalise} />
