<script>
  import Panel from "components/design/Panel.svelte"
  import {
    Layout,
    Label,
    ColorPicker,
    Button,
    notifications,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import { get } from "svelte/store"
  import { DefaultAppTheme } from "constants"
  import AppThemeSelect from "./AppThemeSelect.svelte"

  const ButtonBorderRadiusOptions = [
    {
      label: "Square",
      value: "0",
    },
    {
      label: "Soft edge",
      value: "4px",
    },
    {
      label: "Curved",
      value: "8px",
    },
    {
      label: "Round",
      value: "16px",
    },
  ]

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
      <Label>Buttons</Label>
      <div class="buttons">
        {#each ButtonBorderRadiusOptions as option}
          <div
            class:active={customTheme.buttonBorderRadius === option.value}
            style={`--radius: ${option.value}`}
          >
            <Button
              secondary
              on:click={() => update("buttonBorderRadius", option.value)}
            >
              {option.label}
            </Button>
          </div>
        {/each}
      </div>
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

<style>
  .buttons {
    display: grid;
    grid-template-columns: 100px 100px;
    gap: var(--spacing-m);
  }
  .buttons > div {
    display: contents;
  }
  .buttons > div :global(.spectrum-Button) {
    border-radius: var(--radius) !important;
    border-width: 1px;
    border-color: var(--spectrum-global-color-gray-400);
    font-weight: 600;
  }
  .buttons > div:hover :global(.spectrum-Button) {
    background: var(--spectrum-global-color-gray-700);
    border-color: var(--spectrum-global-color-gray-700);
  }
  .buttons > div.active :global(.spectrum-Button) {
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-800);
    border-color: var(--spectrum-global-color-gray-600);
  }
</style>
