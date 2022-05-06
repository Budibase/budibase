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
    Button,
    notifications,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import AppThemeSelect from "./AppThemeSelect.svelte"
  import { DefaultAppTheme } from "constants"

  let modal

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
    return async e => {
      try {
        store.actions.customTheme.save({
          ...get(store).customTheme,
          [property]: e.detail,
        })
      } catch (error) {
        notifications.error("Error updating custom theme")
      }
    }
  }

  const resetTheme = () => {
    try {
      const theme = get(store).theme
      store.actions.customTheme.save({
        ...defaultTheme,
        navBackground:
          theme === "spectrum--light"
            ? "var(--spectrum-global-color-gray-50)"
            : "var(--spectrum-global-color-gray-100)",
      })
    } catch (error) {
      notifications.error("Error saving custom theme")
    }
  }
</script>

<div class="container">
  <ActionButton icon="Brush" on:click={modal.show}>Edit theme</ActionButton>
</div>
<Modal bind:this={modal}>
  <ModalContent
    showConfirmButton={false}
    cancelText="View changes"
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
        <div class="select-wrapper">
          <Select
            placeholder={null}
            value={$store.customTheme?.buttonBorderRadius ||
              DefaultAppTheme.buttonBorderRadius}
            on:change={updateProperty("buttonBorderRadius")}
            options={buttonBorderRadiusOptions}
          />
        </div>
      </div>
      <div class="setting">
        <Label size="L">Accent color</Label>
        <ColorPicker
          spectrumTheme={$store.theme}
          value={$store.customTheme?.primaryColor ||
            DefaultAppTheme.primaryColor}
          on:change={updateProperty("primaryColor")}
        />
      </div>
      <div class="setting">
        <Label size="L">Accent color (hover)</Label>
        <ColorPicker
          spectrumTheme={$store.theme}
          value={$store.customTheme?.primaryColorHover ||
            DefaultAppTheme.primaryColorHover}
          on:change={updateProperty("primaryColorHover")}
        />
      </div>
    </Layout>
    <div slot="footer">
      <Button secondary quiet on:click={resetTheme}>Reset</Button>
    </div>
  </ModalContent>
</Modal>

<style>
  .setting {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .select-wrapper {
    width: 100px;
  }
</style>
