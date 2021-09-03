<script>
  import { get } from "svelte/store"
  import {
    ActionButton,
    Modal,
    ModalContent,
    Layout,
    ColorPicker,
    Label,
  } from "@budibase/bbui"
  import { store } from "builderStore"

  let modal

  const defaultTheme = {
    primaryColor: "var(--spectrum-global-color-blue-600)",
    primaryColorHover: "var(--spectrum-global-color-blue-500)",
  }

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
  <ActionButton icon="Brush" on:click={modal.show}>Edit</ActionButton>
</div>
<Modal bind:this={modal}>
  <ModalContent
    showConfirmButton={false}
    cancelText="Close"
    showCloseIcon={false}
    title="Theme settings"
  >
    <Layout noPadding gap="XS">
      <div class="setting">
        <Label size="L">Primary Color</Label>
        <ColorPicker
          spectrumTheme={$store.theme}
          value={$store.customTheme?.primaryColor || defaultTheme.primaryColor}
          on:change={updateProperty("primaryColor")}
        />
      </div>
      <div class="setting">
        <Label size="L">Primary Color (Hover)</Label>
        <ColorPicker
          spectrumTheme={$store.theme}
          value={$store.customTheme?.primaryColorHover ||
            defaultTheme.primaryColorHover}
          on:change={updateProperty("primaryColorHover")}
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
