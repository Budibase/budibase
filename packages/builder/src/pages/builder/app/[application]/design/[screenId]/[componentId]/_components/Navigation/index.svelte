<script>
  import LinksEditor from "./LinksEditor.svelte"
  import { get } from "svelte/store"
  import Panel from "components/design/Panel.svelte"
  import {
    Detail,
    Toggle,
    Body,
    Icon,
    ColorPicker,
    Input,
    Label,
    ActionGroup,
    ActionButton,
    Checkbox,
    notifications,
    Select,
    Combobox,
  } from "@budibase/bbui"
  import {
    themeStore,
    selectedScreen,
    screenStore,
    navigationStore,
  } from "stores/builder"
  import { DefaultAppTheme } from "constants"

  $: screenRouteOptions = $screenStore.screens
    .map(screen => screen.routing?.route)
    .filter(x => x != null)

  const updateShowNavigation = async e => {
    await screenStore.updateSetting(
      get(selectedScreen),
      "showNavigation",
      e.detail
    )
  }

  const update = async (key, value) => {
    try {
      let navigation = $navigationStore
      navigation[key] = value
      await navigationStore.save(navigation)
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
  <div class="generalSection">
    <div class="subheading">
      <Detail>General</Detail>
    </div>
    <div class="toggle">
      <Toggle
        on:change={updateShowNavigation}
        value={$selectedScreen?.showNavigation}
      />
      <Body size="S">Show nav on this screen</Body>
    </div>
  </div>

  {#if $selectedScreen?.showNavigation}
    <div class="divider" />
    <div class="customizeSection">
      <div class="subheading">
        <Detail>Customize</Detail>
      </div>
      <div class="info">
        <Icon name="InfoOutline" size="S" />
        <Body size="S">These settings apply to all screens</Body>
      </div>
      <div class="configureLinks">
        <LinksEditor />
      </div>
      <div class="controls">
        <div class="label">
          <Label size="M">Position</Label>
        </div>
        <ActionGroup quiet>
          <ActionButton
            selected={$navigationStore.navigation === "Top"}
            quiet={$navigationStore.navigation !== "Top"}
            icon="PaddingTop"
            on:click={() => update("navigation", "Top")}
          />
          <ActionButton
            selected={$navigationStore.navigation === "Left"}
            quiet={$navigationStore.navigation !== "Left"}
            icon="PaddingLeft"
            on:click={() => update("navigation", "Left")}
          />
        </ActionGroup>

        {#if $navigationStore.navigation === "Top"}
          <div class="label">
            <Label size="M">Sticky header</Label>
          </div>
          <Checkbox
            value={$navigationStore.sticky}
            on:change={e => update("sticky", e.detail)}
          />
          <div class="label">
            <Label size="M">Width</Label>
          </div>
          <Select
            options={["Max", "Large", "Medium", "Small"]}
            plaveholder={null}
            value={$navigationStore.navWidth}
            on:change={e => update("navWidth", e.detail)}
          />
        {/if}
        <div class="label">
          <Label size="M">Show title</Label>
        </div>
        <Checkbox
          value={!$navigationStore.hideTitle}
          on:change={e => update("hideTitle", !e.detail)}
        />
        {#if !$navigationStore.hideTitle}
          <div class="label">
            <Label size="M">Title</Label>
          </div>
          <Input
            value={$navigationStore.title}
            on:change={e => update("title", e.detail)}
            updateOnChange={false}
          />
        {/if}
        <div class="label">
          <Label>Background</Label>
        </div>
        <ColorPicker
          spectrumTheme={$themeStore.theme}
          value={$navigationStore.navBackground ||
            DefaultAppTheme.navBackground}
          on:change={e => update("navBackground", e.detail)}
        />
        <div class="label">
          <Label>Text</Label>
        </div>
        <ColorPicker
          spectrumTheme={$themeStore.theme}
          value={$navigationStore.navTextColor || DefaultAppTheme.navTextColor}
          on:change={e => update("navTextColor", e.detail)}
        />
      </div>
    </div>

    <div class="divider" />
    <div class="customizeSection">
      <div class="subheading">
        <Detail>Logo</Detail>
      </div>
      <div class="controls">
        <div class="label">
          <Label size="M">Show logo</Label>
        </div>
        <Checkbox
          value={!$navigationStore.hideLogo}
          on:change={e => update("hideLogo", !e.detail)}
        />
        {#if !$navigationStore.hideLogo}
          <div class="label">
            <Label size="M">Logo image URL</Label>
          </div>
          <Input
            value={$navigationStore.logoUrl}
            on:change={e => update("logoUrl", e.detail)}
            updateOnChange={false}
          />
          <div class="label">
            <Label size="M">Logo link URL</Label>
          </div>
          <Combobox
            value={$navigationStore.logoLinkUrl}
            on:change={e => update("logoLinkUrl", e.detail)}
            options={screenRouteOptions}
          />
          <div class="label">
            <Label size="M">New tab</Label>
          </div>
          <Checkbox
            value={!!$navigationStore.openLogoLinkInNewTab}
            on:change={e => update("openLogoLinkInNewTab", !!e.detail)}
          />
        {/if}
      </div>
    </div>
  {/if}
</Panel>

<style>
  .generalSection {
    padding: 13px 13px 25px;
  }

  .customizeSection {
    padding: 13px 13px 25px;
  }
  .subheading {
    margin-bottom: 10px;
  }

  .subheading :global(p) {
    color: var(--grey-6);
  }

  .toggle {
    display: flex;
    align-items: center;
  }

  .divider {
    border-top: 1px solid var(--grey-3);
  }

  .controls {
    position: relative;
    display: grid;
    grid-template-columns: 90px 1fr;
    align-items: start;
    transition: background 130ms ease-out, border-color 130ms ease-out;
    border-left: 4px solid transparent;
    margin: 0 calc(-1 * var(--spacing-xl));
    padding: 0 var(--spacing-xl) 0 calc(var(--spacing-xl) - 4px);
    gap: 12px;
  }

  .label {
    margin-top: 16px;
    transform: translateY(-50%);
  }

  .info {
    background-color: var(--background-alt);
    padding: 12px;
    display: flex;
    border-radius: 4px;
    gap: 4px;
    margin-bottom: 16px;
  }
  .info :global(svg) {
    margin-right: 5px;
    color: var(--spectrum-global-color-gray-600);
  }

  .configureLinks :global(button) {
    margin-bottom: 20px;
    width: 100%;
  }
</style>
