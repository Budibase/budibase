<script>
  import { Layout, Heading, Body, Divider, Label, Select } from "@budibase/bbui"
  import { themeStore } from "builderStore"
  import { Constants } from "@budibase/frontend-core"
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading size="M">Theming</Heading>
    <Body>Customize how Budibase looks and feels.</Body>
  </Layout>
  <Divider />
  <div class="fields">
    <div class="field">
      <Label size="L">Builder theme</Label>
      <Select
        options={Constants.Themes}
        bind:value={$themeStore.theme}
        placeholder={null}
        getOptionLabel={x => x.name}
        getOptionValue={x => x.class}
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
