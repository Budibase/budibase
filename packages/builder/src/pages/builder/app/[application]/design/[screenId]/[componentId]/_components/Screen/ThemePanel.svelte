<script>
  import {
    Layout,
    Label,
    ColorPicker,
    notifications,
    Icon,
    Body,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import { get } from "svelte/store"
  import { DefaultAppTheme } from "constants"
  import AppThemeSelect from "./AppThemeSelect.svelte"
  import ButtonRoundnessSelect from "./ButtonRoundnessSelect.svelte"
  import PropertyControl from "components/design/settings/controls/PropertyControl.svelte"

  $: customTheme = $store.customTheme || {}

  const update = async (property, value) => {
    try {
      store.actions.customTheme.save({
        ...get(store).customTheme,
        [property]: value,
      })
    } catch (error) {
      notifications.error("Error updating custom theme")
    }
  }
</script>

<div class="info">
  <Icon name="InfoOutline" size="S" />
  <Body size="S">These settings apply to all screens</Body>
</div>
<Layout noPadding gap="S">
  <Layout noPadding gap="XS">
    <AppThemeSelect />
  </Layout>
  <Layout noPadding gap="XS">
    <Label>Button roundness</Label>
    <ButtonRoundnessSelect
      {customTheme}
      on:change={e => update("buttonBorderRadius", e.detail)}
    />
  </Layout>
  <PropertyControl
    label="Accent color"
    control={ColorPicker}
    value={customTheme.primaryColor || DefaultAppTheme.primaryColor}
    onChange={val => update("primaryColor", val)}
    props={{
      spectrumTheme: $store.theme,
    }}
  />
  <PropertyControl
    label="Hover"
    control={ColorPicker}
    value={customTheme.primaryColorHover || DefaultAppTheme.primaryColorHover}
    onChange={val => update("primaryColorHover", val)}
    props={{
      spectrumTheme: $store.theme,
    }}
  />
</Layout>

<style>
  .info {
    background-color: var(--background-alt);
    padding: 12px;
    display: flex;
    border-radius: 4px;
    gap: 4px;
  }
  .info :global(svg) {
    margin-right: 5px;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
