<script>
  import { ModalContent } from "@budibase/bbui"
  import { Select } from "@budibase/bbui"
  import { themeStore } from "builderStore"
  import { Constants } from "@budibase/frontend-core"
</script>

<ModalContent title="Theme">
  <Select
    options={Constants.Themes}
    bind:value={$themeStore.theme}
    placeholder={null}
    getOptionLabel={x => x.name}
    getOptionValue={x => x.class}
  />
</ModalContent>
