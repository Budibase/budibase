<script>
import { ModalContent, Select } from "@budibase/bbui"
import { Constants } from "@budibase/frontend-core"
import { themeStore } from "stores/portal"
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
