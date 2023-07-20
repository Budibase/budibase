<script>
  import Pane from "components/design/Pane.svelte"
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

  //These were shifted technically the /theme url is unnecessary
  import AppThemeSelect from "./theme/AppThemeSelect.svelte"
  import ButtonRoundnessSelect from "./theme/ButtonRoundnessSelect.svelte"
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

<Pane title="Theme">
  <div class="info">
    <div class="infoHeader">
      <Icon name="InfoOutline" size="S" />
      <Body size="XS">CHANGES WILL APPLY TO ALL SCREENS</Body>
    </div>
    <Body size="S">
      Your theme is configured for all the screens within your app.
    </Body>
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
</Pane>

<!-- Add this to its own component -->
<style>
  .infoHeader {
    display: flex;
    margin-bottom: 5px;
    border-radius: 4px;
  }

  .infoHeader :global(svg) {
    margin-right: 5px;
    color: var(--grey-6);
  }

  .infoHeader :global(p) {
    color: var(--grey-6);
  }

  .info {
    background-color: var(--background-alt);
    padding: 12px;
    margin-bottom: 12px;
  }
</style>
