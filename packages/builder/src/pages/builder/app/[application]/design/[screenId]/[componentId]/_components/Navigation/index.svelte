<script>
  import NavItemConfiguration from "./NavItemConfiguration.svelte"
  import { get } from "svelte/store"
  import Panel from "@/components/design/Panel.svelte"
  import {
    Toggle,
    DetailSummary,
    Checkbox,
    notifications,
    Select,
  } from "@budibase/bbui"
  import {
    themeStore,
    selectedScreen,
    screenStore,
    componentStore,
    navigationStore as nav,
  } from "@/stores/builder"
  import { DefaultAppTheme } from "@/constants"
  import PropertyControl from "@/components/design/settings/controls/PropertyControl.svelte"
  import BarButtonList from "@/components/design/settings/controls/BarButtonList.svelte"
  import ColorPicker from "@/components/design/settings/controls/ColorPicker.svelte"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import DrawerBindableCombobox from "@/components/common/bindings/DrawerBindableCombobox.svelte"
  import { getBindableProperties } from "@/dataBinding"

  const positionOptions = [
    { value: "Top", barIcon: "PaddingTop" },
    { value: "Left", barIcon: "PaddingLeft" },
  ]
  const alignmentOptions = [
    { value: "Left", barIcon: "TextAlignLeft" },
    { value: "Center", barIcon: "TextAlignCenter" },
    { value: "Right", barIcon: "TextAlignRight" },
  ]
  const widthOptions = ["Max", "Large", "Medium", "Small"]

  $: bindings = getBindableProperties(
    $selectedScreen,
    $componentStore.selectedComponentId
  )
  $: screenRouteOptions = $screenStore.screens
    .map(screen => screen.routing?.route)
    .filter(x => x != null)

  const updateShowNavigation = async show => {
    await screenStore.updateSetting(get(selectedScreen), "showNavigation", show)
  }

  const update = async (key, value) => {
    try {
      let navigation = $nav
      navigation[key] = value
      await nav.save(navigation)
    } catch (error) {
      notifications.error("Error updating navigation settings")
    }
  }
</script>

<Panel
  title="Navigation"
  icon={$selectedScreen?.showNavigation ? "Visibility" : "VisibilityOff"}
  borderLeft
  wide
>
  <DetailSummary name="General" initiallyShow collapsible={false}>
    <PropertyControl
      control={Toggle}
      props={{ text: "Show nav on this screen" }}
      onChange={updateShowNavigation}
      value={$selectedScreen?.showNavigation}
    />
  </DetailSummary>

  {#if $selectedScreen?.showNavigation}
    <DetailSummary name="Customize" initiallyShow collapsible={false}>
      <NavItemConfiguration {bindings} />
      <div class="settings">
        <PropertyControl
          label="Position"
          control={BarButtonList}
          onChange={position => update("navigation", position)}
          value={$nav.navigation}
          props={{
            options: positionOptions,
          }}
        />
        {#if $nav.navigation === "Top"}
          <PropertyControl
            label="Sticky header"
            control={Checkbox}
            value={$nav.sticky}
            onChange={sticky => update("sticky", sticky)}
          />
          <PropertyControl
            label="Width"
            control={Select}
            onChange={position => update("navWidth", position)}
            value={$nav.navWidth}
            props={{
              placeholder: null,
              options: widthOptions,
            }}
          />
        {/if}
        <PropertyControl
          label="Show title"
          control={Checkbox}
          value={!$nav.hideTitle}
          onChange={show => update("hideTitle", !show)}
        />
        {#if !$nav.hideTitle}
          <PropertyControl
            label="Title"
            control={DrawerBindableInput}
            value={$nav.title}
            onChange={title => update("title", title)}
            {bindings}
            props={{
              updateOnChange: false,
            }}
          />
          <PropertyControl
            label="Text align"
            control={BarButtonList}
            onChange={align => update("textAlign", align)}
            value={$nav.textAlign}
            props={{
              options: alignmentOptions,
            }}
          />
        {/if}
        <PropertyControl
          label="Background"
          control={ColorPicker}
          onChange={color => update("navBackground", color)}
          value={$nav.navBackground || DefaultAppTheme.navBackground}
          props={{
            spectrumTheme: $themeStore.theme,
          }}
        />
        <PropertyControl
          label="Text"
          control={ColorPicker}
          onChange={color => update("navTextColor", color)}
          value={$nav.navTextColor || DefaultAppTheme.navTextColor}
          props={{
            spectrumTheme: $themeStore.theme,
          }}
        />
      </div>
    </DetailSummary>

    <DetailSummary name="Logo" initiallyShow collapsible={false}>
      <div class="settings">
        <PropertyControl
          label="Show logo"
          control={Checkbox}
          value={!$nav.hideLogo}
          onChange={show => update("hideLogo", !show)}
        />
        {#if !$nav.hideLogo}
          <PropertyControl
            label="Logo image URL"
            control={DrawerBindableInput}
            value={$nav.logoUrl}
            onChange={url => update("logoUrl", url)}
            {bindings}
            props={{
              updateOnChange: false,
            }}
          />
          <PropertyControl
            label="Logo link URL"
            control={DrawerBindableCombobox}
            value={$nav.logoLinkUrl}
            onChange={url => update("logoLinkUrl", url)}
            {bindings}
            props={{
              appendBindingsAsOptions: false,
              options: screenRouteOptions,
            }}
          />
          <PropertyControl
            label="New tab"
            control={Checkbox}
            value={$nav.openLogoLinkInNewTab}
            onChange={show => update("openLogoLinkInNewTab", show)}
          />
        {/if}
      </div>
    </DetailSummary>
  {/if}
</Panel>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 8px;
  }
</style>
