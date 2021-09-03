<script>
  import { get } from "svelte/store"
  import {
    ActionButton,
    Modal,
    ModalContent,
    Layout,
    ColorPicker,
    Label,
    Select,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import AppThemeSelect from "./AppThemeSelect.svelte"

  let modal

  const defaultTheme = {
    primaryColor: "var(--spectrum-global-color-blue-600)",
    primaryColorHover: "var(--spectrum-global-color-blue-500)",
    buttonBorderRadius: "16px",
    navBackground: "var(--spectrum-global-color-gray-100)",
  }

  const buttonBorderRadiusOptions = [
    {
      label: "None",
      value: "0",
    },
    {
      label: "Small",
      value: "4px",
    },
    {
      label: "Medium",
      value: "8px",
    },
    {
      label: "Large",
      value: "16px",
    },
  ]

  const updateProperty = property => {
    return e => {
      store.actions.customTheme.save({
        ...get(store).customTheme,
        [property]: e.detail,
      })
    }
  }
</script>

<div class="container">
  <ActionButton icon="Brush" on:click={modal.show}>Theme</ActionButton>
</div>
<Modal bind:this={modal}>
  <ModalContent
    showConfirmButton={false}
    cancelText="Close"
    showCloseIcon={false}
    title="Theme settings"
  >
    <Layout noPadding gap="S">
      <div class="setting">
        <Label size="L">Theme</Label>
        <AppThemeSelect />
      </div>
      <div class="setting">
        <Label size="L">Button roundness</Label>
        <Select
          autoWidth
          value={$store.customTheme?.buttonBorderRadius ||
            defaultTheme.buttonBorderRadius}
          on:change={updateProperty("buttonBorderRadius")}
          options={buttonBorderRadiusOptions}
        />
      </div>
      <div class="setting">
        <Label size="L">Primary color</Label>
        <ColorPicker
          spectrumTheme={$store.theme}
          value={$store.customTheme?.primaryColor || defaultTheme.primaryColor}
          on:change={updateProperty("primaryColor")}
        />
      </div>
      <div class="setting">
        <Label size="L">Primary color (hover)</Label>
        <ColorPicker
          spectrumTheme={$store.theme}
          value={$store.customTheme?.primaryColorHover ||
            defaultTheme.primaryColorHover}
          on:change={updateProperty("primaryColorHover")}
        />
      </div>
      <div class="setting">
        <Label size="L">Navigation bar background</Label>
        <ColorPicker
          spectrumTheme={$store.theme}
          value={$store.customTheme?.navBackground ||
            defaultTheme.navBackground}
          on:change={updateProperty("navBackground")}
        />
      </div>
    </Layout>
  </ModalContent>
</Modal>

<style>
  .container {
    padding-right: 8px;
  }
  .setting {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--spectrum-global-dimension-static-size-100);
    border-bottom: var(--border-light);
  }
  .setting:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
</style>
