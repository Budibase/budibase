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

  let modal

  const defaultTheme = {
    primaryColor: "var(--spectrum-global-color-blue-600)",
    primaryColorHover: "var(--spectrum-global-color-blue-500)",
    buttonBorderRadius: "16px",
    navBackground: "var(--spectrum-global-color-gray-50)",
    navTextColor: "var(--spectrum-global-color-gray-800)",
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
  <ActionButton icon="Brush" on:click={modal.show}>Theme</ActionButton>
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
              defaultTheme.buttonBorderRadius}
            on:change={updateProperty("buttonBorderRadius")}
            options={buttonBorderRadiusOptions}
          />
        </div>
      </div>
      <div class="setting">
        <Label size="L">Accent color</Label>
        <ColorPicker
          spectrumTheme={$store.theme}
          value={$store.customTheme?.primaryColor || defaultTheme.primaryColor}
          on:change={updateProperty("primaryColor")}
        />
      </div>
      <div class="setting">
        <Label size="L">Accent color (hover)</Label>
        <ColorPicker
          spectrumTheme={$store.theme}
          value={$store.customTheme?.primaryColorHover ||
            defaultTheme.primaryColorHover}
          on:change={updateProperty("primaryColorHover")}
        />
      </div>
      <div class="setting">
        <Label size="L">Navigation bar background color</Label>
        <ColorPicker
          spectrumTheme={$store.theme}
          value={$store.customTheme?.navBackground ||
            defaultTheme.navBackground}
          on:change={updateProperty("navBackground")}
        />
      </div>
      <div class="setting">
        <Label size="L">Navigation bar text color</Label>
        <ColorPicker
          spectrumTheme={$store.theme}
          value={$store.customTheme?.navTextColor || defaultTheme.navTextColor}
          on:change={updateProperty("navTextColor")}
        />
      </div>
    </Layout>
    <div slot="footer">
      <Button secondary quiet on:click={resetTheme}>Reset</Button>
    </div>
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
  }
  .select-wrapper {
    width: 100px;
  }
</style>
