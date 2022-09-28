<script>
  import Panel from "components/design/Panel.svelte"
  import { Layout, Label, ColorPicker, notifications } from "@budibase/bbui"
  import { store } from "builderStore"
  import { get } from "svelte/store"
  import { DefaultAppTheme } from "constants"
  import AppThemeSelect from "./AppThemeSelect.svelte"
  import ButtonRoundnessSelect from "./ButtonRoundnessSelect.svelte"

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

<Panel title="Theme" borderRight>
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Layout noPadding gap="XS">
      <Label>Theme</Label>
      <AppThemeSelect />
    </Layout>
    <Layout noPadding gap="XS">
      <Label>Button roundness</Label>
      <ButtonRoundnessSelect
        {customTheme}
        on:change={e => update("buttonBorderRadius", e.detail)}
      />
    </Layout>
    <Layout noPadding gap="XS">
      <Label>Accent color</Label>
      <ColorPicker
        spectrumTheme={$store.theme}
        value={customTheme.primaryColor || DefaultAppTheme.primaryColor}
        on:change={e => update("primaryColor", e.detail)}
      />
    </Layout>
    <Layout noPadding gap="XS">
      <Label>Accent color (hover)</Label>
      <ColorPicker
        spectrumTheme={$store.theme}
        value={customTheme.primaryColorHover ||
          DefaultAppTheme.primaryColorHover}
        on:change={e => update("primaryColorHover", e.detail)}
      />
    </Layout>
  </Layout>
</Panel>
