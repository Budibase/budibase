<script lang="ts">
  import {
    ActionButton,
    Body,
    ColorPicker,
    Icon,
    Label,
    Layout,
    PopoverAlignment,
    notifications,
  } from "@budibase/bbui"
  import DetailPopover from "@/components/common/DetailPopover.svelte"
  import { themeStore, appStore } from "@/stores/builder"
  import { DefaultAppTheme } from "@/constants"
  import AppThemeSelect from "./AppThemeSelect.svelte"
  import ButtonRoundnessSelect from "./ButtonRoundnessSelect.svelte"
  import PropertyControl from "@/components/design/settings/controls/PropertyControl.svelte"

  let popover: any

  $: customTheme = $themeStore.customTheme || {}

  export function show() {
    popover?.show()
  }

  export function hide() {
    popover?.hide()
  }

  const update = async (property: string, value: any) => {
    try {
      await themeStore.saveCustom({ [property]: value }, $appStore.appId)
    } catch (error) {
      notifications.error("Error updating custom theme")
    }
  }
</script>

<DetailPopover
  title="Theme"
  bind:this={popover}
  align={PopoverAlignment.Right}
  width={320}
>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton icon="ColorPalette" quiet selected={open} on:click={show} />
  </svelte:fragment>

  <div class="info">
    <Icon name="InfoOutline" size="S" />
    <Body size="S">
      These settings apply to all screens.<br />
      PDFs are always light theme.
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
      on:change={e => update("primaryColor", e.detail)}
      props={{
        spectrumTheme: $themeStore.theme,
      }}
    />
    <PropertyControl
      label="Hover"
      control={ColorPicker}
      value={customTheme.primaryColorHover || DefaultAppTheme.primaryColorHover}
      on:change={e => update("primaryColorHover", e.detail)}
      props={{
        spectrumTheme: $themeStore.theme,
      }}
    />
  </Layout>
</DetailPopover>

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
