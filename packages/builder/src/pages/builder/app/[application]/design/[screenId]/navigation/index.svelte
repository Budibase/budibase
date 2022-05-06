<script>
  import NavigationPanel from "components/design/navigation/NavigationPanel.svelte"
  import {
    Body,
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
  import NavigationLinksEditor from "./_components/NavigationLinksEditor.svelte"
  import { store } from "builderStore"
  import { onMount } from "svelte"
  import { DefaultAppTheme } from "constants"

  const updateNavigation = async (key, value) => {
    try {
      let navigation = $store.navigation
      navigation[key] = value
      await store.actions.navigation.save(navigation)
    } catch (error) {
      notifications.error("Error updating navigation settings")
    }
  }

  onMount(() => {
    // Add navigation settings to old apps
    let changed = false
    if (!$store.navigation.navigation) {
      $store.navigation.navigation = "Top"
      changed = true
    }
    if (!$store.navigation.hideTitle && !$store.navigation.title) {
      $store.navigation.title = $store.name
      changed = true
    }
    if (!$store.navigation.width) {
      $store.navigation.width = "Large"
      changed = true
    }
    if (changed) {
      store.actions.navigation.save($store.navigation)
    }
  })
</script>

<NavigationPanel title="Navigation">
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Body size="S">
      Your navigation is configured for all the screens within your app
    </Body>
    <Body size="S">
      You can hide and show your navigation for each screen in the screen
      settings
    </Body>
    <NavigationLinksEditor />
    <Layout noPadding gap="XS">
      <Label>Position</Label>
      <ActionGroup quiet>
        <ActionButton
          selected={$store.navigation.navigation === "Top"}
          quiet={$store.navigation.navigation !== "Top"}
          icon="PaddingTop"
          on:click={() => updateNavigation("navigation", "Top")}
        />
        <ActionButton
          selected={$store.navigation.navigation === "Left"}
          quiet={$store.navigation.navigation !== "Left"}
          icon="PaddingLeft"
          on:click={() => updateNavigation("navigation", "Left")}
        />
      </ActionGroup>
    </Layout>
    {#if $store.navigation.navigation === "Top"}
      <Checkbox
        text="Sticky header"
        value={$store.navigation.sticky}
        on:change={e => updateNavigation("sticky", e.detail)}
      />
    {/if}
    <Layout noPadding gap="XS">
      <Checkbox
        text="Logo"
        value={!$store.navigation.hideLogo}
        on:change={e => updateNavigation("hideLogo", !e.detail)}
      />
      {#if !$store.navigation.hideLogo}
        <Input
          value={$store.navigation.logoUrl}
          on:change={e => updateNavigation("logoUrl", e.detail)}
          placeholder="Add logo URL"
          updateOnChange={false}
        />
      {/if}
    </Layout>
    <Layout noPadding gap="XS">
      <Checkbox
        text="Title"
        value={!$store.navigation.hideTitle}
        on:change={e => updateNavigation("hideTitle", !e.detail)}
      />
      {#if !$store.navigation.hideTitle}
        <Input
          value={$store.navigation.title}
          on:change={e => updateNavigation("title", e.detail)}
          placeholder="Add title"
          updateOnChange={false}
        />
      {/if}
    </Layout>
    <Select
      label="Width"
      options={["Max", "Large", "Medium", "Small"]}
      plaveholder={null}
      value={$store.navigation.navWidth}
      on:change={e => updateNavigation("navWidth", e.detail)}
    />
    <Layout noPadding gap="XS">
      <Label>Background color</Label>
      <ColorPicker
        spectrumTheme={$store.theme}
        value={$store.navigation.navBackground || DefaultAppTheme.navBackground}
        on:change={e => updateNavigation("navBackground", e.detail)}
      />
    </Layout>
    <Layout noPadding gap="XS">
      <Label>Text color</Label>
      <ColorPicker
        spectrumTheme={$store.theme}
        value={$store.navigation.navTextColor || DefaultAppTheme.navTextColor}
        on:change={e => updateNavigation("navTextColor", e.detail)}
      />
    </Layout>
  </Layout>
</NavigationPanel>
