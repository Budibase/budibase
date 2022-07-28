<script>
  import { Layout, Heading, Body, Divider, Label, Select } from "@budibase/bbui"
  import { themeStore } from "builderStore"
  import { capitalise } from "helpers"
  import { Constants } from "@budibase/frontend-core"
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading size="M">Theming</Heading>
    <Body>Customize how Budibase looks and feels.</Body>
  </Layout>
  <Divider size="S" />
  <div class="fields">
    <div class="field">
      <Label size="L">Builder theme</Label>
      <Select
        options={Constants.ThemeOptions}
        bind:value={$themeStore.theme}
        placeholder={null}
        getOptionLabel={capitalise}
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
    grid-template-columns: 120px 1fr;
    align-items: center;
  }
</style>
