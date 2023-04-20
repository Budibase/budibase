<script>
  import { _ } from "../../../../../../../../../lang/i18n"
  import Panel from "components/design/Panel.svelte"
  import {
    Layout,
    Label,
    ActionGroup,
    ActionButton,
    Checkbox,
    Select,
    ColorPicker,
    Input,
    notifications,
  } from "@budibase/bbui"
  import NavigationLinksEditor from "./NavigationLinksEditor.svelte"
  import { store } from "builderStore"
  import { DefaultAppTheme } from "constants"

  const update = async (key, value) => {
    try {
      let navigation = $store.navigation
      navigation[key] = value
      await store.actions.navigation.save(navigation)
    } catch (error) {
      notifications.error(
        $_(
          "pages.builder.app.application.design.screenId.navigation._components.NavigationSettingsPanel.Error_updating"
        )
      )
    }
  }
</script>

<Panel title="Navigation" borderRight>
  <Layout paddingX="L" paddingY="XL" gap="S">
    <NavigationLinksEditor />
    <Layout noPadding gap="XS">
      <Label
        >{$_(
          "pages.builder.app.application.design.screenId.navigation._components.NavigationSettingsPanel.Position"
        )}</Label
      >
      <ActionGroup quiet>
        <ActionButton
          selected={$store.navigation.navigation === "Top"}
          quiet={$store.navigation.navigation !== "Top"}
          icon="PaddingTop"
          on:click={() => update("navigation", "Top")}
        />
        <ActionButton
          selected={$store.navigation.navigation === "Left"}
          quiet={$store.navigation.navigation !== "Left"}
          icon="PaddingLeft"
          on:click={() => update("navigation", "Left")}
        />
      </ActionGroup>
    </Layout>
    {#if $store.navigation.navigation === "Top"}
      <Checkbox
        text={$_(
          "pages.builder.app.application.design.screenId.navigation._components.NavigationSettingsPanel.Sticky_header"
        )}
        value={$store.navigation.sticky}
        on:change={e => update("sticky", e.detail)}
      />
      <Select
        label="Width"
        options={["Max", "Large", "Medium", "Small"]}
        plaveholder={null}
        value={$store.navigation.navWidth}
        on:change={e => update("navWidth", e.detail)}
      />
    {/if}
    <Layout noPadding gap="XS">
      <Checkbox
        text="Logo"
        value={!$store.navigation.hideLogo}
        on:change={e => update("hideLogo", !e.detail)}
      />
      {#if !$store.navigation.hideLogo}
        <Input
          value={$store.navigation.logoUrl}
          on:change={e => update("logoUrl", e.detail)}
          placeholder={$_(
            "pages.builder.app.application.design.screenId.navigation._components.NavigationSettingsPanel.Add_logo"
          )}
          updateOnChange={false}
        />
      {/if}
    </Layout>
    <Layout noPadding gap="XS">
      <Checkbox
        text="Title"
        value={!$store.navigation.hideTitle}
        on:change={e => update("hideTitle", !e.detail)}
      />
      {#if !$store.navigation.hideTitle}
        <Input
          value={$store.navigation.title}
          on:change={e => update("title", e.detail)}
          placeholder={$_(
            "pages.builder.app.application.design.screenId.navigation._components.NavigationSettingsPanel.Add_title"
          )}
          updateOnChange={false}
        />
      {/if}
    </Layout>
    <Layout noPadding gap="XS">
      <Label
        >{$_(
          "pages.builder.app.application.design.screenId.navigation._components.NavigationSettingsPanel.Background_color"
        )}r</Label
      >
      <ColorPicker
        spectrumTheme={$store.theme}
        value={$store.navigation.navBackground || DefaultAppTheme.navBackground}
        on:change={e => update("navBackground", e.detail)}
      />
    </Layout>
    <Layout noPadding gap="XS">
      <Label
        >{$_(
          "pages.builder.app.application.design.screenId.navigation._components.NavigationSettingsPanel.Text_color"
        )}</Label
      >
      <ColorPicker
        spectrumTheme={$store.theme}
        value={$store.navigation.navTextColor || DefaultAppTheme.navTextColor}
        on:change={e => update("navTextColor", e.detail)}
      />
    </Layout>
  </Layout>
</Panel>
