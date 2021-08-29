<script>
  import { localeStore } from "builderStore"
  import { getLabel } from "builderStore/store/i18n.js"
  import { Select, Layout } from "@budibase/bbui"
</script>

<Layout justifyItems="end">
  <div style="width: 100px;">
    <Select
      options={$localeStore.options}
      placeholder={null}
      bind:value={$localeStore.locale}
      getOptionLabel={getLabel}
    />
  </div>
</Layout>

<style>
</style>
