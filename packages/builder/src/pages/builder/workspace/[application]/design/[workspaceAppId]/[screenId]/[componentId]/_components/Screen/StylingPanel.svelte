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
        options: [
          {
            label: "Warm Flame",
            value:
              "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);",
          },
          {
            label: "Night Fade",
            value: "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);",
          },
          {
            label: "Spring Warmth",
            value: "linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%);",
          },
          {
            label: "Sunny Morning",
            value: "linear-gradient(120deg, #f6d365 0%, #fda085 100%);",
          },
          {
            label: "Winter Neva",
            value: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);",
          },
          {
            label: "Tempting Azure",
            value: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);",
          },
          {
            label: "Heavy Rain",
            value: "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);",
          },
          {
            label: "Deep Blue",
            value: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);",
          },
          {
            label: "Near Moon",
            value: "linear-gradient(to top, #5ee7df 0%, #b490ca 100%);",
          },
          {
            label: "Wild Apple",
            value: "linear-gradient(to top, #d299c2 0%, #fef9d7 100%);",
          },
          {
            label: "Plum Plate",
            value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%);",
          },
          {
            label: "Peach Kiss",
            value:
              "radial-gradient(circle farthest-corner at 50% 100%,rgba(255,173,138,.50), rgba(255,248,247,1) 100%);",
          },
          {
            label: "Flamingo Sunrise",
            value:
              "-webkit-radial-gradient(center top, rgb(255, 250, 245), rgb(255, 242, 242))",
          },
          {
            label: "Budi Mist",
            value:
              "radial-gradient(circle, rgba(252,215,212,1) 0%, rgba(255,227,214,1) 50%, rgba(207,218,255,1) 100%);",
          },
          {
            label: "Ballet Slipper",
            value:
              "linear-gradient(135deg, rgba(252,215,212,1) 20%, rgba(207,218,255,1) 100%);",
          },
          {
            label: "Black Noir",
            value:
              "linear-gradient(312deg, rgba(60,60,60,1) 0%, rgba(42,42,42,1) 100%);",
          },
        ],
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
