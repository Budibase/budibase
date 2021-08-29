<script>
  import { Select } from "@budibase/bbui"
  import { store } from "builderStore"
  import { _ as t } from "svelte-i18n"

  const themeOptions = [
    {
      label: $t('lightest'),
      value: "spectrum--lightest",
    },
    {
      label: $t('light'),
      value: "spectrum--light",
    },
    {
      label: $t('dark'),
      value: "spectrum--dark",
    },
    {
      label: $t('darkest'),
      value: "spectrum--darkest",
    },
  ]
</script>

<div>
  <Select
    value={$store.theme}
    options={themeOptions}
    placeholder={null}
    on:change={e => store.actions.theme.save(e.detail)}
  />
</div>

<style>
  div {
    padding-right: 8px;
  }
</style>
