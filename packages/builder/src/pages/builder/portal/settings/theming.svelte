<script>
  import { Layout, Heading, Body, Divider, Label, Select } from "@budibase/bbui"
  import { themeStore } from "builderStore"
  import { capitalise } from "helpers"
  import { localeStore } from "builderStore"
  import { getLabel } from "builderStore/store/i18n.js"
  import { _ as t } from "svelte-i18n"
</script>

<Layout>
  <Layout gap="XS" noPadding>
    <Heading size="M">{ $t('theming') } & { $t('language') }</Heading>
    <Body>{ $t('customize-how-budibase-looks-and-feels') }</Body>
  </Layout>
  <Divider size="S" />
  <div class="fields">
    <div class="field">
      <Label size="L">{ $t('builder-theme') }</Label>
      <Select
        options={$themeStore.options}
        bind:value={$themeStore.theme}
        placeholder={null}
        getOptionLabel={$t}
      />
    </div>
    <div class="field">
      <Label size="L">{ $t('language') }</Label>
      <Select
        options={$localeStore.options}
        bind:value={$localeStore.locale}
        placeholder={null}
        getOptionLabel={getLabel}
      />
    </div>
  </div>
</Layout>

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 33% 1fr;
    align-items: center;
  }
</style>
