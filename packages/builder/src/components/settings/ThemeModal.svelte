<script>
  import { ModalContent, Select } from "@budibase/bbui"
  import { themeStore } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"
</script>

<ModalContent title="Theme">
  <Select
    options={Constants.ThemeOptions}
    bind:value={$themeStore.theme}
    placeholder={null}
    getOptionLabel={x => x.name}
    getOptionValue={x => x.id}
  />
</ModalContent>
