<script>
  import { ModalContent, Select } from "@budibase/bbui"
  import { themeStore } from "@/stores/portal"
  import { ThemeOptions } from "@budibase/shared-core"
</script>

<ModalContent title="Theme">
  <Select
    options={ThemeOptions}
    bind:value={$themeStore.theme}
    placeholder={null}
    getOptionLabel={x => x.name}
    getOptionValue={x => x.id}
  />
</ModalContent>
