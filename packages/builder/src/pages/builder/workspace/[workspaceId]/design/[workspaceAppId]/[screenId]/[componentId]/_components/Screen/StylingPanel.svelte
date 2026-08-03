<script>
  import { get } from "svelte/store"
  import {
    DetailSummary,
    ActionButton,
    Drawer,
    Button,
    Select,
    notifications,
  } from "@budibase/bbui"
  import PropertyControl from "@/components/design/settings/controls/PropertyControl.svelte"
  import ColorPicker from "@/components/design/settings/controls/ColorPicker.svelte"
  import ClientBindingPanel from "@/components/common/bindings/ClientBindingPanel.svelte"
  import { getBindableProperties } from "@/dataBinding"
  import { selectedScreen, screenStore, themeStore } from "@/stores/builder"
  import { background } from "../Component/componentStyles"

  let customCssDrawer
  let tempCustomCss = ""

  $: bindings = getBindableProperties($selectedScreen, null)
  $: backgroundChanged =
    !!$selectedScreen?.screenBackground || !!$selectedScreen?.screenGradient

  const updateSetting = async (key, value) => {
    try {
      await screenStore.updateSetting(get(selectedScreen), key, value)
    } catch (error) {
      notifications.error("Error updating style")
    }
  }

  const openCustomCssDrawer = () => {
    tempCustomCss = $selectedScreen?.screenCustomCss || ""
    customCssDrawer.show()
  }

  const saveCustomCss = async () => {
    try {
      await screenStore.updateSetting(
        get(selectedScreen),
        "screenCustomCss",
        tempCustomCss
      )
      customCssDrawer.hide()
    } catch (error) {
      notifications.error("Error updating custom style")
    }
  }
</script>

<DetailSummary
  collapsible={false}
  name={`Background${backgroundChanged ? " *" : ""}`}
>
  <div class="styles">
    <PropertyControl
      label="Color"
      control={ColorPicker}
      value={$selectedScreen?.screenBackground}
      onChange={val => updateSetting("screenBackground", val)}
      props={{ spectrumTheme: $themeStore.theme }}
    />
    <PropertyControl
      label="Gradient"
      control={Select}
      value={$selectedScreen?.screenGradient}
      onChange={val => updateSetting("screenGradient", val)}
      props={{
        placeholder: "None",
        options:
          background.settings.find(s => s.label === "Gradient")?.options || [],
      }}
    />
  </div>
</DetailSummary>

<DetailSummary
  name={`Custom CSS${$selectedScreen?.screenCustomCss ? " *" : ""}`}
  collapsible={false}
>
  <ActionButton on:click={openCustomCssDrawer}>Edit custom CSS</ActionButton>
</DetailSummary>

{#key $selectedScreen?._id}
  <Drawer
    bind:this={customCssDrawer}
    title="Custom CSS"
    on:drawerHide
    on:drawerShow
  >
    <svelte:fragment slot="description">
      Your CSS will be applied to the screen area
    </svelte:fragment>
    <Button cta slot="buttons" on:click={saveCustomCss}>Save</Button>
    <svelte:component
      this={ClientBindingPanel}
      slot="body"
      value={tempCustomCss}
      on:change={event => (tempCustomCss = event.detail)}
      allowJS
      {bindings}
      autofocusEditor={true}
    />
  </Drawer>
{/key}

<style>
  .styles {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 8px;
  }
</style>
